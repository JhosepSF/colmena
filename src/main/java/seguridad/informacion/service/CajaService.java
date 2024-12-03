package seguridad.informacion.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import seguridad.informacion.entitys.Caja;
import seguridad.informacion.entitys.Usuario;
import seguridad.informacion.repository.CajaRepository;
import seguridad.informacion.repository.UsuarioRepository;
import seguridad.informacion.request.CajaRequest;

@Service
public class CajaService
{
    @Autowired
    CajaRepository cajarepo;

    @Autowired
    UsuarioRepository userrepo;

    public void apertura(CajaRequest request, String token)
    {
        String actualToken = token.startsWith("Bearer ") ? token.substring(7) : token;
        String username = getUsernameFromToken(actualToken);

        System.out.println(request.getId());
        System.out.println(request.getFechaapertura());
        System.out.println(request.getHoraapertura());
        System.out.println(request.getMontoi());

        Caja caja = new Caja();
        caja.setId(request.getId());
        caja.setFechaapertura(request.getFechaapertura());
        caja.setHoraapertura(request.getHoraapertura());
        caja.setMontoi(request.getMontoi());

        Usuario user = userrepo.findByUsername(username).get();

        caja.setUsuario(user);
        cajarepo.save(caja);
    }

    public void cierre(CajaRequest request)
    {
        Caja caja = cajarepo.findById(request.getId()).get();
        caja.setFechacierre(request.getFechacierre());
        caja.setHoracierre(request.getHoracierre());
        caja.setMontof(request.getMontof());
        cajarepo.save(caja);
    }

    public List<Caja> getallCaja()
    {
        return cajarepo.findAll();
    }

    private String getUsernameFromToken(String token) 
    {
        try 
        {
            String secretKey = "586E3272357538782F413F4428472B4B6250655368566B597033733676397924"; 
            
            Claims claims = Jwts.parser()
                                .setSigningKey(secretKey)
                                .parseClaimsJws(token)
                                .getBody();

            return claims.getSubject(); 

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
