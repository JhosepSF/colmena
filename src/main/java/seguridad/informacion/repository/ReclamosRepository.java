package seguridad.informacion.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import seguridad.informacion.entitys.Reclamos;

public interface ReclamosRepository extends JpaRepository<Reclamos, Integer>
{
    
}
