package seguridad.informacion.entitys;

import org.springframework.security.core.GrantedAuthority;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Rol implements GrantedAuthority 
{
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue (strategy = GenerationType.AUTO)
	Integer id;
	
	@Column
	String name;
	String descripcion;
	String estado;
	
	public Rol() {}

	public Rol(int i, String string, String descripcion, String estado) {
		this.id = i;
		this.name = string;
		this.descripcion = descripcion;
		this.estado = estado;
	}

	public Integer getId() {
		return id;
	}
	
	public void setId(Integer id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public String getEstado() {
		return estado;
	}

	public void setEstado(String estado) {
		this.estado = estado;
	}

	@Override
	public String getAuthority() 
	{
		return "ROLE_" + this.name;
	}
}
