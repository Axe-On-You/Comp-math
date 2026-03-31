import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';

export const EquationPlot = ({ eqData }) => {
    const [plotData, setPlotData] = useState([]);
    const { equation_id, a, b } = eqData;

    useEffect(() => {
        const fetchPlotData = async () => {
            // Защита от пустых значений или некорректных границ
            if (isNaN(a) || isNaN(b) || a >= b) return;
            
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/equations/plot`, {
                    params: { equation_id, a, b }
                });
                setPlotData(response.data.data);
            } catch (err) {
                console.error("Ошибка при загрузке точек графика", err);
            }
        };

        // Небольшая задержка, чтобы не спамить запросами пока пользователь печатает число
        const timeoutId = setTimeout(() => fetchPlotData(), 300);
        return () => clearTimeout(timeoutId);
    }, [equation_id, a, b]);

    if (!plotData || plotData.length === 0) return null;

    return (
        <div style={{ width: '100%', height: 350, backgroundColor: '#fff', padding: '10px', borderRadius: '8px', marginTop: '20px', border: '1px solid #e2e8f0' }}>
            <ResponsiveContainer>
                <LineChart data={plotData} margin={{ top: 15, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="x" 
                        type="number" 
                        domain={['auto', 'auto']} 
                        tickFormatter={(val) => val.toFixed(1)} 
                    />
                    <YAxis domain={['auto', 'auto']} />
                    <Tooltip labelFormatter={(val) => `x: ${val}`} />
                    
                    {/* Оси координат */}
                    <ReferenceLine y={0} stroke="#000" strokeWidth={1.5} />
                    <ReferenceLine x={0} stroke="#000" strokeWidth={1.5} />

                    {/* Границы интервала */}
                    <ReferenceLine x={Number(a)} stroke="#ff4d4f" strokeDasharray="3 3" label={{ value: 'a', position: 'top' }} />
                    <ReferenceLine x={Number(b)} stroke="#ff4d4f" strokeDasharray="3 3" label={{ value: 'b', position: 'top' }} />

                    <Line 
                        type="monotone" 
                        dataKey="y" 
                        stroke="#1890ff" 
                        dot={false} 
                        strokeWidth={2} 
                        animationDuration={300}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};