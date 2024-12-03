package seguridad.informacion.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import seguridad.informacion.entitys.Cliente;
import seguridad.informacion.entitys.Reclamos;
import seguridad.informacion.repository.ClienteRepository;
import seguridad.informacion.repository.ReclamosRepository;
import seguridad.informacion.request.ReclamosRequest;

@Service
public class ReclamosService 
{
    @Autowired
    ReclamosRepository repository;

    @Autowired
    ClienteRepository clie;

    public void saveReclamo(ReclamosRequest request)
    {
        Reclamos recla = new Reclamos();
        recla.setDescripcion(request.getDescripcion());

        Cliente client = clie.findByDniruc(request.getCliente()).get();

        recla.setCliente(client);
        repository.save(recla);
    }

    public List<Reclamos> getall()
    {
        return repository.findAll();
    }
}
