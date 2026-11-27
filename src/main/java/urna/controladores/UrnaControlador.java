
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

        // Candidatos a vereador
        candidatos.add(new Candidato("José Antônio Ferreira", "Zé Ferreira", "Vereador", "PPP", "img/ze-ferreira.jpg", "Comerciante, 47 anos, líder comunitário", 31234));

        candidatos.add(new Candidato("Mariana Souza Oliveira", "Mari Oliveira", "Vereador", "AC", "img/mari-oliveira.jpg", "Enfermeira, 36 anos, ativista da saúde", 37456));

        candidatos.add(new Candidato("Paulo Henrique Duarte", "Paulão da Construção", "Vereador", "MRS", "img/paulao-construcao.jpg", "Mestre de obras, 54 anos, ex-presidente de associação de moradores", 47789));

        candidatos.add(new Candidato("Aline Cristina Pereira", "Aline da Escola", "Vereador", "UDT", "img/aline-escola.jpg", "Pedagoga, 39 anos, trabalha com educação infantil", 63321));

        // Candidatos a prefeito
        candidatos.add(new Candidato("Carlos Eduardo Menezes", "Dr. Carlos Menezes", "Prefeito", "PPP", "img/carlos-menezes.jpg", "Médico, 52 anos, ex-secretário de saúde", 31));

        candidatos.add(new Candidato("Fernanda Lima Barreto", "Fernanda Barreto", "Prefeito", "AC", "img/fernanda-barreto.jpg", "Advogada, 45 anos, ex-vereadora", 37));

        candidatos.add(new Candidato("Roberto Almeida Santos", "Beto do Comércio", "Prefeito", "MRS", "img/beto-comercio.jpg", "Empresário, 49 anos, presidente da associação comercial", 47));

        candidatos.add(new Candidato("Luciana Ribeiro Costa", "Professora Luciana", "Prefeito", "UDT", "img/luciana-costa.jpg", "Professora, 41 anos, líder sindical", 63));
    }

    public List<Candidato> getCandidatos() {
        return candidatos;
    }

    public void reiniciarVotacao() {
        // Remove o voto de uma votação interrompida
        if (!votacaoFinalizada && cargoAtual.equals("Prefeito")) {
            votosRegistrados.remove(votosRegistrados.size() - 1);
        }

        cargoAtual = "Vereador";
        votacaoFinalizada = false;
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
