package seguridad.informacion.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import seguridad.informacion.DTO.UsuarioDTO;
import seguridad.informacion.entitys.Rol;
import seguridad.informacion.entitys.Usuario;
import seguridad.informacion.repository.RolRepository;
import seguridad.informacion.repository.UsuarioRepository;
import seguridad.informacion.request.UsuarioRequest;

@Service
public class UsuarioService 
{
	@Autowired
    UsuarioRepository userrepo;
	
	@Autowired
    RolRepository rolrepo;
	
	@Autowired
    private PasswordEncoder passwordEncoder;

    public void saveUsuario(UsuarioRequest request) throws IOException
    {
        Usuario userr = new Usuario();
        userr.setUsername(request.getUsername());
        String encoded = passwordEncoder.encode(request.getPassword());
        userr.setPassword(encoded);
        userr.setAddress(request.getAddress());
        userr.setLastname(request.getLastname());
        userr.setName(request.getName());
        userr.setEstado("Activo");
        
		Set <Rol> roles = new HashSet<>();
        Rol rol1 = rolrepo.findById(request.getRol())
                .orElseThrow(() -> new RuntimeException ("No se encontro el rol"));
        roles.add(rol1);
        
        userr.setRol(roles);
        
        userrepo.save(userr);
    }

    public void updateUsuario(Integer id, UsuarioRequest request) throws IOException 
    {
        Usuario userr = userrepo.findById(id)
                    .orElseThrow(() -> new RuntimeException ("No se encontro el usuario"));

        userr.setAddress(request.getAddress());
        userr.setLastname(request.getLastname());
        userr.setName(request.getName());

        userrepo.save(userr);
    }

    public List<UsuarioDTO> getUsers() {
        List<UsuarioDTO> dto = new ArrayList<>();
        List<Usuario> usuarios = (List<Usuario>) userrepo.findAll();

        for (Usuario user : usuarios) {
            if (user.getEstado().equals("Activo")) {
                String roleName = "";
                
                if (user.getRol() != null && !user.getRol().isEmpty()) {
                    Rol lastRole = user.getRol().stream()
                                        .max(Comparator.comparing(Rol::getId))
                                        .orElse(null);
                    
                    if (lastRole != null) {
                        roleName = lastRole.getName();
                    }
                }

                UsuarioDTO userdto = new UsuarioDTO(
                    user.getId(),
                    user.getName(),
                    user.getLastname(),
                    user.getAddress(),
                    roleName
                );
                dto.add(userdto);
            }
        }
        
        return dto;
    }

    public Usuario getUsuario(Integer id)
    {
        return userrepo.findById(id)
                    .orElseThrow(() -> new RuntimeException ("No se encontro el usuario"));
    }

    public void deleteUsuario(Integer id)
    {
        Usuario userr = userrepo.findById(id)
                    .orElseThrow(() -> new RuntimeException ("No se encontro el usuario"));
        userr.setEstado("Inactivo");
        userrepo.save(userr);
    }

	public List<UsuarioDTO> getUsersInactivos() {
		List<UsuarioDTO> dto = new ArrayList<>();
    	List<Usuario> usuarios = (List<Usuario>) userrepo.findAll();
    	
    	for(Usuario user : usuarios) 
    	{
    		if(user.getEstado().equals("Inactivo")) 
    		{
    			String roleName = "";
    		    if (user.getRol() != null && !user.getRol().isEmpty()) {
    		        Rol Cargo = user.getRol().iterator().next();
    		        roleName = Cargo.getName();
    		    }
        		UsuarioDTO userdto = new UsuarioDTO
        				(
        					user.getId(),
        					user.getName(),
        					user.getLastname(),
        					user.getAddress(),
        					roleName
        				);
        		dto.add(userdto);
    		}
    	}
    	
        return dto;
	}

	public void activateUsuario(Integer id) {
		Usuario userr = userrepo.findById(id)
                .orElseThrow(() -> new RuntimeException ("No se encontro el usuario"));
	    userr.setEstado("Activo");
	    userrepo.save(userr);
	}
}
