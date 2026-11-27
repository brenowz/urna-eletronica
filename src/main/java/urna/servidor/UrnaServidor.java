
package urna.servidor;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;

import com.sun.net.httpserver.HttpServer;

import urna.controladores.UrnaControlador;
import urna.modelos.Candidato;

public class UrnaServidor {

    private UrnaControlador urna = new UrnaControlador();

    public void iniciar() throws IOException {

        HttpServer servidor = HttpServer.create(
            new InetSocketAddress("127.0.0.1", 8080), 0
        );

        servidor.createContext("/candidatos", requisicao -> {

            String resposta = "[";

            for (Candidato candidato : urna.getCandidatos()) {

                resposta += "{";
                resposta += "\"nome\":\"" + candidato.getNome() + "\",";
                resposta += "\"nomeUrna\":\"" + candidato.getNomeUrna() + "\",";
                resposta += "\"cargo\":\"" + candidato.getCargo() + "\",";
                resposta += "\"partido\":\"" + candidato.getPartido() + "\",";
                resposta += "\"foto\":\"" + candidato.getFoto() + "\",";
                resposta += "\"perfil\":\"" + candidato.getPerfil() + "\",";
                resposta += "\"numero\":" + candidato.getNumero();
                resposta += "},";
            }

            // Remove a última vírgula, caso existam candidatos
            if (resposta.endsWith(",")) {
                resposta = resposta.substring(0, resposta.length() - 1);
            }

            resposta += "]";

            byte[] dados = resposta.getBytes(StandardCharsets.UTF_8);

            requisicao.getResponseHeaders().set(
                "Content-Type", "application/json; charset=UTF-8"
            );

            requisicao.sendResponseHeaders(200, dados.length);
            requisicao.getResponseBody().write(dados);
            requisicao.close();

        });

        servidor.start();

        System.out.println("Servidor iniciado na porta 8080.");
    }
}
