package urna;

import java.util.Scanner;

import urna.controladores.UrnaControlador;
import urna.modelos.Voto;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        UrnaControlador urna = new UrnaControlador();

        System.out.println("===== URNA CIDADÃ =====");

        while (!urna.isVotacaoFinalizada()) {
            System.out.println("\nCargo: " + urna.getCargoAtual());
            System.out.print("Digite o número do candidato ou 0 para branco: ");

            if (!sc.hasNext()) {
                sc.close();
                return;
            }

            if (!sc.hasNextInt()) {
                System.out.println("Digite um número válido.");
                sc.next();
                continue;
            }

            int numero = sc.nextInt();

            if (numero < 0) {
                System.out.println("Digite um número positivo ou 0.");
                continue;
            }

            if (numero == 0) {
                urna.votarBranco();
            } else {
                urna.confirmarVoto(numero);
            }

            System.out.println("Voto registrado!");
        }

        System.out.println("\n===== FIM =====");
        System.out.println("\nResumo da simulação:");

        for (Voto voto : urna.getVotosRegistrados()) {
            System.out.println("Cargo: " + voto.getCargo());
            System.out.println("Tipo: " + voto.getTipo());

            if (voto.getCandidato() != null) {
                System.out.println("Candidato: " + voto.getCandidato().getNome());
            }

            System.out.println();
        }

        sc.close();
    }
}
