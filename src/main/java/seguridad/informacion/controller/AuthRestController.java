package seguridad.informacion.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import seguridad.informacion.repository.UsuarioRepository;
import seguridad.informacion.request.AuthResponse;
import seguridad.informacion.request.LoginRequest;
import seguridad.informacion.service.AuthService;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/auth")
public class AuthRestController
{
    private final AuthService authService;
    private final UsuarioRepository usuarioRepository;

    private static final String SECRET_KEY = "6LeF8F0qAAAAANiEzHH4H-9n_jzGlmAYKiKh8uBH";

    public AuthRestController(AuthService authService, UsuarioRepository usuarioRepo) {
        this.authService = authService;
        this.usuarioRepository = usuarioRepo;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {

    	boolean isCaptchaValid = verifyRecaptchaToken(request.getRecaptchaResponse());
        
        if (!isCaptchaValid) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new AuthResponse("Invalid reCAPTCHA"));
        }

        try 
        {
            // Intentar realizar el login mediante el AuthService
            return ResponseEntity.ok(authService.login(request));
        }
        catch (LockedException e) 
        {
            // Si la cuenta está bloqueada
            return ResponseEntity.status(HttpStatus.LOCKED).body(new AuthResponse("La cuenta está bloqueada. Por favor, contacte al administrador."));
        } 
        catch (BadCredentialsException e) 
        {
            // Si las credenciales son incorrectas
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthResponse("Credenciales incorrectas."));
        }
        catch (RuntimeException e) 
        {
            // Si el usuario esta inactivo
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new AuthResponse("Cuenta inactiva."));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        try {
            request.getSession().invalidate();
            return ResponseEntity.ok().body("{\"message\": \"Sesión cerrada con éxito.\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al cerrar la sesión: " + e.getMessage());
        }
    }

    private boolean verifyRecaptchaToken(String recaptchaToken) {
        String verificationUrl = "https://www.google.com/recaptcha/api/siteverify";
        try {
            String urlParameters = "secret=" + SECRET_KEY + "&response=" + recaptchaToken;
            byte[] postData = urlParameters.getBytes(StandardCharsets.UTF_8);

            URL url = new URL(verificationUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setDoOutput(true);
            conn.getOutputStream().write(postData);

            BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String inputLine;
            StringBuilder response = new StringBuilder();

            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();

            // Parsear la respuesta JSON
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(response.toString());

            // Obtener el valor del campo "success"
            boolean success = rootNode.path("success").asBoolean();

            return success;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public UsuarioRepository getUsuarioRepository() {
        return usuarioRepository;
    }
}
