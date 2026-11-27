
package urna;

import java.io.IOException;

import urna.servidor.UrnaServidor;

public class Main {
    public static void main(String[] args) throws IOException {

        UrnaServidor servidor = new UrnaServidor();
        servidor.iniciar();

    }
}
