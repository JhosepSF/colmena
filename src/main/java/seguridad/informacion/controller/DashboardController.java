
package seguridad.informacion.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/dashboard")
public class DashboardController 
{
    @GetMapping("/")
    public String dashboard() 
    {
        return "index.html";
    }

    @GetMapping("/usuarios/")
    public String usuarios() 
    {
        return "all-user.html";
    }

    @GetMapping("/usuarios/crear")
    public String usuarioscrear() 
    {
        return "add-new-user.html";
    }
    
    @GetMapping("/roles/")
    public String roles() 
    {
        return "all-roles.html";
    }

    @GetMapping("/roles/crear")
    public String rolescrear() 
    {
        return "create-role.html";
    }

    @GetMapping("/habitaciones")
    public String habitacion()
    {
        return "all-habitaciones.html";
    }

    @GetMapping("/facturacion/lista")
    public String flista()
    {
        return "oder-list.html";
    }

    @GetMapping("/facturacion/detalle")
    public String detalle()
    {
        return "oder-detail.html";
    }

    @GetMapping("/facturacion/caja")
    public String caja()
    {
        return "caja.html";
    }

    @GetMapping("/reportes")
    public String reportes()
    {
        return "reportes.html";
    }

    @GetMapping("/facturacion/pdf")
    public String pdf()
    {
        return "pdf.html";
    }

    @GetMapping("/reclamos")
    public String reclamos()
    {
        return "all-reclamos.html";
    }
}