import { useState } from 'react';
import axios from 'axios';

function App() {
  // Состояние вкладок: 'equation' или 'system'
  const [activeTab, setActiveTab] = useState('equation');
  
  // Состояние для одиночных уравнений
  const [eqData, setEqData] = useState({
    equation_id: 1,
    method: 'chord',
    a: 0,
    b: 2,
    epsilon: 0.01,
    initial_x: 0
  });

  // Состояние для систем
  const [sysData, setSysData] = useState({
    system_id: 1,
    x0: 0,
    y0: 0,
    epsilon: 0.01
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const solve = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    const url = activeTab === 'equation' 
      ? 'http://127.0.0.1:8000/api/equations/solve' 
      : 'http://127.0.0.1:8000/api/systems/solve';
    
    const payload = activeTab === 'equation' ? eqData : sysData;

    try {
      const response = await axios.post(url, payload);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Ошибка соединения с сервером");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
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

  return (
    <div style={styles.container}>
      <div style={styles.authorInfo}>
        <div style={{fontWeight: 'bold', color: '#4338ca'}}>Михайлов Петр Сергеевич</div>
        <div>Группа: P3211 | Вариант: 11</div>
      </div>

      <h1 style={{textAlign: 'center', color: '#1e1b4b'}}>Нелинейные уравнения и системы</h1>

      <div style={{ display: 'flex' }}>
        <button style={styles.tabButton(activeTab === 'equation')} onClick={() => {setActiveTab('equation'); setResult(null);}}>Уравнение</button>
        <button style={styles.tabButton(activeTab === 'system')} onClick={() => {setActiveTab('system'); setResult(null);}}>Система (МПИ)</button>
      </div>

      <section style={{ ...styles.section, borderRadius: '0 12px 12px 12px' }}>
        {activeTab === 'equation' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label>Выберите уравнение:</label><br/>
              <select style={{...styles.select, width: '100%'}} value={eqData.equation_id} onChange={e => setEqData({...eqData, equation_id: parseInt(e.target.value)})}>
                <option value={1}>x³ - 1.89x² - 2x + 1.76 = 0</option>
                <option value={2}>x³ + 4.81x² - 17.37x + 5.38 = 0</option>
              </select>
            </div>
            <div>
              <label>Метод решения:</label><br/>
              <select style={{...styles.select, width: '100%'}} value={eqData.method} onChange={e => setEqData({...eqData, method: e.target.value})}>
                <option value="chord">Метод хорд</option>
                <option value="newton">Метод Ньютона</option>
                <option value="iteration">Метод простой итерации</option>
              </select>
            </div>
            <div style={{display: 'flex', gap: '10px'}}>
              <div><label>a:</label><br/><input type="number" style={styles.input} value={eqData.a} onChange={e => setEqData({...eqData, a: parseFloat(e.target.value)})}/></div>
              <div><label>b:</label><br/><input type="number" style={styles.input} value={eqData.b} onChange={e => setEqData({...eqData, b: parseFloat(e.target.value)})}/></div>
              <div><label>ε:</label><br/><input type="number" style={styles.input} value={eqData.epsilon} onChange={e => setEqData({...eqData, epsilon: parseFloat(e.target.value)})}/></div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{gridColumn: '1 / span 2'}}>
              <strong>Система:</strong> tg(xy + 0.2) = x², x² + 2y² = 1
            </div>
            <div style={{display: 'flex', gap: '10px'}}>
              <div><label>Начальное x₀:</label><br/><input type="number" style={styles.input} value={sysData.x0} onChange={e => setSysData({...sysData, x0: parseFloat(e.target.value)})}/></div>
              <div><label>Начальное y₀:</label><br/><input type="number" style={styles.input} value={sysData.y0} onChange={e => setSysData({...sysData, y0: parseFloat(e.target.value)})}/></div>
              <div><label>ε:</label><br/><input type="number" style={styles.input} value={sysData.epsilon} onChange={e => setSysData({...sysData, epsilon: parseFloat(e.target.value)})}/></div>
            </div>
          </div>
        )}

        <div style={{marginTop: '30px'}}>
          <button style={styles.button} onClick={solve} disabled={loading}>
            {loading ? 'Вычисляем...' : 'Рассчитать'}
          </button>
        </div>
      </section>

      {error && <div style={{color: '#b91c1c', background: '#fef2f2', padding: '15px', borderRadius: '8px', marginBottom: '20px'}}>{error}</div>}

      {result && (
        <section style={styles.section}>
          <h2 style={{color: '#4338ca'}}>Результаты</h2>
          <div style={{marginBottom: '20px', padding: '15px', background: '#f0f9ff', borderRadius: '8px'}}>
            {activeTab === 'equation' ? (
              <><strong>Корень:</strong> {result.result?.toFixed(10)}</>
            ) : (
              <><strong>Решение:</strong> x = , y =</>
            )}
            <br/><strong>Итераций:</strong> {result.iterations}
          </div>

          <h3>Таблица итераций</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>k</th>
                  <th style={styles.th}>{activeTab === 'equation' ? 'x_k' : 'x_k'}</th>
                  {activeTab === 'system' && <th style={styles.th}>y_k</th>}
                  <th style={styles.th}>{activeTab === 'equation' ? 'f(x_k)' : 'Δx'}</th>
                  <th style={styles.th}>{activeTab === 'equation' ? '|x_k - x_{k-1}|' : 'Δy'}</th>
                </tr>
              </thead>
              <tbody>
                {result.steps.map((step, idx) => (
                  <tr key={idx}>
                    <td style={styles.td}>{step.k}</td>
                    <td style={styles.td}>{step.x.toFixed(10)}</td>
                    {activeTab === 'system' && <td style={styles.td}>{step.y.toFixed(10)}</td>}
                    <td style={styles.td}>{activeTab === 'equation' ? step.f_x.toFixed(10) : step.delta_x.toFixed(10)}</td>
                    <td style={styles.td}>{activeTab === 'equation' ? step.delta.toFixed(10) : step.delta_y.toFixed(10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

export default App;