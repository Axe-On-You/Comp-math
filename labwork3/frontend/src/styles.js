export const styles = {
    container: { 
        maxWidth: '1100px', 
        margin: '0 auto', 
        padding: '40px 20px', 
        fontFamily: '"Inter", "system-ui", sans-serif', 
        color: '#1e293b', 
        backgroundColor: '#f8fafc', 
        minHeight: '100vh' 
    },
    
    authorInfo: { 
        textAlign: 'right', 
        fontSize: '0.95rem', 
        color: '#64748b', 
        borderRight: '4px solid #6366f1', 
        paddingRight: '15px', 
        marginBottom: '30px',
        lineHeight: '1.5'
    },
    
    section: { 
        backgroundColor: '#ffffff', 
        padding: '30px', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', 
        marginBottom: '30px',
        border: '1px solid #e2e8f0'
    },
    
    tabButton: (active) => ({
        padding: '12px 24px',
        cursor: 'pointer',
        backgroundColor: active ? '#6366f1' : '#e2e8f0',
        color: active ? '#ffffff' : '#475569',
        border: 'none',
        borderRadius: '8px 8px 0 0',
        fontWeight: '600',
        marginRight: '5px',
        transition: 'all 0.2s ease'
    }),
    
    button: {
        backgroundColor: '#6366f1',
        color: 'white',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'background-color 0.2s',
        width: '100%',
        marginTop: '10px'
    },
    
    // Поля ввода
    input: { 
        padding: '10px', 
        border: '1px solid #cbd5e1', 
        borderRadius: '8px', 
        width: '100%',
        fontSize: '1rem',
        boxSizing: 'border-box',
        marginTop: '5px'
    },
    
    // Выпадающие списки (Select)
    select: {
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid #cbd5e1',
        width: '100%',
        fontSize: '1rem',
        backgroundColor: 'white',
        cursor: 'pointer',
        marginTop: '5px'
    },
    
    label: { 
        display: 'block', 
        fontWeight: '600', 
        color: '#334155',
        fontSize: '0.9rem'
    },
    
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '15px'
    },
    
    error: {
        color: '#ef4444',
        backgroundColor: '#fee2e2',
        padding: '12px',
        borderRadius: '8px',
        marginTop: '15px',
        fontSize: '0.9rem',
        border: '1px solid #fecaca'
    },

    resultBox: {
        marginTop: '20px',
        padding: '20px',
        backgroundColor: '#f1f5f9',
        borderRadius: '8px',
        borderLeft: '4px solid #10b981'
    }
};