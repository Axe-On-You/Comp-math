import { styles } from '../styles';

export const SystemForm = ({ data, setData }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
    <div>
      <strong>Система уравнений:</strong><br/>
      1. tg(x*y + 0.2) = x²<br/>
      2. x² + 2y² = 1
    </div>
    
    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
      <div>
        <label>Начальное x0:</label><br/>
        <input 
          type="number" 
          style={styles.input} 
          value={data.x0} 
          onChange={e => setData({...data, x0: parseFloat(e.target.value)})}
        />
      </div>
      <div>
        <label>Начальное y0:</label><br/>
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