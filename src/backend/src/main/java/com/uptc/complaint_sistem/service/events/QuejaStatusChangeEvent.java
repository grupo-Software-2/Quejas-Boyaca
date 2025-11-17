package com.uptc.complaint_sistem.service.events; 

import java.time.LocalDateTime;

public class QuejaStatusChangeEvent {
    private Long idQueja;
    private String estadoAnterior;
    private String estadoNuevo;
    private LocalDateTime timestampEvento; 

    public QuejaStatusChangeEvent(Long idQueja, String estadoAnterior, String estadoNuevo, LocalDateTime timestampEvento) {
        this.idQueja = idQueja;
        this.estadoAnterior = estadoAnterior;
        this.estadoNuevo = estadoNuevo;
        this.timestampEvento = timestampEvento;
    }

    public Long getIdQueja() { return idQueja; }
    public String getEstadoAnterior() { return estadoAnterior; }
    public String getEstadoNuevo() { return estadoNuevo; }
    public LocalDateTime getTimestampEvento() { return timestampEvento; }
    
    public void setIdQueja(Long idQueja) { this.idQueja = idQueja; }
    public void setEstadoAnterior(String estadoAnterior) { this.estadoAnterior = estadoAnterior; }
    public void setEstadoNuevo(String estadoNuevo) { this.estadoNuevo = estadoNuevo; }
    public void setTimestampEvento(LocalDateTime timestampEvento) { this.timestampEvento = timestampEvento; }
}