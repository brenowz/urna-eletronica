package urna.modelos;

public class Candidato {
    private String nome;
    private String nomeUrna;
    private String cargo;
    private String partido;
    private String foto;
    private String perfil;
    private int numero;

    public Candidato(String nome, String nomeUrna, String cargo, String partido, String foto, String perfil, int numero) {
        this.nome = nome;
        this.nomeUrna = nomeUrna;
        this.cargo = cargo;
        this.partido = partido;
        this.foto = foto;
        this.perfil = perfil;
        this.numero = numero;
    }

    public String getNome() {
        return nome;
    }

    public String getNomeUrna() {
        return nomeUrna;
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

    public String getPerfil() {
        return perfil;
    }

    public int getNumero() {
        return numero;
    }
}