/* ============================================================
   URNA ELETRÔNICA — js/visor.js — camada de apresentação da TELA.

   // MELHORIA FASE 4: o MODO REALISTA agora é tratado por POLIMORFISMO.
   Existem duas "políticas de visor" (normal e realista) com a mesma
   interface: mascararDigito, renderizarPainel e mensagemOrientacao.
   O Visor só escolhe a política; não há if(modoRealista) espalhado.
   (BUG-F5: a mensagem do rodapé no modo realista é a mesma para número
   válido e inválido, então nada é revelado antes da confirmação.)
   ============================================================ */

/* ---------- utilitário de DOM ---------- */
function criarParagrafo(classe, texto) {
  const p = document.createElement("p");
  p.className = classe;
  p.textContent = texto;
  return p;
}

/* ---------- POLÍTICA 1: modo normal (didático) ---------- */
const PoliticaVisorNormal = {
  mascararDigito(digito) { return digito; },

  renderizarPainel(painel, estado) {
    painel.hidden = false;

    if (estado.votoBranco) {
      painel.appendChild(criarParagrafo("candidato-voto-branco", "VOTO EM BRANCO"));
      return;
    }
    if (estado.numeroInvalido) {
      painel.appendChild(criarParagrafo("candidato-voto-nulo", "NÚMERO INVÁLIDO — VOTO NULO"));
      return;
    }
    if (estado.candidato) {
      const c = estado.candidato;
      const foto = document.createElement("img");
      foto.className = "candidato-foto";
      foto.src = c.foto;
      foto.alt = `Foto de ${c.nomeUrna}`;

      const dadosPartido = (window.PARTIDOS_MOCK || {})[c.partido];
      const nomePartido = c.partidoNome || (dadosPartido ? dadosPartido.nome : "");
      painel.append(
        foto,
        criarParagrafo("candidato-nome", c.nomeUrna),
        criarParagrafo("candidato-partido", nomePartido ? `${c.partido} — ${nomePartido}` : c.partido)
      );
      return;
    }
    painel.hidden = true;   // número incompleto: painel vazio
  },

  mensagemOrientacao(estado) {
    if (estado.votoBranco) return { texto: "Voto em BRANCO — pressione CONFIRMA para registrar." };
    if (estado.numeroInvalido) return { texto: "Número inválido — o voto será NULO. Confirme ou CORRIGE.", alerta: true };
    if (estado.candidato) return { texto: "Confira seu voto e pressione CONFIRMA." };
    return { texto: `Digite os ${estado.cargoAtual.digitos} dígitos do candidato a ${estado.cargoAtual.nome.toLowerCase()}.` };
  }
};

/* ---------- POLÍTICA 2: modo realista (sigilo) ---------- */
const PoliticaVisorRealista = {
  mascararDigito() { return "•"; },

  renderizarPainel(painel) {
    // Nunca revela identidade — nem nome, nem foto, nem se o número existe.
    painel.hidden = false;
    painel.appendChild(criarParagrafo("candidato-sigilo", "Voto sigiloso — identidade do candidato ocultada"));
  },

  mensagemOrientacao(estado) {
    if (estado.votoBranco) return { texto: "Voto em BRANCO — pressione CONFIRMA para registrar." };
    const completo = estado.digitos.length === estado.cargoAtual.digitos;
    // Mesma mensagem para número válido OU inválido (BUG-F5)
    if (completo) return { texto: "Número completo — pressione CONFIRMA para registrar seu voto." };
    return { texto: "Modo realista ativo — seu voto é secreto. Digite o número." };
  }
};

/**
 * Representa o visor da urna.
 * Encapsula todos os elementos do DOM que compõem a tela.
 */
class Visor {
  constructor() {
    this.elCargo       = document.getElementById("visor-cargo");
    this.elDigitos     = document.getElementById("visor-digitos");
    this.elCandidato   = document.getElementById("visor-candidato");
    this.elMensagem    = document.getElementById("visor-mensagem");
    this.elToggleReal  = document.getElementById("toggle-realista");
    this.elStatus      = document.getElementById("visor-status");
  }

  /** Indica se o modo realista (sigilo do voto) está ativo. */
  get modoRealistaAtivo() { return this.elToggleReal.checked; }

  /** Política de apresentação atual (polimorfismo no lugar de if). */
  get politica() { return this.modoRealistaAtivo ? PoliticaVisorRealista : PoliticaVisorNormal; }

  /**
   * Desenha o estado atual da votação no visor.
   * @param {Object} estado  cargoAtual, digitos, candidato, votoBranco, numeroInvalido
   */
  renderizar(estado) {
    this.elCargo.textContent = estado.cargoAtual.nome;
    this._renderizarDigitos(estado);

    this.elCandidato.innerHTML = "";
    this.politica.renderizarPainel(this.elCandidato, estado);

    const mensagem = this.politica.mensagemOrientacao(estado);
    this.mostrarMensagem(mensagem.texto, !!mensagem.alerta);
  }

  _renderizarDigitos(estado) {
    this.elDigitos.innerHTML = "";
    for (let i = 0; i < estado.cargoAtual.digitos; i++) {
      const quadro = document.createElement("span");
      quadro.className = "digito-quadro";

      if (i < estado.digitos.length) {
        quadro.textContent = this.politica.mascararDigito(estado.digitos[i]);
        quadro.classList.add("digito-quadro-preenchido");
        if (this.modoRealistaAtivo) quadro.classList.add("digito-quadro-mascarado");
      } else if (i === estado.digitos.length) {
        quadro.classList.add("digito-quadro-vazio", "digito-quadro-piscando");
      } else {
        quadro.classList.add("digito-quadro-vazio");
      }
      this.elDigitos.appendChild(quadro);
    }
  }

  /** Mensagem de orientação no rodapé do visor. */
  mostrarMensagem(texto, alerta = false) {
    this.elMensagem.textContent = texto;
    this.elMensagem.classList.toggle("visor-mensagem-alerta", alerta);
  }

  /** MELHORIA FASE 4: mostra se os dados vêm do servidor Java ou do mock. */
  mostrarStatusServidor(online) {
    if (!this.elStatus) return;
    this.elStatus.textContent = online
      ? "● Servidor Java conectado"
      : "○ Servidor offline — dados locais (demonstração)";
    this.elStatus.classList.toggle("visor-status-online", online);
  }
}

window.Visor = Visor;
