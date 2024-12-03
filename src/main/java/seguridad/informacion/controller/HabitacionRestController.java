package seguridad.informacion.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import seguridad.informacion.entitys.Habitacion;
import seguridad.informacion.request.HabitacionRequest;
import seguridad.informacion.service.HabitacionService;

@RestController
@RequestMapping("/habitacion")
public class HabitacionRestController 
{
    @Autowired
    HabitacionService service;
    
    @PostMapping("/crear")
    public void crearHabitacion(@RequestBody HabitacionRequest request)
    {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
         
        service.save(request, username);
    }

    @GetMapping("/getall")
    public List<Habitacion> getAllHabitaciones()
    {
        return service.getall();
    }

    @GetMapping("/get/{id}")
    public Habitacion getHabitacion(@PathVariable Integer id)
    {
        return service.getbyid(id);
    }

    @PostMapping("/update/{id}")
    public void actualizarHabitacion(@RequestBody HabitacionRequest request, @PathVariable Integer id)
    {
        service.update(id, request);
    }

    @DeleteMapping("/delete/{id}")
    public void eliminarHabitacion(@PathVariable Integer id)
    {
        service.delete(id);
    }
}
