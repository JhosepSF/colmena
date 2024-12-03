package seguridad.informacion.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import seguridad.informacion.entitys.Renta;
import seguridad.informacion.request.RentaRequest;
import seguridad.informacion.service.RentaService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/rentas")
public class RentaRestController
{
    @Autowired
    RentaService service;
    
    @GetMapping("/getall")
    public List<Renta> getall() 
    {
        return service.getAll();
    }
    
    @GetMapping("/get/{id}")
    public Renta get(@PathVariable Integer id)
    {
        return service.getById(id);
    }

    @PostMapping("/save")
    public void save(@RequestBody RentaRequest request) 
    {
        System.out.println("Saving");
        service.saveVenta(request);
    }
    
    @PostMapping("/update/{id}")
    public void update (@PathVariable Integer id, @RequestBody RentaRequest request)
    {
        service.update(id, request);
    }

    @DeleteMapping("/delete/{id}")
    public void delete (@PathVariable Integer id)
    {
        service.delete(id);
    }
}
