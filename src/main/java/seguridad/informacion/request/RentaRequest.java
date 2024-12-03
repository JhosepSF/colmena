package seguridad.informacion.request;

public class RentaRequest
{
    Integer id;
    String cliente;
    String metodopago;
    Integer habitacion;
    Double precio;
    String estado;
    String fecha;
    String hora;
    Integer caja;

    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public Double getPrecio() {
        return precio;
    }
    public void setPrecio(Double precio) {
        this.precio = precio;
    }
    public String getMetodopago() {
        return metodopago;
    }
    public void setMetodopago(String metodopago) {
        this.metodopago = metodopago;
    }
    public String getEstado() {
        return estado;
    }
    public void setEstado(String estado) {
        this.estado = estado;
    }
    public String getFecha() {
        return fecha;
    }
    public void setFecha(String fecha) {
        this.fecha = fecha;
    }
    public String getHora() {
        return hora;
    }
    public void setHora(String hora) {
        this.hora = hora;
    }
    public Integer getHabitacion() {
        return habitacion;
    }
    public void setHabitacion(Integer habitacion) {
        this.habitacion = habitacion;
    }
    public String getCliente() {
        return cliente;
    }
    public void setCliente(String cliente) {
        this.cliente = cliente;
    }
    public Integer getCaja() {
        return caja;
    }
    public void setCaja(Integer caja) {
        this.caja = caja;
    }
}
