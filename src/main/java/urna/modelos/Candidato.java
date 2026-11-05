package urna.modelos;

public class Candidato {
    private String nome;
    private String partido;
    private int numero;

public Candidato(String nome, String partido, int numero) {
    this.nome = nome;
    this.partido = partido;
    this.numero = numero;
}

public String getNome() {
    return nome;
}

public String getPartido() {
    return partido;
}

public int getNumero() {
    return numero;
}



