package seguridad.informacion.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import seguridad.informacion.entitys.Habitacion;
import seguridad.informacion.entitys.Usuario;
import seguridad.informacion.repository.HabitacionRepository;
import seguridad.informacion.repository.UsuarioRepository;
import seguridad.informacion.request.HabitacionRequest;

@Service
public class HabitacionService 
{
    @Autowired
    HabitacionRepository repo;

    @Autowired
    UsuarioRepository usuarioRepository;

    public void save(HabitacionRequest request, String username)
    {
        Usuario usuario = usuarioRepository.findByUsername(username)
                            .orElseThrow(()->new RuntimeException("No se encontro al usuario"));

        Habitacion habi = new Habitacion();
        habi.setNombre(request.getNombre());
        habi.setCapacidad(request.getCapacidad());
        habi.setPrecio(request.getPrecio());
        habi.setEstado(request.getEstado());
        habi.setTipo(request.getTipo());
        habi.setUsuario(usuario);
        repo.save(habi);
    }

    public List<Habitacion> getall() 
    {
        return repo.findAll();
    }

    public Habitacion getbyid(Integer id)
    {
        Habitacion habi = repo.findById(id).orElseThrow(()->new RuntimeException ("No se encontro id de la habitacion"));
        return habi;
    }

    public void update (Integer id, HabitacionRequest request)
    {
        Habitacion habi = repo.findById(id).orElseThrow(()->new RuntimeException ("No se encontro id de la habitacion"));
        habi.setNombre(request.getNombre());
        habi.setCapacidad(request.getCapacidad());
        habi.setPrecio(request.getPrecio());
        habi.setEstado(request.getEstado());
        habi.setTipo(request.getTipo());
        repo.save(habi);
    }
    public void delete(Integer id)
    {
        repo.deleteById(id);;
    }
}
