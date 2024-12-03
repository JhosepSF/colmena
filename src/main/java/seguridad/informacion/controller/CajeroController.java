package seguridad.informacion.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/dashboard/cajero")
public class CajeroController 
{
    @GetMapping("/")
    public String dashboardCajero() 
    {
        return "index-cajero.html";
    }

    @GetMapping("/habitaciones")
    public String cjerohabitaciones() 
    {
        return "all-habitaciones-cajero.html";
    }

    @GetMapping("/facturacion/lista")
    public String fcajerolista()
    {
        return "oder-list-cajero.html";
    }

    @GetMapping("/facturacion/detalle")
    public String detallecajero()
    {
        return "oder-detail-cajero.html";
    }
    
    @GetMapping("/facturacion/caja")
    public String cajacajero()
    {
        return "caja-cajero.html";
    }
    @GetMapping("/facturacion/pdf")
    public String pdfcajero()
    {
        return "pdf-cajero.html";
    }
}
