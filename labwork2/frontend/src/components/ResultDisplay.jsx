import { styles } from '../styles';

export const ResultDisplay = ({ result, activeTab }) => {
  if (!result) return null;

  return (
    <section style={styles.section}>
      <h2 style={{color: '#4338ca'}}>Результаты</h2>
      
      {/* Отображаем предупреждение или ошибку из бэкенда */}
      {result.error && (
        <div style={{
          color: '#854d0e', 
          background: '#fefce8', 
          padding: '15px', 
          borderRadius: '8px', 
          marginBottom: '20px', 
          border: '1px solid #fef08a'
        }}>
          <strong>Внимание:</strong> {result.error}
        </div>
      )}

      {/* Выводим итоговое значение, если оно найдено */}
      {result.success ? (
        <div style={{marginBottom: '20px', padding: '15px', background: '#f0f9ff', borderRadius: '8px'}}>
          {activeTab === 'equation' ? (
            <><strong>Корень:</strong> {result.result?.toFixed(10)}</>
          ) : (
            <><strong>Решение:</strong> x = {result.x?.toFixed(10)}, y = {result.y?.toFixed(10)}</>
          )}
          <br/><strong>Итераций:</strong> {result.iterations}
        </div>
      ) : (
        result.steps?.length > 0 && (
          <div style={{marginBottom: '20px', color: '#b91c1c'}}>
            Метод не сошелся за отведенное число итераций или возникла ошибка в процессе.
          </div>
        )
      )}

      {/* Таблицу показываем всегда, если в ней есть данные */}
      {result.steps?.length > 0 && (
        <>
          <h3>Таблица итераций</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>k</th>
                  <th style={styles.th}>x_k</th>
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
                    {activeTab === 'system' && <td style={styles.td}>{step.y?.toFixed(10)}</td>}
                    <td style={styles.td}>
                      {activeTab === 'equation' ? step.f_x?.toFixed(10) : step.delta_x?.toFixed(10)}
                    </td>
                    <td style={styles.td}>
                      {activeTab === 'equation' ? step.delta?.toFixed(10) : step.delta_y?.toFixed(10)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
};