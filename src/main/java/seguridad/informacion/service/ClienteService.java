package seguridad.informacion.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import seguridad.informacion.entitys.Cliente;
import seguridad.informacion.entitys.Habitacion;
import seguridad.informacion.repository.ClienteRepository;
import seguridad.informacion.repository.HabitacionRepository;
import seguridad.informacion.request.ClienteRequest;

@Service
public class ClienteService 
{
    @Autowired
    ClienteRepository repo;

    @Autowired
    HabitacionRepository habirepo;

    public void save(ClienteRequest request)
    {
        Optional<Cliente> existingCliente = repo.findByDniruc(request.getDniruc());
        if (existingCliente.isPresent()) 
        {
            Cliente cliente = existingCliente.get();
            Habitacion habi = habirepo.findById(request.getHabitacion())
                    .orElseThrow(() -> new RuntimeException("No se encontró la habitación"));
            habi.setEstado("Ocupado");

            cliente.setHabitacion(habi);

            habirepo.save(habi);
            repo.save(cliente);
        }
        else
        {
            Cliente clie = new Cliente();
            clie.setNombre(request.getNombre());
            clie.setDniruc(request.getDniruc());
            clie.setDireccion(request.getDireccion());

            Habitacion habi = habirepo.findById(request.getHabitacion())
                    .orElseThrow(() -> new RuntimeException("No se encontró la habitación"));
            habi.setEstado("Ocupado");

            clie.setHabitacion(habi);

            habirepo.save(habi);
            repo.save(clie);
        }
    }

    public List<Cliente> getall()
    {
        return repo.findAll();
    }

    public List<Cliente> getbyhabitacion(Integer id)
    {
        Habitacion habi = habirepo.findById(id)
                        .orElseThrow(()-> new RuntimeException("No se encontro la habitacion"));
        
        return repo.findByHabitacion(habi);
    }

    public Cliente getbycliente(Integer id)
    {
        Cliente clie = repo.findById(id)
                        .orElseThrow(()-> new RuntimeException("No se encontro al cliente"));
        
        return clie;
    }
}   
