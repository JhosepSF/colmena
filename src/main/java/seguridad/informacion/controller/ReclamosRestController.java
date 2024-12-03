package seguridad.informacion.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import seguridad.informacion.entitys.Reclamos;
import seguridad.informacion.request.ReclamosRequest;
import seguridad.informacion.service.ReclamosService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/reclamos")
public class ReclamosRestController
{
    @Autowired
    ReclamosService service;

    @GetMapping("/getall")
    public List<Reclamos> getall () 
    {
        return service.getall();
    }
    
    @PostMapping("/save")
    public void save (@RequestBody ReclamosRequest request) 
    {
        service.saveReclamo(request);
    }
}
