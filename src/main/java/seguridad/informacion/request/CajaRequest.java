package seguridad.informacion.request;

public class CajaRequest 
{
    Integer id;
    String fechaapertura;
    String horaapertura;
    String fechacierre;
    String horacierre;
    Double montoi;
    Double montof;

    public Integer getId()
    {
        return id;
    }
    public void setId(Integer id)
    {
        this.id = id;
    }
    
    public String getFechaapertura() {
        return fechaapertura;
    }
    public void setFechaapertura(String fechaapertura) {
        this.fechaapertura = fechaapertura;
    }
    public String getHoraapertura() {
        return horaapertura;
    }
    public void setHoraapertura(String horaapertura) {
        this.horaapertura = horaapertura;
    }
    public String getFechacierre() {
        return fechacierre;
    }
    public void setFechacierre(String fechacierre) {
        this.fechacierre = fechacierre;
    }
    public String getHoracierre() {
        return horacierre;
    }
    public void setHoracierre(String horacierre) {
        this.horacierre = horacierre;
    }
    public Double getMontoi() {
        return montoi;
    }
    public void setMontoi(Double montoi) {
        this.montoi = montoi;
    }
    public Double getMontof() {
        return montof;
    }
    public void setMontof(Double montof) {
        this.montof = montof;
    } 
}
