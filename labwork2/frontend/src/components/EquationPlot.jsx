import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';

export const EquationPlot = ({ eqData }) => {
    const [plotData, setPlotData] = useState([]);
    const { equation_id, a, b } = eqData;

    useEffect(() => {
        const fetchPlotData = async () => {
            if (isNaN(a) || isNaN(b) || a >= b) return;
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/equations/plot`, {
                    params: { equation_id, a, b }
                });
                setPlotData(response.data.data);
            } catch (err) {
                console.error("Ошибка загрузки графика", err);
            }
        };

        const timeoutId = setTimeout(() => fetchPlotData(), 300);
        return () => clearTimeout(timeoutId);
    }, [equation_id, a, b]);

    if (!plotData || plotData.length === 0) return null;

    return (
        <div style={{ width: '100%', height: 350, backgroundColor: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h4 style={{margin: '0 0 10px 0', color: '#64748b'}}>Визуализация функции</h4>
            <ResponsiveContainer>
                <LineChart data={plotData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="x" type="number" domain={['auto', 'auto']} tick={{fontSize: 12}} />
                    <YAxis domain={['auto', 'auto']} tick={{fontSize: 12}} />
                    <Tooltip labelFormatter={(val) => `x: ${val.toFixed(4)}`} />
                    <ReferenceLine y={0} stroke="#475569" strokeWidth={1.5} />
                    <ReferenceLine x={0} stroke="#475569" strokeWidth={1.5} />
                    <ReferenceLine x={Number(a)} stroke="#ef4444" strokeDasharray="5 5" label="a" />
                    <ReferenceLine x={Number(b)} stroke="#ef4444" strokeDasharray="5 5" label="b" />
                    <Line type="monotone" dataKey="y" stroke="#6366f1" dot={false} strokeWidth={2.5} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};