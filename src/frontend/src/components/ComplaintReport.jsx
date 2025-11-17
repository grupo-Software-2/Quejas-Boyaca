import React, { useState, useEffect, useCallback } from 'react';
import { protectedComplaintsAPI } from '../services/api'; 
import { useAuth } from '../context/AuthContext.jsx'; 
import { complaintsAPI } from '../services/api'; 


function ComplaintReport({ entities, normalizeEntityName }) {
  const { isAuthenticated, isAdmin } = useAuth();
  const [reportData, setReportData] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReportData = useCallback(async () => {
    if (!isAuthenticated || !isAdmin) {
        setError("Acceso denegado. Solo administradores pueden ver este reporte.");
        return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // LLAMADA REAL A LA API
      const response = await protectedComplaintsAPI.getReportComplaints(); 
      setReportData(response.data || []); 
    } catch (err) {
      console.error("Error fetching report data:", err);
      setError(err.response?.data?.error || "No se pudieron cargar los datos del reporte. Inténtalo más tarde.");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isAdmin]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);
  

  const renderDetailedTable = () => {
    return (
        <div style={styles.tableWrapper}>
            <h3 style={styles.sectionTitle}>Registro Detallado y Duración de Quejas</h3>
            <table style={styles.table}>
                <thead>
                    <tr style={styles.thRow}>
                        <th style={styles.th}>ID</th>
                        <th style={{...styles.th, minWidth: '250px'}}>Título de Queja</th> 
                        <th style={styles.th}>Entidad</th>
                        <th style={styles.th}>Fecha Registro</th>
                        <th style={styles.th}>Fecha Cierre</th>
                        <th style={styles.th}>Estado</th>
                        <th style={styles.th}>Duración Total</th>
                    </tr>
                </thead>
                <tbody>
                    {reportData.map((c, index) => (
                        <tr key={c.id} style={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#fff' }}>
                            <td style={styles.td}>{c.id}</td>
                            <td 
                                style={{
                                    ...styles.td, 
                                    maxWidth: '300px',
                                    whiteSpace: 'normal', 
                                    wordBreak: 'break-word',
                                    fontWeight: '500' 
                                }}
                            >
                                {c.title}
                            </td>
                            <td style={styles.td}>{normalizeEntityName(c.entity)}</td>
                            <td style={styles.td}>{new Date(c.date).toLocaleDateString()}</td>
                            <td style={styles.td}>{c.closureDate ? new Date(c.closureDate).toLocaleDateString() : 'N/A'}</td>
                            <td style={{...styles.td, fontWeight: 'bold', color: c.status === 'CERRADA' || c.status === 'RECHAZADA' ? '#dc3545' : '#17a2b8'}}>{c.status}</td>
                            <td style={styles.td}>
                                <strong>{c.duration}</strong>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
  };
  
  if (loading) {
    return <p style={{ textAlign: 'center', padding: '30px', color: '#333' }}>Cargando datos del reporte...</p>;
  }

  if (error) {
    return <div style={styles.errorBox}>{error}</div>;
  }
  
  if (!reportData || reportData.length === 0) {
      return <p style={{ textAlign: 'center', padding: '30px', color: '#333' }}>No hay datos disponibles para generar el reporte.</p>;
  }
  
  // Cálculos de KPIs y Distribución por Entidad
  const total = reportData.length;
  const closedCount = reportData.filter(c => c.status === 'CERRADA' || c.status === 'RECHAZADA').length;
  const pendingCount = reportData.filter(c => c.status === 'PENDIENTE' || c.status === 'REVISION').length;
  const processCount = reportData.filter(c => c.status === 'PROCESO').length;

  const entityCounts = entities.map(entityCode => ({
      entity: entityCode,
      count: reportData.filter(c => c.entity === entityCode).length
  })).filter(item => item.count > 0);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Vista General y Reporte de Quejas</h2>
      <p style={styles.subtitle}>Métricas de Estado y Duración de la Gestión.</p>

      {/* Tarjetas de KPIs */}
      <div style={styles.kpiGrid}>
        <KpiCard title="TOTAL QUEJAS" value={total} color="#343a40" />
        <KpiCard title="PENDIENTE / REVISIÓN" value={pendingCount} color="#ffc107" />
        <KpiCard title="EN PROCESO" value={processCount} color="#17a2b8" />
        {/* Aquí la duración debe venir del cálculo de tu API real */}
        <KpiCard title="TIEMPO PROMEDIO RES." value="Calculando..." color="#6f42c1" /> 
        <KpiCard title="CERRADAS (Total)" value={closedCount} color="#28a745" />
      </div>

      <h3 style={styles.sectionTitle}>Distribución de Quejas por Entidad</h3>
      <div style={styles.distributionBox}>
        {entityCounts
          .sort((a, b) => b.count - a.count)
          .map((item, index) => (
            <div key={item.entity} style={styles.entityBarItem}>
              <div style={styles.entityNameContainer}>
                {normalizeEntityName(item.entity)}
              </div>
              <div style={styles.progressBarWrapper}>
                <div 
                  style={{
                    ...styles.progressBar,
                    width: `${(item.count / total) * 100}%`,
                    backgroundColor: index % 2 === 0 ? '#4CAF50' : '#007bff'
                  }}
                ></div>
              </div>
              <div style={styles.entityCount}>
                <strong>{item.count}</strong> ({((item.count / total) * 100).toFixed(1)}%)
              </div>
            </div>
          ))}
      </div>
      
      {/* TABLA DETALLADA */}
      <div style={{ marginTop: '40px' }}>
        {renderDetailedTable()} 
      </div>
    </div>
  );
}

// Componente para las tarjetas de KPIs
const KpiCard = ({ title, value, color }) => (
  <div style={{ ...styles.kpiCard, borderLeft: `5px solid ${color}` }}>
    <div style={styles.kpiTitle}>{title}</div>
    <div style={styles.kpiValue}>{value}</div>
  </div>
);


const styles = {
  container: {
    padding: '20px 0',
  },
  title: {
    textAlign: 'center',
    color: '#007bff',
    marginBottom: '5px',
  },
  subtitle: {
    textAlign: 'center',
    color: '#6c757d',
    marginBottom: '30px',
  },
  errorBox: {
    padding: '15px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb',
    borderRadius: '4px',
    textAlign: 'center',
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  kpiCard: {
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  kpiTitle: {
    fontSize: '11px',
    color: '#6c757d',
    marginBottom: '5px',
    textTransform: 'uppercase',
  },
  kpiValue: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
  sectionTitle: {
    marginTop: '20px',
    marginBottom: '15px',
    color: '#333',
    borderBottom: '1px solid #eee',
    paddingBottom: '5px',
  },
  // --- Estilos de Distribución ---
  distributionBox: {
      marginBottom: '30px',
  },
  entityBarItem: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '10px',
      padding: '5px 0',
  },
  entityNameContainer: {
      width: '180px',
      fontWeight: '600',
      fontSize: '14px',
  },
  progressBarWrapper: {
      flexGrow: 1,
      height: '10px',
      backgroundColor: '#e9ecef',
      borderRadius: '5px',
      overflow: 'hidden',
      margin: '0 10px',
  },
  progressBar: {
      height: '100%',
      transition: 'width 0.5s ease',
  },
  entityCount: {
      width: '80px',
      textAlign: 'right',
      fontSize: '13px',
      color: '#6c757d',
  },
  // --- Estilos de la tabla detallada (Ajustado para Scroll Vertical) ---
  tableWrapper: {
    overflowX: 'auto', 
    overflowY: 'auto',   
    maxHeight: '400px',  
    marginBottom: '30px',
    borderRadius: '8px',
    border: '1px solid #ccc',
  },
  table: {
    width: '100%',
    minWidth: '700px', 
    borderCollapse: 'collapse',
    fontSize: '14px',
  },
  thRow: {
    backgroundColor: '#007bff',
    color: 'white',
  },
  th: {
    padding: '10px',
    textAlign: 'left',
    position: 'sticky', 
    top: 0,
    zIndex: 10,
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #eee',
    textAlign: 'left',
  },
};

export default ComplaintReport;