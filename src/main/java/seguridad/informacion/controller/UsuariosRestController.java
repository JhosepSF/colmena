package seguridad.informacion.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import seguridad.informacion.DTO.UsuarioDTO;
import seguridad.informacion.entitys.Usuario;
import seguridad.informacion.request.UsuarioRequest;
import seguridad.informacion.service.UsuarioService;

@RestController
@RequestMapping("/usuarios")
public class UsuariosRestController 
{
    @Autowired
    public UsuarioService usuarioService;

    @PostMapping("/new")
    public void crearUsuario(@RequestBody UsuarioRequest request) throws IOException
    {
        usuarioService.saveUsuario(request);
    }

    @GetMapping("/get/{id}")
    public Usuario obtenerUsuario(@PathVariable Integer id) throws IOException
    {
        return usuarioService.getUsuario(id);
    }

    @GetMapping("/all")
    public Iterable<UsuarioDTO> obtenerTodosLosUsuarios() throws IOException
    {
        return usuarioService.getUsers();
    }
    
    @GetMapping("/all/inactivos")
    public Iterable<UsuarioDTO> obtenerTodosLosUsuariosInactivos() throws IOException
    {
        return usuarioService.getUsersInactivos();
    }

    @PostMapping("/update/{id}")
    public void actualizarUsuario(@PathVariable Integer id, @RequestBody UsuarioRequest request) throws IOException
    {
        usuarioService.updateUsuario(id, request);
    }
    
    @PostMapping("/activate/{id}")
    public void activarUsuario(@PathVariable Integer id) throws IOException
    {
        usuarioService.activateUsuario(id);
    }

    @DeleteMapping("/delete/{id}")
    public void eliminarUsuario(@PathVariable Integer id) throws IOException
    {
        usuarioService.deleteUsuario(id);
    }
}
