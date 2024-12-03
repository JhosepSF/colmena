package seguridad.informacion.request;

public class ClienteRequest
{
    String nombre;
    String dniruc;
    Integer habitacion;
    String direccion;

    public Integer getHabitacion() {
        return habitacion;
    }
    public void setHabitacion(Integer habitacion) {
        this.habitacion = habitacion;
    }
    public String getNombre() {
        return nombre;
    }
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    public String getDniruc() {
        return dniruc;
    }
    public void setDniruc(String dniruc) {
        this.dniruc = dniruc;
    }
    public String getDireccion() {
        return direccion;
    }
    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }
}
