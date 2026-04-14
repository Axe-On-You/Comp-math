import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';

export const SystemPlot = ({ sysData, result }) => {
    // Изначально ставим 'auto', но будем перехватывать это при рендере
    const [plotData, setPlotData] = useState({ line1: [], line2:[], domain_x: ['auto', 'auto'], domain_y: ['auto', 'auto'] });
    const { system_id, x0, y0 } = sysData;

    useEffect(() => {
        const fetchPlotData = async () => {
            try {
                const centerX = result?.success ? result.x : (x0 || 0);
                const centerY = result?.success ? result.y : (y0 || 0);

                const response = await axios.get(`http://127.0.0.1:8000/api/systems/plot`, {
                    params: { system_id, x_center: centerX, y_center: centerY, range_val: 2.5 }
                });
                
                if (response.data.error) {
                    console.error("Бэкенд вернул ошибку при построении графика:", response.data.error);
                } else {
                    setPlotData(response.data);
                }
            } catch (err) {
                console.error("Сетевая ошибка загрузки графика системы", err);
            }
        };

        const timeoutId = setTimeout(fetchPlotData, 800);
        return () => clearTimeout(timeoutId);
    },[system_id, x0, y0, result]);

    const centerX = result?.success ? result.x : (x0 || 0);
    const centerY = result?.success ? result.y : (y0 || 0);
    
    const currentDomainX = plotData.domain_x[0] !== 'auto' ? plotData.domain_x :[centerX - 2.5, centerX + 2.5];
    const currentDomainY = plotData.domain_y[0] !== 'auto' ? plotData.domain_y : [centerY - 2.5, centerY + 2.5];

    return (
        <div style={{ width: '100%', height: 450, backgroundColor: '#fff', padding: '15px', borderRadius: '12px', marginTop: '20px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#64748b', textAlign: 'center' }}>Графическое отделение корней</h4>
            
            <ResponsiveContainer width="100%" height="85%">
                <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    
                    {/* Используем защищенные домены */}
                    <XAxis type="number" dataKey="x" name="X" domain={currentDomainX} tick={{fontSize: 12}} allowDataOverflow />
                    <YAxis type="number" dataKey="y" name="Y" domain={currentDomainY} tick={{fontSize: 12}} allowDataOverflow />
                    
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <ReferenceLine x={0} stroke="#475569" strokeWidth={1.5} />
                    <ReferenceLine y={0} stroke="#475569" strokeWidth={1.5} />

                    {plotData.line1 && plotData.line1.map((path, i) => (
                        <Scatter 
                            key={`l1-${i}`} 
                            data={path} 
                            line={{ stroke: '#6366f1', strokeWidth: 2 }} 
                            shape={() => null} 
                            isAnimationActive={false} 
                        />
                    ))}

                    {plotData.line2 && plotData.line2.map((path, i) => (
                        <Scatter 
                            key={`l2-${i}`} 
                            data={path} 
                            line={{ stroke: '#10b981', strokeWidth: 2 }} 
                            shape={() => null} 
                            isAnimationActive={false} 
                        />
                    ))}

                    {!result?.success && !isNaN(x0) && !isNaN(y0) && (
                        <Scatter name="Начальное приближение" data={[{ x: x0, y: y0 }]} fill="#f59e0b" shape="circle" isAnimationActive={false} />
                    )}

                    {result?.success && (
                        <Scatter name="Решение" data={[{ x: result.x, y: result.y }]} fill="#ef4444" shape="star" isAnimationActive={false} />
                    )}
                </ScatterChart>
            </ResponsiveContainer>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '0.85rem', marginTop: '10px' }}>
                {system_id === 1 ? (
                    <>
                        <div><span style={{ color: '#6366f1', fontWeight: 'bold' }}>—</span> tg(x*y + 0.2) = x²</div>
                        <div><span style={{ color: '#10b981', fontWeight: 'bold' }}>—</span> x² + 2y² = 1</div>
                    </>
                ) : (
                    <>
                        <div><span style={{ color: '#6366f1', fontWeight: 'bold' }}>—</span> sin(y - 1) + x = 1.3</div>
                        <div><span style={{ color: '#10b981', fontWeight: 'bold' }}>—</span> y - sin(x + 1) = 0.8</div>
                    </>
                )}
            </div>
        </div>
    );
};