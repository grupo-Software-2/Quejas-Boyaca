package com.uptc.complaint_sistem.service; 

import org.springframework.stereotype.Service;

import com.uptc.complaint_sistem.service.events.QuejaStatusChangeEvent;

@Service
public class EventPublisherService {

    public void publishStatusChangeEvent(QuejaStatusChangeEvent event) {
        
        System.out.println("=================================================");
        System.out.println("BACKEND PUBLICADOR: Evento de CAMBIO DE ESTADO ENVIADO");
        System.out.println("  Queja ID: " + event.getIdQueja());
        System.out.println("  Estado Final: " + event.getEstadoNuevo());
        System.out.println("  Timestamp: " + event.getTimestampEvento());
        System.out.println("=================================================");
    }
}