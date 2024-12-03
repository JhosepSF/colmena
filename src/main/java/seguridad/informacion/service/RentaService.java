package seguridad.informacion.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import seguridad.informacion.entitys.Caja;
import seguridad.informacion.entitys.Cliente;
import seguridad.informacion.entitys.Habitacion;
import seguridad.informacion.entitys.Renta;
import seguridad.informacion.repository.CajaRepository;
import seguridad.informacion.repository.ClienteRepository;
import seguridad.informacion.repository.HabitacionRepository;
import seguridad.informacion.repository.RentaRepository;
import seguridad.informacion.request.RentaRequest;

@Service
public class RentaService
{
    @Autowired
    RentaRepository repo;

    @Autowired
    ClienteRepository clienterepo;

    @Autowired
    HabitacionRepository habirepo;

    @Autowired
    CajaRepository cajarepo;
    
    public void saveVenta(RentaRequest request)
    {
        Cliente clie = clienterepo.findByDniruc(request.getCliente())
                        .orElseThrow(()->new RuntimeException("No se encontro al usuario"));

        Habitacion habi = habirepo.findById(request.getHabitacion())
                        .orElseThrow(()->new RuntimeException("No se encontro la habitacion"));

        Caja caj = cajarepo.findById(request.getCaja())
                    .orElseThrow(()->new RuntimeException("No se encontro la caja"));     

        Renta renta = new Renta();
        renta.setId(request.getId());
        renta.setEstado(request.getEstado());
        renta.setFecha(request.getFecha());
        renta.setHora(request.getHora());
        renta.setMetodopago(request.getMetodopago());
        renta.setPrecio(request.getPrecio());
        renta.setCliente(clie);
        renta.setHabitacion(habi);
        renta.setCaja(caj);

        habi.setEstado("Disponible");
        habirepo.save(habi);
        repo.save(renta);
    }

    public void update(Integer id, RentaRequest request)
    {
        Renta venta = repo.findById(id)
                        .orElseThrow(()->new RuntimeException("No se encontro la venta"));
        venta.setEstado(request.getEstado());
        repo.save(venta);
    }

    public Renta getById(Integer id)
    {
        return repo.findById(id)
                .orElseThrow(()->new RuntimeException("No se encontro la venta"));
    }

    public List<Renta> getAll()
    {
        return repo.findAll();
    }

    public void delete(Integer id)
    {
        Renta venta = repo.findById(id)
                        .orElseThrow(()->new RuntimeException("No se encontro la venta"));
        venta.setEstado("Cancelado");
        repo.save(venta);;
    }
}
