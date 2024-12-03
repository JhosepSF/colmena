/*package seguridad.informacion.config;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import seguridad.informacion.entitys.Rol;
import seguridad.informacion.entitys.Usuario;
import seguridad.informacion.repository.RolRepository;
import seguridad.informacion.repository.UsuarioRepository;

@Configuration
public class DataInitializer 
{

    @Bean
    CommandLineRunner initializeData(UsuarioRepository usuario, RolRepository rol, PasswordEncoder passwordEncoder) 
    {
        return args ->
        {
            Rol perfilAdministrador = new Rol(1, "ADMINISTRADOR", "Es el rol del administrador", "Activo");
            Rol perfilUsuario = new Rol(2, "USUARIO", "Es el rol del usuario", "Activo");
            rol.saveAll(List.of(perfilAdministrador, perfilUsuario));

            Usuario usuario1 = new Usuario();
            usuario1.setName("Lennyn");
            usuario1.setLastname("Sánchez");
            usuario1.setEstado("Activo");
            usuario1.setAddress("Casa");
            usuario1.setUsername("lennyn@unsm.com");
            usuario1.setPassword(passwordEncoder.encode("123456"));
            Set<Rol> authorities1 = new HashSet<>();
            authorities1.add(perfilAdministrador);
            usuario1.setRol(authorities1);
            usuario.save(usuario1);

            Usuario usuario2 = new Usuario();
            usuario2.setName("Segundo");
            usuario2.setLastname("Roger");
            usuario2.setEstado("Activo");
            usuario2.setAddress("Casa");
            usuario2.setUsername("segundo@unsm.com");
            usuario2.setPassword(passwordEncoder.encode("123456"));
            usuario2.setRol(authorities1);
            usuario.save(usuario2);
        };
    }
}*/