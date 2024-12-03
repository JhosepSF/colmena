package seguridad.informacion.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import seguridad.informacion.entitys.Rol;
import seguridad.informacion.repository.RolRepository;
import seguridad.informacion.request.RolRequest;

@Service
public class RolService 
{
    @Autowired
    RolRepository rolrepo;
    
    public void saveRol(RolRequest request)
    {
        Rol rol = new Rol();
        rol.setName(request.getName());
        rol.setDescripcion(request.getDescripcion());
        if(request.getEstado() == 1) 
        {
        	rol.setEstado("Activo");
        }
        
        else if (request.getEstado() == 2) 
        {
        	rol.setEstado("Inactivo");
        }
        rolrepo.save(rol);
    }

    public List<Rol> getRolList()
    {
    	List<Rol> rolesactivos = new ArrayList<>();
    	List<Rol> roles = rolrepo.findAll();
    	
    	for(Rol r : roles) 
    	{
    		if(r.getEstado().equals("Activo")) 
    		{
    			rolesactivos.add(r);
    		}
    	}
    	
        return rolesactivos;
    }

    public List<Rol> getRolListInactivos()
    {
    	List<Rol> rolesinactivos = new ArrayList<>();
    	List<Rol> roles = rolrepo.findAll();
    	
    	for(Rol r : roles) 
    	{
    		if(r.getEstado().equals("Inactivo")) 
    		{
    			rolesinactivos.add(r);
    		}
    	}
    	
        return rolesinactivos;
    }
    
    public Rol getRolById(Integer id)
    {
        return rolrepo.findById(id).orElse(null);
    }
    
    public void update(Integer id, RolRequest request) throws IOException 
    {
        Rol rol = rolrepo.findById(id)
                    .orElseThrow(() -> new RuntimeException ("No se encontro el usuario"));
        if(request.getEstado() == 1) 
        {
        	rol.setEstado("Activo");
        }
        
        else if (request.getEstado() == 2) 
        {
        	rol.setEstado("Inactivo");
        }
        rol.setName(request.getName());
        rol.setDescripcion(request.getDescripcion());

        rolrepo.save(rol);
    }
    
    public void delete(Integer id)
    {
        Rol r = rolrepo.findById(id)
                    .orElseThrow(() -> new RuntimeException ("No se encontro el usuario"));
        r.setEstado("Inactivo");
        rolrepo.save(r);
    }

	public void activate(Integer id) {
		Rol r = rolrepo.findById(id)
                .orElseThrow(() -> new RuntimeException ("No se encontro el usuario"));
	    r.setEstado("Activo");
	    rolrepo.save(r);	
	}
}
