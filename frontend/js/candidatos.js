/* ============================================================
   URNA ELETRÔNICA — FASE 1 (FRONT-END)
   js/candidatos.js — dados MOCK da eleição MUNICIPAL.

   Cargos: PREFEITO (2 dígitos) e VEREADOR (5 dígitos:
   2 do partido + 3 do candidato, ex.: 31.234).

   Na FASE 2 estes dados virão do backend Java (GET /candidatos).
   O contrato abaixo é o que o backend deverá respeitar.
   ============================================================ */

/** Partidos fictícios da eleição (sigla -> nome completo). */
const PARTIDOS_MOCK = {
  PPP: { nome: "Partido Progresso Popular",       numero: "31" },
  AC:  { nome: "Aliança Cidadã",                  numero: "37" },
  MRS: { nome: "Movimento Renovação Social",      numero: "47" },
  UDT: { nome: "União Democrática do Trabalho",   numero: "63" }
};

/**
 * Candidatos por cargo; a chave é o NÚMERO (busca O(1)).
 * Campos: numero, nome (completo), nomeUrna, partido (sigla), perfil, foto.
 */
const CANDIDATOS_MOCK = {
  "PREFEITO": {
    "31": { numero: "31", nome: "Carlos Eduardo Menezes", nomeUrna: "Dr. Carlos Menezes", partido: "PPP",
            perfil: "Médico, 52 anos, ex-secretário de saúde", foto: "img/carlos-menezes.jpg" },
    "37": { numero: "37", nome: "Fernanda Lima Barreto", nomeUrna: "Fernanda Barreto", partido: "AC",
            perfil: "Advogada, 45 anos, ex-vereadora", foto: "img/fernanda-barreto.jpg" },
    "47": { numero: "47", nome: "Roberto Almeida Santos", nomeUrna: "Beto do Comércio", partido: "MRS",
            perfil: "Empresário, 49 anos, presidente da associação comercial", foto: "img/beto-comercio.jpg" },
    "63": { numero: "63", nome: "Luciana Ribeiro Costa", nomeUrna: "Professora Luciana", partido: "UDT",
            perfil: "Professora, 41 anos, líder sindical", foto: "img/luciana-costa.jpg" }
  },
  "VEREADOR": {
    "31234": { numero: "31234", nome: "José Antônio Ferreira", nomeUrna: "Zé Ferreira", partido: "PPP",
               perfil: "Comerciante, 47 anos, líder comunitário", foto: "img/ze-ferreira.jpg" },
    "37456": { numero: "37456", nome: "Mariana Souza Oliveira", nomeUrna: "Mari Oliveira", partido: "AC",
               perfil: "Enfermeira, 36 anos, ativista da saúde", foto: "img/mari-oliveira.jpg" },
    "47789": { numero: "47789", nome: "Paulo Henrique Duarte", nomeUrna: "Paulão da Construção", partido: "MRS",
               perfil: "Mestre de obras, 54 anos, ex-presidente de associação de moradores", foto: "img/paulao-construcao.jpg" },
    "63321": { numero: "63321", nome: "Aline Cristina Pereira", nomeUrna: "Aline da Escola", partido: "UDT",
               perfil: "Pedagoga, 39 anos, trabalha com educação infantil", foto: "img/aline-escola.jpg" }
  }
};

window.PARTIDOS_MOCK = PARTIDOS_MOCK;
window.CANDIDATOS_MOCK = CANDIDATOS_MOCK;
