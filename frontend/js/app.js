/* ============================================================
   URNA ELETRÔNICA — FASE 1 (FRONT-END)
   js/app.js — orquestração do fluxo de votação.

   Máquina de estados da sessão:
     AGUARDANDO_DIGITOS -> (número completo: CANDIDATO_ENCONTRADO | NUMERO_NULO)
     -> CONFIRMADO (avanca de cargo) -> ... -> FIM -> reinicia.

   Responsabilidades:
     - manter o estado da votação (cargo atual, dígitos, votos);
     - buscar candidato nos dados mock (futuro: backend Java);
     - emitir o som de confirmação via Web Audio API;
     - registrar os votos em localStorage (APENAS para testes —
       na Fase 2 o backend Java assume essa função);
     - controlar a tela final (FIM) e o reinício da sessão.
   ============================================================ */

/* ---------- sequência de cargos e quantidade de dígitos ---------- */
const CARGOS = [
  { nome: "VEREADOR", digitos: 5 },
  { nome: "PREFEITO", digitos: 2 }
];

/* ---------- estado da sessão ---------- */
const estado = {
  indiceCargo: 0,
  digitos: [],
  votoBranco: false,
  candidato: null,
  votosDaSessao: [],   // registros desta sessão, persistidos em localStorage
  finalizada: false
};

const visor  = new Visor();
const teclado = new Teclado({
  digitar:  digitar,
  branco:   votarBranco,
  corrige:  corrigir,
  confirma: confirmar
});

/* ============================================================
   AÇÕES DO ELEITOR
   ============================================================ */

/** Recebe um dígito digitado, se ainda houver espaço. */
function digitar(valor) {
  if (estado.finalizada) return;

  const cargoAtual = CARGOS[estado.indiceCargo];

  // Número já completo (ou voto em branco ativo): ignora novos dígitos
  if (estado.digitos.length >= cargoAtual.digitos || estado.votoBranco) return;

  estado.digitos.push(valor);
  estado.candidato = localizarCandidato();
  atualizarTela();
}

/** Pressiona BRANCO: só vale ANTES de começar a digitar. */
function votarBranco() {
  if (estado.finalizada) return;
  if (estado.digitos.length > 0) {
    visor.mostrarMensagem("Para votar em BRANCO, pressione CORRIGE primeiro.", true);
    return;
  }
  estado.votoBranco = true;
  atualizarTela();
}

/** Pressiona CORRIGE: limpa o voto atual e recomeça o cargo. */
function corrigir() {
  if (estado.finalizada) return;
  estado.digitos = [];
  estado.votoBranco = false;
  estado.candidato = null;
  atualizarTela();
}

/** Pressiona CONFIRMA: valida, registra e avança. */
function confirmar() {
  if (estado.finalizada) return;

  const cargoAtual = CARGOS[estado.indiceCargo];
  const numeroCompleto = estado.digitos.length === cargoAtual.digitos;

  // Validações com mensagens no visor (comportamento real da urna)
  if (estado.votoBranco) {
    registrarVoto(cargoAtual, "BRANCO", null, null);
  } else if (!numeroCompleto) {
    visor.mostrarMensagem("Digite o número completo antes de confirmar.", true);
    return;
  } else if (estado.candidato === null) {
    registrarVoto(cargoAtual, "NULO", null, estado.digitos.join(""));
  } else {
    registrarVoto(cargoAtual, "VALIDO", estado.candidato, estado.candidato.numero);
  }

  emitirSomConfirmacao();
  avancarCargoOuFinalizar();
}

/* ============================================================
   REGRAS INTERNAS
   ============================================================ */

/** Busca o candidato pelo número digitado nos dados mock. */
function localizarCandidato() {
  const cargoAtual = CARGOS[estado.indiceCargo];
  if (estado.digitos.length < cargoAtual.digitos) return null;

  const numero = estado.digitos.join("");
  // MELHORIA FASE 4: usa os candidatos ativos (servidor Java ou, se offline, o mock)
  const tabelaDoCargo = window.CANDIDATOS_ATIVOS[cargoAtual.nome] || {};
  return tabelaDoCargo[numero] || null;
}

/**
 * MELHORIA FASE 4: registra o voto.
 *  1) envia ao servidor Java (POST /voto), se estiver online;
 *  2) mantém o contador de teste no localStorage (BUG-F3: com try/catch;
 *     BUG-F4: no modo realista não guarda a escolha do eleitor).
 */
function registrarVoto(cargo, tipo, candidato, numeroDigitado) {
  const realista = visor.modoRealistaAtivo;

  const registro = {
    cargo: cargo.nome,
    tipo: realista ? null : tipo,                                 // BUG-F4
    candidato: realista || !candidato ? null : candidato.nomeUrna,
    numero: realista ? null : numeroDigitado,
    horario: realista ? null : new Date().toISOString(),
    modoRealista: realista
  };
  estado.votosDaSessao.push(registro);

  // Envio ao back-end (não bloqueia a urna se falhar)
  Api.enviarVoto(cargo.nome, tipo === "BRANCO" ? null : numeroDigitado).then((r) => {
    if (!r.enviado && Api.online) console.warn("[URNa] Falha ao enviar o voto ao servidor:", r);
  });

  // Contador de teste (BUG-F3: uma falha de armazenamento NUNCA pode travar o voto)
  try {
    const historico = carregarHistoricoTeste();
    historico.push(registro);
    localStorage.setItem("urna_votos_teste", JSON.stringify(historico));
    console.groupCollapsed(`[URNa] Voto registrado — ${cargo.nome}`);
    console.log(registro);
    console.log(`Total de votos no teste: ${historico.length}`);
    console.groupEnd();
  } catch (erro) {
    console.warn("[URNa] localStorage indisponível; contador de teste ignorado.", erro);
  }
}

