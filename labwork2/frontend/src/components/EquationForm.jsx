import { styles } from '../styles';

export const EquationForm = ({ data, setData }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
    <div>
      <label>Выберите уравнение:</label><br/>
      <select 
        style={{...styles.select, width: '100%'}} 
        value={data.equation_id} 
        onChange={e => setData({...data, equation_id: parseInt(e.target.value)})}
      >
        <option value={1}>x³ - 1.89x² - 2x + 1.76 = 0</option>
        <option value={2}>x³ + 4.81x² - 17.37x + 5.38 = 0</option>
        <option value={3}>sin(x) - 0.5 = 0</option>
      </select>
    </div>
    <div>
      <label>Метод решения:</label><br/>
      <select 
        style={{...styles.select, width: '100%'}} 
        value={data.method} 
        onChange={e => setData({...data, method: e.target.value})}
      >
        <option value="chord">Метод хорд</option>
        <option value="newton">Метод Ньютона</option>
        <option value="iteration">Метод простой итерации</option>
      </select>
    </div>
    <div style={{ display: 'flex', gap: '15px', gridColumn: '1 / -1' }}>
      <div>
        <label>Граница a:</label><br/>
        <input type="number" style={styles.input} value={data.a} onChange={e => setData({...data, a: parseFloat(e.target.value)})} />
      </div>
      <div>
        <label>Граница b:</label><br/>
        <input type="number" style={styles.input} value={data.b} onChange={e => setData({...data, b: parseFloat(e.target.value)})} />
      </div>
      <div>
        <label>Точность (ε):</label><br/>
        <input type="number" step="0.001" style={styles.input} value={data.epsilon} onChange={e => setData({...data, epsilon: parseFloat(e.target.value)})} />
      </div>
    </div>
  </div>
);