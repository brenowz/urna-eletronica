package urna.modelos;

public class Voto { 

    
    private int numeroDigitado;
    private String tipo;
    private Candidato candidato;

    
    public Voto(int numeroDigitado, String tipo, Candidato candidato) {
        this.numeroDigitado = numeroDigitado;
        this.tipo = tipo;
        this.candidato = candidato;
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