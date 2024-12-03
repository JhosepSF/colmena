package seguridad.informacion.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import seguridad.informacion.entitys.Usuario;
import seguridad.informacion.repository.UsuarioRepository;
import seguridad.informacion.request.AuthResponse;
import seguridad.informacion.request.LoginRequest;

@Service
public class AuthService 
{
    private static final int MAX_FAILED_ATTEMPTS = 3;
    
    private final UsuarioRepository usuario;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UsuarioRepository usuario, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.usuario = usuario;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse login(LoginRequest request)
    {
        Usuario usua = usuario.findByUsername(request.getUsername()).orElseThrow();
        
        // Verificar si la cuenta está inactiva
        if (usua.getEstado().equals("Inactivo")) {
            throw new RuntimeException("Cuenta inactiva.");
        }
        
        // Verificar si la cuenta está bloqueada
        if (!usua.getAccountnonlocked()) {
            throw new LockedException("Cuenta bloqueada debido a múltiples intentos fallidos. Contacte al administrador.");
        }
        
        try {
            // Autenticar al usuario
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    request.getUsername(), request.getPassword()));

            // Reiniciar los intentos fallidos si la autenticación es exitosa
            if (usua.getIntentosfallidos() > 0) {
                usua.setIntentosfallidos(0);
                usuario.save(usua);
            }

            // Generar el token JWT
            String token = jwtService.getToken((UserDetails) usua);

            // Obtener el rol del usuario
            String role = usua.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_USER");

            // Preparar la respuesta de autenticación
            AuthResponse authResponse = new AuthResponse();
            authResponse.setToken(token);
            authResponse.setRole(role);
            authResponse.setName(usua.getName());

            return authResponse;

        } catch (BadCredentialsException e) {
            // Incrementar el contador de intentos fallidos si las credenciales no son válidas
            int failedAttempts = usua.getIntentosfallidos() + 1;
            usua.setIntentosfallidos(failedAttempts);
            
            if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
                usua.setAccountnonlocked(false); // Bloquear la cuenta
            }
            
            usuario.save(usua); // Guardar los cambios en la base de datos
            
            throw new BadCredentialsException("Credenciales incorrectas");
        }
    }
}