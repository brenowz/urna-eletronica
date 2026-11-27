package urna.controladores;

import java.util.ArrayList;
import java.util.List;

import urna.modelos.Candidato;
import urna.modelos.Voto;

public class UrnaControlador {
    private List<Candidato> candidatos;
    private List<Voto> votosRegistrados;
    private String cargoAtual;
    private boolean votacaoFinalizada;

    public UrnaControlador() {
        this.candidatos = new ArrayList<>();
        this.votosRegistrados = new ArrayList<>();
        this.cargoAtual = "Vereador";
        this.votacaoFinalizada = false;

        // Candidatos fictícios para teste
        candidatos.add(new Candidato("Zé Ferreira", "Vereador", "PPP", "", 31234));
        candidatos.add(new Candidato("Dr. Carlos", "Prefeito", "PAB", "", 31));
    }

    public Candidato buscarCandidato(int numeroDigitado) {
        for (Candidato c : candidatos) {
            if (c.getNumero() == numeroDigitado && c.getCargo().equals(cargoAtual)) {
                return c;
            }
        }
        return null;
    }

    public void confirmarVoto(int numeroDigitado) {
        if (votacaoFinalizada) {
            return;
        }

        Candidato escolhido = buscarCandidato(numeroDigitado);

        if (escolhido != null) {
            votosRegistrados.add(new Voto(cargoAtual, numeroDigitado, "VALIDO", escolhido));
        } else {
            votosRegistrados.add(new Voto(cargoAtual, numeroDigitado, "NULO", null));
        }

        avancarEtapa();
    }

    public void votarBranco() {
        if (votacaoFinalizada) {
            return;
        }

        votosRegistrados.add(new Voto(cargoAtual, 0, "BRANCO", null));
        avancarEtapa();
    }

    private void avancarEtapa() {
        if (cargoAtual.equals("Vereador")) {
            cargoAtual = "Prefeito";
        } else {
            votacaoFinalizada = true;
        }
    }

    public String getCargoAtual() {
        return cargoAtual;
    }

    public boolean isVotacaoFinalizada() {
        return votacaoFinalizada;
    }

    public List<Voto> getVotosRegistrados() {
        return votosRegistrados;
    }
}
