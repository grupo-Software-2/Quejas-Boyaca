import React, { useState, useEffect, useCallback } from 'react';
import { complaintsAPI } from '../services/api'; 
import { useAuth } from '../context/AuthContext'; 

const styles = {
    container: {
        marginTop: '20px',
        paddingTop: '15px',
        borderTop: '2px solid #f0f0f0',
        color: '#000',
    },
    title: {
        fontSize: '18px',
        color: '#007bff',
        marginBottom: '15px',
        display: 'flex',
        alignItems: 'center',
        fontWeight: 'bold',
    },
    historyBox: {
        maxHeight: '300px',
        overflowY: 'auto',
        border: '1px solid #ddd',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '15px',
        backgroundColor: '#f8f9fa',
    },
    eventItem: {
        padding: '8px 0',
        borderBottom: '1px dotted #ccc',
    },
    eventHeader: {
        fontWeight: 'bold',
        fontSize: '14px',
        marginBottom: '3px',
    },
    eventContent: {
        fontSize: '14px',
        color: '#444',
        marginLeft: '15px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    textArea: {
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        resize: 'vertical',
        fontSize: '14px',
    },
    button: {
        padding: '10px 15px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        alignSelf: 'flex-start',
        fontWeight: 'bold',
    },
};


const getEventStyle = (type) => {
    switch (type) {
        case 'STATUS_CHANGE':
            return { color: '#007bff' }; 
        case 'ADMIN_NOTE':
            return { color: '#ffc107', fontWeight: 'normal' }; 
        case 'PUBLIC_ANSWER':
            return { color: '#28a745' }; 
        case 'COMPLAINT_CREATED':
            return { color: '#6c757d' }; 
        default:
            return { color: '#000' };
    }
};

const AnswerSection = ({ complaintId, onAnswerAdded }) => {
    
    const { isAuthenticated } = useAuth(); 
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [history, setHistory] = useState([]); 

   
    const loadHistory = useCallback(() => {
      
        const dummyHistory = [
            {
                type: 'COMPLAINT_CREATED',
                content: 'Queja registrada. Inicio de conteo de duración.',
                date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), 
                user: 'Ciudadano'
            },
            {
                type: 'STATUS_CHANGE',
                content: 'Estado cambiado a REVISION. Duración actual: 2 días y 4 horas.',
                date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), 
                user: 'Admin 1'
            },
            {
                type: 'ADMIN_NOTE',
                content: 'Se ha asignado el caso al Dpto. de Soporte para investigación.',
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), 
                user: 'Admin 1'
            },
            {
                type: 'PUBLIC_ANSWER',
                content: 'Hemos recibido su queja y ya se encuentra en proceso de revisión, le daremos respuesta definitiva en 48h.',
                date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), 
                user: 'Admin 2'
            },
            {
                type: 'STATUS_CHANGE',
                content: 'Estado cambiado a CERRADA. Tiempo de respuesta total: 5 días, 4 horas y 12 minutos.',
                date: new Date().toISOString(), 
                user: 'Admin 3'
            }
        ].sort((a, b) => new Date(a.date) - new Date(b.date)); 

        setHistory(dummyHistory);
    }, [complaintId]);

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    const handleAnswerSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim() || !isAuthenticated) return;

        setIsSending(true);
        try {
           
            await complaintsAPI.createAnswer(complaintId, message.trim());
            setMessage('');
            
           
            loadHistory(); 
            onAnswerAdded(); 
            
        } catch (error) {
          
            console.error("Error al enviar respuesta:", error.response?.data?.error || "Error desconocido al contactar al servidor.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.title}>
                Histórico de Gestión (Eventos y Duración)
            </div>

            <div style={styles.historyBox}>
                {history.length === 0 ? (
                    <p style={{ color: '#000', textAlign: 'center' }}>No hay eventos registrados.</p>
                ) : (
                    history.map((event, index) => (
                        <div key={index} style={styles.eventItem}>
                            <div style={styles.eventHeader}>
                                <span style={getEventStyle(event.type)}>
                                    {new Date(event.date).toLocaleString()}
                                </span>
                                <span style={{ float: 'right', fontWeight: 'normal', color: '#666' }}>
                                    Por: {event.user || 'Desconocido'}
                                </span>
                            </div>
                            <div style={styles.eventContent}>
                                {event.content}
                            </div>
                        </div>
                    ))
                )}
            </div>

           
            {isAuthenticated && (
                <div style={{ marginTop: '20px' }}>
                    <h4 style={{ color: '#333', marginBottom: '10px' }}>Agregar Respuesta Pública</h4>
                    <form onSubmit={handleAnswerSubmit} style={styles.form}>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Escribe la respuesta que será visible para el usuario..."
                            required
                            rows="4"
                            style={styles.textArea}
                            disabled={isSending}
                        />
                        <button
                            type="submit"
                            style={styles.button}
                            disabled={isSending || !message.trim()}
                        >
                            {isSending ? 'Enviando...' : 'Enviar Respuesta'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AnswerSection;