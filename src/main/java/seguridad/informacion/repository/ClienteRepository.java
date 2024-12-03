package seguridad.informacion.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import seguridad.informacion.entitys.Cliente;
import seguridad.informacion.entitys.Habitacion;

public interface ClienteRepository extends JpaRepository <Cliente, Integer>
{
    Optional <Cliente> findByDniruc (String dniruc);
    List <Cliente> findByHabitacion (Habitacion habitacion);
}
