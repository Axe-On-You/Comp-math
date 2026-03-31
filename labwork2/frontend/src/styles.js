export const styles = {
    container: { maxWidth: '1100px', margin: '0 auto', padding: '40px 20px', fontFamily: '"Inter", sans-serif', color: '#1e293b', backgroundColor: '#f8fafc', minHeight: '100vh' },
    authorInfo: { textAlign: 'right', fontSize: '0.9rem', color: '#64748b', borderRight: '4px solid #6366f1', paddingRight: '15px', marginBottom: '30px' },
    section: { backgroundColor: '#ffffff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', marginBottom: '30px' },
    tabButton: (active) => ({
        padding: '10px 20px',
        cursor: 'pointer',
        backgroundColor: active ? '#4f46e5' : '#e2e8f0',
        color: active ? '#fff' : '#475569',
        border: 'none',
        borderRadius: '8px 8px 0 0',
        fontWeight: '600',
        marginRight: '5px'
    }),
    input: { padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', width: '100px' },
    select: { padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff' },
    button: { padding: '12px 24px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '15px' },
    th: { backgroundColor: '#f1f5f9', padding: '10px', border: '1px solid #e2e8f0', fontSize: '0.85rem' },
    td: { padding: '10px', border: '1px solid #e2e8f0', textAlign: 'center', fontSize: '0.85rem' }
};