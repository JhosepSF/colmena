package seguridad.informacion.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import seguridad.informacion.entitys.Renta;

public interface RentaRepository extends JpaRepository<Renta, Integer>
{
    
}
