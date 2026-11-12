package urna.modelos;

public class Candidato {
    private String nome;
    private String cargo;
    private String partido;
    private String foto;
    private int numero;

    public Candidato(String nome, String cargo, String partido, String foto, int numero) {
        this.nome = nome;
        this.cargo = cargo;
        this.partido = partido;
        this.foto = foto;
        this.numero = numero;
    }

    public String getNome() {
        return nome;
    }

    public String getCargo() {
        return cargo;
    }

    public String getPartido() {
        return partido;
    }

    public String getFoto() {
        return foto;
    }

    public int getNumero() {
        return numero;
    }
}

