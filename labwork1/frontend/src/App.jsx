import { useState, useRef } from 'react';
import axios from 'axios';

function App() {
  const [n, setN] = useState(3);
  const [matrixA, setMatrixA] = useState(Array(3).fill(0).map(() => Array(3).fill(0)));
  const [vectorB, setVectorB] = useState(Array(3).fill(0));
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const fileInputRef = useRef(null);

  const formatNum = (num) => {
    if (num === null || num === undefined) return "";
    const n = Number(num);
    return n.toString();
  };

  const handleNChange = (newN) => {
    const value = Math.min(20, Math.max(1, parseInt(newN) || 1));
    setN(value);
    setMatrixA(Array(value).fill(0).map(() => Array(value).fill(0)));
    setVectorB(Array(value).fill(0));
    setResult(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target.result.trim();
        const lines = content.split('\n').map(line => line.trim().split(/\s+/));
        
        const newN = parseInt(lines[0][0]);
        if (isNaN(newN) || newN < 1 || newN > 20) throw new Error("Неверный формат n (1-20)");

        const newA = [];
        const newB = [];

        for (let i = 0; i < newN; i++) {
          const row = lines[i + 1].map(Number);
          if (row.length < newN + 1) throw new Error(`В строке ${i + 1} недостаточно данных`);
          newA.push(row.slice(0, newN));
          newB.push(row[newN]);
        }

        setN(newN);
        setMatrixA(newA);
        setVectorB(newB);
        setResult(null);
        setError(null);
      } catch (err) {
        setError("Ошибка в файле: " + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  const handleMatrixChange = (row, col, value) => {
    const newMatrix = matrixA.map((r, i) =>
      i === row ? r.map((cell, j) => (j === col ? parseFloat(value) || 0 : cell)) : r
    );
    setMatrixA(newMatrix);
  };

  const handleVectorChange = (index, value) => {
    const newVector = vectorB.map((val, i) => (i === index ? parseFloat(value) || 0 : val));
    setVectorB(newVector);
  };

  const solve = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/solve', {
        n,
        matrix_a: matrixA,
        vector_b: vectorB
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Ошибка соединения с сервером");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: { maxWidth: '1100px', margin: '0 auto', padding: '40px 20px', fontFamily: '"Inter", "Segoe UI", sans-serif', color: '#1e293b', backgroundColor: '#f8fafc', minHeight: '100vh' },
    header: { textAlign: 'center', marginBottom: '40px' },
    title: { fontSize: '2.5rem', color: '#1e1b4b', marginBottom: '10px' },
    authorInfo: { textAlign: 'right', fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5', borderRight: '4px solid #6366f1', paddingRight: '15px', marginBottom: '30px' },
    section: { backgroundColor: '#ffffff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', marginBottom: '30px' },
    input: { padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', textAlign: 'center', color: '#334155' },
    button: { padding: '12px 24px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: 'background 0.2s', marginRight: '10px' },
    secondaryButton: { padding: '12px 24px', backgroundColor: '#64748b', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
    resCard: { padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' },
    table: { borderCollapse: 'collapse', width: '100%', marginTop: '10px' },
    td: { border: '1px solid #e2e8f0', padding: '8px', textAlign: 'center', fontSize: '0.9rem' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.authorInfo}>
        <div style={{fontWeight: 'bold', color: '#4338ca'}}>Михайлов Петр Сергеевич</div>
        <div>Группа: P3211</div>
        <div>Вариант: 11</div>
      </div>

      <header style={styles.header}>
        <h1 style={styles.title}>Метод Гаусса: Решение СЛАУ</h1>
        <p style={{color: '#64748b'}}>Лабораторная работа №1 по вычислительной математике</p>
      </header>

      <section style={styles.section}>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <label style={{ fontWeight: '600' }}>Размерность (n): </label>
            <input 
              type="number" 
              value={n} 
              onChange={(e) => handleNChange(e.target.value)}
              style={{ ...styles.input, width: '70px', fontSize: '1rem' }}
            />
          </div>
          
          <div>
            <input 
              type="file" 
              accept=".txt" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileUpload} 
            />
            <button 
              onClick={() => fileInputRef.current.click()} 
              style={styles.secondaryButton}
            >
            Загрузить из файла
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '50px', overflowX: 'auto', paddingBottom: '20px' }}>
          <div>
            <h4 style={{marginBottom: '10px', color: '#475569'}}>Матрица коэффициентов A</h4>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${n}, 70px)`, gap: '8px' }}>
              {matrixA.map((row, i) => 
                row.map((cell, j) => (
                  <input 
                    key={`a-${i}-${j}`}
                    type="number" 
                    step="any"
                    value={cell}
                    onChange={(e) => handleMatrixChange(i, j, e.target.value)}
                    style={{ ...styles.input, width: '70px' }}
                  />
                ))
              )}
            </div>
          </div>

          <div>
            <h4 style={{marginBottom: '10px', color: '#475569'}}>Вектор B</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {vectorB.map((val, i) => (
                <input 
                  key={`b-${i}`}
                  type="number" 
                  step="any"
                  value={val}
                  onChange={(e) => handleVectorChange(i, e.target.value)}
                  style={{ ...styles.input, width: '70px' }}
                />
              ))}
            </div>
          </div>
        </div>

        <button 
          onClick={solve} 
          disabled={loading}
          style={styles.button}
          onMouseOver={(e) => e.target.style.backgroundColor = '#4338ca'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#4f46e5'}
        >
          {loading ? 'Вычисляем...' : 'Рассчитать решение'}
        </button>
      </section>

      {error && (
        <div style={{ padding: '15px', backgroundColor: '#fef2f2', color: '#b91c1c', borderRadius: '8px', border: '1px solid #fecaca', marginBottom: '20px' }}>
          <strong>Ошибка:</strong> {error}
        </div>
      )}

      {result && (
        <div style={styles.section}>
          <h2 style={{ marginBottom: '25px', color: '#1e1b4b', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>Результаты вычислений</h2>
          
          <div style={{ marginBottom: '30px' }}>
            <h4 style={{ color: '#4f46e5' }}>1. Треугольный вид (Прямой ход Гаусса)</h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <tbody>
                  {result.method_results.triangular_matrix.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j} style={{ ...styles.td, backgroundColor: j === n ? '#f0fdf4' : 'transparent', fontWeight: j === n ? '600' : 'normal' }}>
                          {formatNum(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p style={{fontSize: '0.85rem', color: '#64748b', marginTop: '10px'}}>* Последний столбец выделен цветом — это преобразованный вектор B.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
            <div style={{ ...styles.resCard, backgroundColor: '#fff' }}>
              <h4 style={{ color: '#4f46e5', marginTop: 0 }}>2. Метод Гаусса</h4>
              <p><strong>Определитель:</strong> <span style={{color: '#059669'}}>{formatNum(result.method_results.determinant)}</span></p>
              
              <div style={{ marginTop: '15px' }}>
                <strong>Вектор неизвестных (X):</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '5px' }}>
                  {result.method_results.solution.map((x, i) => (
                    <span key={i} style={{ padding: '4px 10px', backgroundColor: '#eef2ff', borderRadius: '4px', fontSize: '0.9rem' }}>
                      x<sub>{i+1}</sub> = {formatNum(x)}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '15px' }}>
                <strong>Вектор невязок (R):</strong>
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic', marginTop: '5px' }}>
                  {result.method_results.residuals.map((r, i) => (
                    <div key={i}>r<sub>{i+1}</sub> = {formatNum(r)}</div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ ...styles.resCard, backgroundColor: '#f8fafc' }}>
              <h4 style={{ color: '#475569', marginTop: 0 }}>3. Библиотека NumPy</h4>
              <p><strong>Определитель:</strong> {formatNum(result.library_results.determinant)}</p>
              <div style={{ marginTop: '15px' }}>
                <strong>Решение NumPy:</strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '5px' }}>
                  {result.library_results.solution.map((x, i) => (
                    <div key={i} style={{ fontSize: '0.9rem' }}>x<sub>{i+1}</sub> = {formatNum(x)}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;