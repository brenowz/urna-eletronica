/* ============================================================
   URNA ELETRÔNICA — FASE 4 (INTEGRAÇÃO FRONT + BACK)
   js/api.js — comunicação com o servidor Java.
   // MELHORIA FASE 4: arquivo novo.

   - GET  /candidatos  -> carrega os candidatos do back-end
   - POST /voto        -> envia cada voto confirmado

   FALLBACK (SOMENTE PARA DEMONSTRAÇÃO LOCAL): se o servidor Java estiver
   offline, a urna continua funcionando com os dados mock de candidatos.js
   e os votos ficam apenas no localStorage de teste. Em produção, este
   fallback deveria ser removido: sem servidor, a urna não deveria votar.
   ============================================================ */

const Api = (() => {
  // Endereço do servidor Java (UrnaServer). Pode ser trocado antes de carregar a página:
  //   <script>window.URNA_API_BASE = "http://localhost:8080";</script>
  const BASE = window.URNA_API_BASE || "http://localhost:8080";
  const LIMITE_MS = 1500;   // tempo máximo de espera antes de assumir "offline"
  let online = false;

  // Começa com os dados mock; se o servidor responder, são substituídos.
  window.CANDIDATOS_ATIVOS = window.CANDIDATOS_MOCK;

  /** fetch com limite de tempo. */
  async function buscar(caminho, opcoes = {}) {
    const controlador = new AbortController();
    const temporizador = setTimeout(() => controlador.abort(), LIMITE_MS);
    try {
      return await fetch(BASE + caminho, { ...opcoes, signal: controlador.signal });
    } finally {
      clearTimeout(temporizador);
    }
  }

  /** Converte {CARGO:[{...}]} (formato do back-end) em {CARGO:{numero:{...}}} (formato da tela). */
  function converterCandidatos(json) {
    const mapa = {};
    for (const cargo of Object.keys(json)) {
      mapa[cargo] = {};
      for (const c of json[cargo]) mapa[cargo][c.numero] = c;
    }
    return mapa;
  }

  /** Tenta carregar os candidatos do servidor; cai nos dados mock se falhar. */
  async function carregarCandidatos() {
    try {
      const resposta = await buscar("/candidatos");
      if (!resposta.ok) throw new Error("HTTP " + resposta.status);
      window.CANDIDATOS_ATIVOS = converterCandidatos(await resposta.json());
      online = true;
    } catch (erro) {
      // FALLBACK (apenas demonstração local): usa os candidatos mockados.
      window.CANDIDATOS_ATIVOS = window.CANDIDATOS_MOCK;
      online = false;
      console.info("[URNa] Servidor Java offline — usando dados mock (modo demonstração).");
    }
    return online;
  }

  /**
   * Envia um voto ao servidor.
   * @param {string} cargo   ex.: "PREFEITO"
   * @param {string|null} numero  null = voto em branco
   */
  async function enviarVoto(cargo, numero) {
    if (!online) return { enviado: false, motivo: "offline" };
    try {
      const corpo = numero === null ? { cargo, branco: true } : { cargo, numero };
      const resposta = await buscar("/voto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corpo)
      });
      return { enviado: resposta.ok, status: resposta.status };
    } catch (erro) {
      return { enviado: false, motivo: "erro de rede" };
    }
  }

  return { carregarCandidatos, enviarVoto, get online() { return online; } };
})();

window.Api = Api;
