import React, { useState } from 'react';
import { complaintsAPI } from '../services/api';

function AnswerSection({ complaintId, initialAnswers, onAnswerAdded }) {
    const [answers, setAnswers] = useState(initialAnswers || []);
    const [newMessage, setNewMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const response = await complaintsAPI.createAnswer(complaintId, newMessage);
            
            setAnswers([...answers, response.data]);
            setNewMessage('');
            
            if (onAnswerAdded) {
                onAnswerAdded(response.data);
            }
        } catch (error) {
            console.error("Error al añadir respuesta:", error);
            alert("Error al añadir la respuesta. Asegúrate de que el backend está corriendo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ marginTop: '10px', padding: '10px', borderTop: '1px solid #ccc' }}>
            {/* Sección para mostrar respuestas */}
            <h4 style={{ color: '#007bff' }}>Respuestas ({answers.length})</h4>
            {answers.length === 0 ? (
                <p style={{ color: '#666' }}>Aún no hay respuestas para esta queja.</p>
            ) : (
                <ul style={{ listStyle: 'none', paddingLeft: '10px' }}>
                    {answers.map((answer, index) => (
                        <li key={index} style={{ marginBottom: '8px', padding: '5px', borderLeft: '3px solid #007bff' }}>
                            <p style={{ margin: 0 }}>{answer.message}</p>
                            <small style={{ color: '#1e1e1eff' }}> {new Date(answer.date).toLocaleString()}</small>
                        </li>
                    ))}
                </ul>
            )}

            {/* Sección para añadir una nueva respuesta */}
            <form onSubmit={handleSubmit} style={{ marginTop: '15px' }}>
                <textarea
                    rows="3"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe tu respuesta aquí..."
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #000000ff', resize: 'vertical', backgroundColor: '#ffffffff' }}
                    required
                />
                <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                        padding: '8px 15px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginTop: '5px'
                    }}
                >
                    {isSubmitting ? 'Enviando...' : 'Responder'}
                </button>
            </form>
        </div>
    );
}

export default AnswerSection;