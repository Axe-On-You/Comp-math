import React from 'react';
import { styles } from '../styles';

export const IntegrationForm = ({ data, setData }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: name === 'function_id' ? parseInt(value) : 
                    name === 'method' ? value : 
                    value === '' ? '' : parseFloat(value)
        });
    };

    return (
        <div>
            <h3 style={{marginBottom: '15px', color: '#1e293b'}}>Настройки интегрирования</h3>
            
            <div style={{ marginBottom: '15px' }}>
                <label style={styles.label}>Функция:</label>
                <select name="function_id" value={data.function_id} onChange={handleChange} style={styles.input}>
                    <option value={1}>1. -x³ - x² - 2x + 1</option>
                    <option value={2}>2. sin(x) + cos(x)</option>
                    <option value={3}>3. 1/x</option>
                    <option value={4}>4. x² ln(x)</option>
                    <option value={5}>5. 2x³ - 3x² + 5x - 9</option>
                    <option value={6}>6. 1 / √|x|</option>
                    <option value={7}>7. 1 / x²</option>    
                    <option value={8}>8. 1 / √|x - 2|</option>
                </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label style={styles.label}>Метод интегрирования:</label>
                <select name="method" value={data.method} onChange={handleChange} style={styles.input}>
                    <option value="left">Метод левых прямоугольников</option>
                    <option value="right">Метод правых прямоугольников</option>
                    <option value="middle">Метод средних прямоугольников</option>
                    <option value="trapezoid">Метод трапеций</option>
                    <option value="simpson">Метод Симпсона</option>
                </select>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                    <label style={styles.label}>Нижний предел (a):</label>
                    <input type="number" step="any" name="a" value={data.a} onChange={handleChange} style={styles.input} />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={styles.label}>Верхний предел (b):</label>
                    <input type="number" step="any" name="b" value={data.b} onChange={handleChange} style={styles.input} />
                </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label style={styles.label}>Точность (ε):</label>
                <input type="number" step="any" name="epsilon" value={data.epsilon} onChange={handleChange} style={styles.input} />
            </div>
        </div>
    );
};