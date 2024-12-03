package seguridad.informacion.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import seguridad.informacion.entitys.Caja;

public interface CajaRepository extends JpaRepository <Caja, Integer>
{
    boolean findByFechaapertura(String fecha);
}