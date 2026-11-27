package urna.modelos;

public class Voto {
    private String cargo;
    private int numeroDigitado;
    private String tipo;
    private Candidato candidato;

    public Voto(String cargo, int numeroDigitado, String tipo, Candidato candidato) {
        this.cargo = cargo;
        this.numeroDigitado = numeroDigitado;
        this.tipo = tipo;
        this.candidato = candidato;
    }

    public String getCargo() {
        return cargo;
    }

    public int getNumeroDigitado() {
        return numeroDigitado;
    }

    public String getTipo() {
        return tipo;
    }

    public Candidato getCandidato() {
        return candidato;
    }
}