/** Lê o histórico de votos de teste gravado em sessões anteriores. */
function carregarHistoricoTeste() {
  try {
    return JSON.parse(localStorage.getItem("urna_votos_teste")) || [];
  } catch {
    return [];
  }
}

/** Avança para o próximo cargo ou encerra a votação. */
function avancarCargoOuFinalizar() {
  estado.indiceCargo++;
  estado.digitos = [];
  estado.votoBranco = false;
  estado.candidato = null;

  if (estado.indiceCargo >= CARGOS.length) {
    finalizarSessao();
  } else {
    atualizarTela();
  }
}

/** Exibe a tela de FIM (igual à urna real: fundo verde, "FIM" gigante). */
function finalizarSessao() {
  estado.finalizada = true;
  document.getElementById("tela-fim").hidden = false;
}

/** Reinicia a sessão para um novo eleitor. */
function reiniciarSessao() {
  estado.indiceCargo = 0;
  estado.digitos = [];
  estado.votoBranco = false;
  estado.candidato = null;
  estado.votosDaSessao = [];
  estado.finalizada = false;
  document.getElementById("tela-fim").hidden = true;
  atualizarTela();
}

/* ============================================================
   ATUALIZAÇÃO DA TELA E SOM
   ============================================================ */

/** Re-renderiza o visor. As mensagens agora vêm da política do visor (polimorfismo). */
function atualizarTela() {
  const cargoAtual = CARGOS[estado.indiceCargo];
  visor.renderizar({
    cargoAtual: cargoAtual,
    digitos: estado.digitos,
    candidato: estado.candidato,
    votoBranco: estado.votoBranco,
    numeroInvalido: estado.digitos.length === cargoAtual.digitos && estado.candidato === null
  });
}

/**
 * Emite o som de confirmação da urna via Web Audio API.
 * Dois bipes sintetizados (sem arquivo de áudio externo):
 * primeiro grave, depois agudo — parecido com o "tch-tch" da urna real.
 */
function emitirSomConfirmacao() {
  const contexto = obterContextoAudio();
  if (!contexto) return;

  const agora = contexto.currentTime;
  tocarBipe(contexto, agora,        620, 0.12);  // primeiro bipe
  tocarBipe(contexto, agora + 0.14, 940, 0.18);  // segundo bipe, mais agudo
}

/** Cria/reusa o AudioContext (deve ser criado após gesto do usuário). */
function obterContextoAudio() {
  if (!window.AudioContext && !window.webkitAudioContext) return null;
  if (!window.__urnaAudioContext) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    window.__urnaAudioContext = new Ctx();
  }
  if (window.__urnaAudioContext.state === "suspended") {
    window.__urnaAudioContext.resume();
  }
  return window.__urnaAudioContext;
}

/** Toca um único bipe (oscilador + envelope de ganho). */
function tocarBipe(contexto, inicio, frequencia, duracao) {
  const oscilador = contexto.createOscillator();
  const ganho = contexto.createGain();

  oscilador.type = "square";              // timbre seco, tipo "bipe" de máquina
  oscilador.frequency.value = frequencia;

  // Envelope: ataque instantâneo, decaimento suave (evita estalo)
  ganho.gain.setValueAtTime(0.0001, inicio);
  ganho.gain.exponentialRampToValueAtTime(0.25, inicio + 0.01);
  ganho.gain.exponentialRampToValueAtTime(0.0001, inicio + duracao);

  oscilador.connect(ganho).connect(contexto.destination);
  oscilador.start(inicio);
  oscilador.stop(inicio + duracao + 0.02);
}

/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */

// Botão de reinício da tela final
document.getElementById("botao-reiniciar").addEventListener("click", reiniciarSessao);

// Alternar o modo realista re-renderiza o visor na hora
document.getElementById("toggle-realista").addEventListener("change", atualizarTela);

// Exibe, no console, quantos votos de teste já foram gravados em sessões passadas
const votosAnteriores = carregarHistoricoTeste().length;
if (votosAnteriores > 0) {
  console.info(`[URNa] ${votosAnteriores} voto(s) de teste gravado(s) em sessões anteriores (localStorage).`);
}

// Primeira renderização: a urna já nasce pronta (com os dados mock) ...
atualizarTela();

// MELHORIA FASE 4: ... e em seguida tenta usar os candidatos do servidor Java.
// Se estiver offline, permanece nos dados mock (fallback só para demonstração).
Api.carregarCandidatos().then((online) => {
  visor.mostrarStatusServidor(online);
  atualizarTela();
});
