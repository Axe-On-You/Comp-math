import React from 'react';

export const ResultDisplay = ({ result }) => {
    if (!result) return null;

    return (
        <div style={{
            marginTop: '20px', 
            padding: '20px', 
            backgroundColor: '#f0fdf4', 
            border: '1px solid #bbf7d0', 
            borderRadius: '8px',
            color: '#166534'
        }}>
            <h3 style={{ marginTop: 0 }}>Результаты вычислений</h3>
            <p style={{ fontSize: '18px' }}><strong>Значение интеграла (I):</strong> {result.result.toFixed(6)}</p>
            <p><strong>Число разбиений (n):</strong> {result.n}</p>
            <p><strong>Погрешность (по Рунге):</strong> {result.error.toExponential(4)}</p>
        </div>
    );
};