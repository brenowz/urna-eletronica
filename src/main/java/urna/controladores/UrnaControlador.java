package urna.controladores;

import urna.modelos.Candidato;
import urna.modelos.Voto;
import java.util.ArrayList;
import java.util.List;

public class UrnaControlador {
    // (Atributos)
    private List<Candidato> candidatos;
    private List<Voto> votosRegistrados;
    private String cargoAtual;
    private boolean votacaoFinalizada;

    // (Construtor)
    public UrnaControlador() {
        this.candidatos = new ArrayList<>();
        this.votosRegistrados = new ArrayList<>();
        this.cargoAtual = "Vereador";
        this.votacaoFinalizada = false;

        // Carrega os candidatos de teste na memória
        this.candidatos.add(new Candidato("Zé Ferreira", "PPP", 31234, "Vereador"));
        this.candidatos.add(new Candidato("Dr. Carlos", "PAB", 31, "Prefeito"));
    }

    // BUSCADOR DE CANDIDATOS 
    public Candidato buscarCandidato(int numeroDigitado) {
        for (Candidato c : this.candidatos) {
            if (c.getNumero() == numeroDigitado && c.getCargo().equals(this.cargoAtual)) {
                return c; // Devolve o objeto completo (nome, partido, foto)
            }
        }
        return null; // Percorreu a lista toda e não achou (Voto Nulo)
    }

    // AÇÕES DOS BOTÕES DA URNA
    public void confirmarVoto(int numeroDigitado) {
        if (this.votacaoFinalizada) return; // Trava de segurança se já acabou

        Candidato escolhido = buscarCandidato(numeroDigitado);

        if (escolhido != null) {
            this.votosRegistrados.add(new Voto(this.cargoAtual, numeroDigitado, "VALIDO"));
        } else {
            this.votosRegistrados.add(new Voto(this.cargoAtual, numeroDigitado, "NULO"));
        }

        avancarEtapa();
    }

    public void votarBranco() {
        if (this.votacaoFinalizada) return;

        this.votosRegistrados.add(new Voto(this.cargoAtual, 0, "BRANCO"));
        avancarEtapa();
    }

    // 5. A MÁQUINA DE ESTADOS
    private void avancarEtapa() {
        if (this.cargoAtual.equals("Vereador")) {
            this.cargoAtual = "Prefeito";
        } else {
            this.votacaoFinalizada = true;
        }
    }

    // 6. GETTERS
    public String getCargoAtual() {
        return this.cargoAtual;
    }

    public boolean isVotacaoFinalizada() {
        return this.votacaoFinalizada;
    }

    public List<Voto> getVotosRegistrados() {
        return this.votosRegistrados;
    }
}