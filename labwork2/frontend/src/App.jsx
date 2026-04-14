import React, { useState } from 'react';
import axios from 'axios';
import { styles } from './styles';
import { EquationForm } from './components/EquationForm';
import { SystemForm } from './components/SystemForm';
import { ResultDisplay } from './components/ResultDisplay';
import { EquationPlot } from './components/EquationPlot';
import { SystemPlot } from './components/SystemPlot';

function App() {
  const [activeTab, setActiveTab] = useState('equation');
  const [eqData, setEqData] = useState({ equation_id: 1, method: 'chord', a: -2, b: 1, epsilon: 0.01 });
  const [sysData, setSysData] = useState({ system_id: 1, x0: 0, y0: 0, epsilon: 0.01 });

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

  return (
    <div style={styles.container}>
      <header style={styles.authorInfo}>
        <strong>Михайлов Петр Сергеевич</strong><br/>
        Группа P3211 | Вариант 9
      </header>

      <h1 style={{textAlign: 'center', color: '#1e293b'}}>Лабораторная работа №2</h1>

      <div style={{ display: 'flex', marginTop: '20px' }}>
        <button 
          style={styles.tabButton(activeTab === 'equation')} 
          onClick={() => {setActiveTab('equation'); setResult(null);}}
        >
          Уравнение
        </button>
        <button 
          style={styles.tabButton(activeTab === 'system')} 
          onClick={() => {setActiveTab('system'); setResult(null);}}
        >
          Система (МПИ)
        </button>
      </div>

      <section style={{ ...styles.section, borderRadius: '0 12px 12px 12px' }}>
        {activeTab === 'equation' ? (
          <>
            <EquationForm 
              data={eqData} 
              setData={(newData) => {
                setEqData(newData);
                setResult(null);
                setError(null);
              }} 
            />
            <div style={{marginTop: '20px'}}>
              <EquationPlot eqData={eqData} />
            </div>
          </>
        ) : (
          <>
            <SystemForm 
              data={sysData} 
              setData={(newData) => {
                setSysData(newData);
                setResult(null);
                setError(null);
              }} 
            />
            <SystemPlot sysData={sysData} result={result} />
          </>
        )}

        <div style={{marginTop: '30px', textAlign: 'center'}}>
          <button style={styles.button} onClick={solve} disabled={loading}>
            {loading ? 'Вычисляем...' : 'Рассчитать'}
          </button>
        </div>
      </section>

      {error && (
        <div style={{color: '#b91c1c', backgroundColor: '#fef2f2', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #fee2e2'}}>
          <strong>Ошибка:</strong> {error}
        </div>
      )}

      <ResultDisplay result={result} activeTab={activeTab} />
    </div>
  );
}

export default App;