import { useState } from 'react';
import axios from 'axios';
import { styles } from './styles';
import { EquationForm } from './components/EquationForm';
import { ResultDisplay } from './components/ResultDisplay';

function App() {
  const [activeTab, setActiveTab] = useState('equation');
  const [eqData, setEqData] = useState({ equation_id: 1, method: 'chord', a: -2, b: 1, epsilon: 0.01 });
  const [sysData, setSysData] = useState({ system_id: 1, x0: 0, y0: 0, epsilon: 0.01 });

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null); // Ошибки сети или сервера (400, 500)
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
      // Бэкенд возвращает 200 OK даже если корень не один, 
      // поэтому мы просто сохраняем весь объект результата
      setResult(response.data);
      
      // Если бэкенд пометил расчет как неудачный (например, нет корней)
      if (!response.data.success) {
        console.warn("Математическая ошибка:", response.data.error);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Ошибка соединения с сервером");
    } finally {
      setLoading(false);
    }
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
          <EquationForm data={eqData} setData={setEqData} />
        ) : (
          <div> {/* Здесь можно вынести SystemForm аналогично */}
            <strong>Система:</strong> tg(xy + 0.2) = x², x² + 2y² = 1
            <div style={{display: 'flex', gap: '10px', marginTop: '15px'}}>
              <input type="number" style={styles.input} value={sysData.x0} onChange={e => setSysData({...sysData, x0: parseFloat(e.target.value)})}/>
              <input type="number" style={styles.input} value={sysData.y0} onChange={e => setSysData({...sysData, y0: parseFloat(e.target.value)})}/>
            </div>
          </div>
        )}

        <div style={{marginTop: '30px'}}>
          <button style={styles.button} onClick={solve} disabled={loading}>
            {loading ? 'Вычисляем...' : 'Рассчитать'}
          </button>
        </div>
      </section>

      {/* Ошибки сервера/сети (красный блок) */}
      {error && <div style={{color: '#b91c1c', background: '#fef2f2', padding: '15px', borderRadius: '8px', marginBottom: '20px'}}>{error}</div>}

      <ResultDisplay result={result} activeTab={activeTab} />
    </div>
  );
}

export default App;