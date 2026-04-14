import { styles } from '../styles';

export const SystemForm = ({ data, setData }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
    <div>
      <strong>Выберите систему уравнений (МПИ):</strong><br/>
      <select 
        style={{ ...styles.input, marginTop: '10px', width: '100%', maxWidth: '400px' }}
        value={data.system_id}
        onChange={e => setData({ ...data, system_id: parseInt(e.target.value) })}
      >
        <option value={1}>Система 1: tg(xy + 0.2) = x²</option>
        <option value={2}>Система 2: sin(y - 1) + x = 1.3</option>
      </select>

      <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '8px', marginTop: '15px', display: 'inline-block' }}>
        {data.system_id === 1 ? (
          <>
            1. tg(x*y + 0.2) = x²<br/>
            2. x² + 2y² = 1
          </>
        ) : (
          <>
            1. sin(y - 1) + x = 1.3<br/>
            2. y - sin(x + 1) = 0.8
          </>
        )}
      </div>
    </div>
    
    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
      <div>
        <label>Начальное x₀:</label><br/>
        <input 
          type="number" 
          style={styles.input} 
          value={data.x0} 
          onChange={e => setData({...data, x0: parseFloat(e.target.value)})}
        />
      </div>
      <div>
        <label>Начальное y₀:</label><br/>
        <input 
          type="number" 
          style={styles.input} 
          value={data.y0} 
          onChange={e => setData({...data, y0: parseFloat(e.target.value)})}
        />
      </div>
      <div>
        <label>Точность (ε):</label><br/>
        <input 
          type="number" 
          step="0.001"
          style={styles.input} 
          value={data.epsilon} 
          onChange={e => setData({...data, epsilon: parseFloat(e.target.value)})}
        />
      </div>
    </div>
  </div>
);