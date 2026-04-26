import React, { useState } from 'react';
import axios from 'axios';
import { styles } from './styles';
import { IntegrationForm } from './components/IntegrationForm';
import { IntegrationPlot } from './components/IntegrationPlot';
import { ResultDisplay } from './components/ResultDisplay';

function App() {
  const [data, setData] = useState({ 
    function_id: 1,
    method: 'simpson', 
    a: 1, 
    b: 2, 
    epsilon: 0.01 
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const solve = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Отправляем POST запрос на бэкенд FastAPI
      const response = await axios.post('http://127.0.0.1:8000/api/integrate', data);
      setResult(response.data);
    } catch (err) {
        if (err.response && err.response.status === 422) {
            setError("Ошибка валидации: проверьте ID функции (должен быть от 1 до 5)");
        } else if (err.response && err.response.data && err.response.data.detail) {
            setError(err.response.data.detail);
        } else {
            setError('Ошибка соединения с сервером');
        }
    } finally {
        // Вот эта строчка спасет кнопку от вечного зависания
        setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.authorInfo}>
        <strong>Михайлов Петр Сергеевич</strong><br/>
        Группа P3211 | Вариант 9
      </header>

      <h1 style={{textAlign: 'center', color: '#1e293b'}}>Лабораторная работа №3. Численное интегрирование</h1>

      <section style={styles.section}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Форма ввода */}
          <IntegrationForm data={data} setData={(newData) => {
            setData(newData);
            setResult(null); // Сбрасываем результат при изменении параметров
            setError(null);
          }} />

          {/* График */}
          <IntegrationPlot result={result} />

        </div>

        {/* Кнопка расчета */}
        <div style={{marginTop: '30px', textAlign: 'center'}}>
          <button 
            style={{...styles.button, opacity: loading ? 0.7 : 1}} 
            onClick={solve} 
            disabled={loading}
          >
            {loading ? 'Вычисляем...' : 'Рассчитать интеграл'}
          </button>
        </div>
      </section>

      {/* Вывод ошибки */}
      {error && (
        <div style={{color: '#b91c1c', backgroundColor: '#fef2f2', padding: '15px', borderRadius: '8px', marginTop: '20px', border: '1px solid #fee2e2'}}>
          <strong>Ошибка:</strong> {error}
        </div>
      )}

      {/* Вывод результата */}
      <ResultDisplay result={result} />
    </div>
  );
}

export default App;