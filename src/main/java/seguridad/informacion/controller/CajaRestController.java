package seguridad.informacion.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import seguridad.informacion.entitys.Caja;
import seguridad.informacion.service.CajaService;
import seguridad.informacion.request.CajaRequest;

@RestController
@RequestMapping("/caja")
public class CajaRestController 
{
    @Autowired
    CajaService service;

    @GetMapping("/getall")
    public List<Caja> getall()
    {
        return service.getallCaja();
    }

    @PostMapping("/apertura")
    public void apertura(@RequestBody CajaRequest request, @RequestHeader("Authorization") String token) 
    {
        service.apertura(request, token);
    }

    @PostMapping("/cierre")
    public void cierre(@RequestBody CajaRequest request)
    {
        service.cierre(request);
    }
}