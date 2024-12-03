package seguridad.informacion.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import seguridad.informacion.entitys.Cliente;
import seguridad.informacion.request.ClienteRequest;
import seguridad.informacion.service.ClienteService;

@RestController
@RequestMapping("/cliente")
public class ClienteRestController 
{
    @Autowired
    ClienteService service;
    
    @PostMapping("/new")
    public void crearCliente(@RequestBody ClienteRequest request)
    {
        service.save(request);
    }

    @GetMapping("/getall")
    public List<Cliente> getall()
    {
        return service.getall();
    }

    @GetMapping("/getxhabitacion/{habitacion}")
    public List<Cliente> gethabitacion(@PathVariable Integer habitacion)
    {
        return service.getbyhabitacion(habitacion);
    }

    @GetMapping("/get/{id}")
    public Cliente getcliente(@PathVariable Integer id)
    {
        return service.getbycliente(id);
    }    
}
