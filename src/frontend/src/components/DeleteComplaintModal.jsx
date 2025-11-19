import { useState } from 'react';

// Estilos base para el modal
const modalStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modal: {
        backgroundColor: '#fff',
        padding: '25px',
        borderRadius: '10px',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        color: '#000',
    },
    header: {
        borderBottom: '1px solid #eee',
        paddingBottom: '15px',
        marginBottom: '15px',
        textAlign: 'center',
    },
    title: {
        margin: 0,
        color: '#dc3545',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: '20px',
    },
    buttonBase: {
        padding: '10px 15px',
        borderRadius: '5px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background-color 0.3s',
    },
    confirmButton: {
        backgroundColor: '#dc3545',
        color: 'white',
    },
    cancelButton: {
        backgroundColor: '#f8f9fa',
        color: '#6c757d',
        border: '1px solid #dee2e6',
    },
};

const DeleteComplaintModal = ({ complaint, onConfirm, onCancel, isDeleting }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleDelete = () => {
        if (!password) {
            setError('Debe ingresar su contraseña para confirmar.');
            return;
        }
        setError('');
        onConfirm(password);
    };

    return (
        <div style={modalStyles.overlay}>
            <div style={modalStyles.modal}>
                <div style={modalStyles.header}>
                    <h3 style={modalStyles.title}>Confirmar Eliminación de Queja</h3>
                </div>
                
                <p style={{ color: '#000', marginBottom: '15px' }}>
                    Estás a punto de eliminar permanentemente la queja ID <strong>{complaint?.id}</strong>.
                </p>
                <p style={{ color: '#000', marginBottom: '15px', fontWeight: 'bold' }}>
                    Esta acción es irreversible.
                </p>

                <label htmlFor="delete-password" style={{ display: 'block', marginBottom: '5px', color: '#333' }}>
                    Ingrese su contraseña de administrador:
                </label>
                <input
                    id="delete-password"
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    style={{
                        width: '100%',
                        padding: '10px',
                        marginBottom: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                    }}
                    disabled={isDeleting}
                />
                
                {error && <p style={{ color: '#dc3545', fontSize: '12px', marginBottom: '10px' }}>{error}</p>}

                <div style={modalStyles.buttonContainer}>
                    <button
                        onClick={onCancel}
                        style={{ ...modalStyles.buttonBase, ...modalStyles.cancelButton }}
                        disabled={isDeleting}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleDelete}
                        style={{ ...modalStyles.buttonBase, ...modalStyles.confirmButton }}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Eliminando...' : 'Eliminar Queja'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteComplaintModal;