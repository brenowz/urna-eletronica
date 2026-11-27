/* ============================================================
   URNA ELETRÔNICA — FASE 1 (FRONT-END)
   js/teclado.js — teclado físico da urna (numérico + ações).

   Responsabilidade única: capturar intenções do eleitor
   (dígito, BRANCO, CORRIGE, CONFIRMA) e repassar ao app.js
   por meio de callbacks. Não contém regra de votação.
   ============================================================ */

/**
 * Representa o teclado da urna.
 * Gera as teclas numéricas e conecta os botões de ação,
 * além de aceitar o TECLADO FÍSICO do computador.
 */
class Teclado {
  /**
   * @param {Object} acoes callbacks fornecidos pelo app.js
   *   acoes.digitar        {function(string)}
   *   acoes.branco         {function()}
   *   acoes.corrige        {function()}
   *   acoes.confirma       {function()}
   */
  constructor(acoes) {
    this.acoes = acoes;
    this._montarTeclasNumericas();
    this._conectarBotoesAcao();
    this._conectarTecladoFisico();
  }

  /* ---------- teclas numéricas na tela ---------- */
  _montarTeclasNumericas() {
    const conteiner = document.getElementById("teclado-numerico");

    // Disposição igual à urna real: 1-9 em grade, 0 centralizado na última linha
    const disposicao = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", ""];

    for (const valor of disposicao) {
      if (valor === "") {
        // Espaçador vazio (a urna real tem teclas sem uso nessas posições)
        const espaco = document.createElement("span");
        espaco.setAttribute("aria-hidden", "true");
        conteiner.appendChild(espaco);
        continue;
      }

      const tecla = document.createElement("button");
      tecla.type = "button";
      tecla.className = "tecla";
      tecla.textContent = valor;
      tecla.setAttribute("aria-label", `Dígito ${valor}`);
      tecla.addEventListener("click", () => this.acoes.digitar(valor));
      conteiner.appendChild(tecla);
    }
  }

  /* ---------- botões BRANCO / CORRIGE / CONFIRMA ---------- */
  _conectarBotoesAcao() {
    document.getElementById("botao-branco").addEventListener("click", () => this.acoes.branco());
    document.getElementById("botao-corrige").addEventListener("click", () => this.acoes.corrige());
    document.getElementById("botao-confirma").addEventListener("click", () => this.acoes.confirma());
  }

  /* ---------- teclado físico: números + atalhos ---------- */
  _conectarTecladoFisico() {
    document.addEventListener("keydown", (evento) => {
      const alvo = evento.target;

      // MELHORIA FASE 4 (BUG-F2): só ignora campos de TEXTO. O checkbox do modo
      // realista não pode "engolir" o teclado físico depois de ser clicado.
      const ehCampoDeTexto = alvo && alvo.tagName === "INPUT" && alvo.type !== "checkbox";
      if (ehCampoDeTexto) return;

      const ehBotao = alvo && alvo.tagName === "BUTTON";

      if (/^[0-9]$/.test(evento.key)) {
        this.acoes.digitar(evento.key);
        this._destacarTeclaVisual(evento.key);
      } else if (evento.key === "Enter") {
        // MELHORIA FASE 4 (BUG-F1): com um botão focado, o Enter já dispara o "click"
        // dele; tratar de novo aqui executaria DUAS ações.
        if (ehBotao) return;
        this.acoes.confirma();
      } else if (evento.key === "Escape" || evento.key === "Backspace") {
        this.acoes.corrige();
      } else if (evento.key.toLowerCase() === "b") {
        this.acoes.branco();
      }
    });
  }

  /* Dá feedback visual na tecla correspondente ao número do teclado físico */
  _destacarTeclaVisual(valor) {
    const teclas = document.querySelectorAll(".tecla");
    for (const tecla of teclas) {
      if (tecla.textContent === valor) {
        tecla.classList.add("tecla-pressionada");
        setTimeout(() => tecla.classList.remove("tecla-pressionada"), 120);
        break;
      }
    }
  }
}

window.Teclado = Teclado;
