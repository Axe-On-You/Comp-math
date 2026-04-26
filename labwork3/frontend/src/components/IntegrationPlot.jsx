import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine } from 'recharts';

export const IntegrationPlot = ({ result }) => {
    if (!result || !result.graph_points) {
        return (
            <div style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                <p style={{ color: '#64748b' }}>Нажмите "Рассчитать", чтобы увидеть график функции</p>
            </div>
        );
    }

    return (
        <div style={{ height: '350px', width: '100%' }}>
            <h4 style={{ textAlign: 'center', color: '#334155', margin: '0 0 15px 0' }}>График подынтегральной функции</h4>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={result.graph_points} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                    <XAxis dataKey="x" type="number" domain={['dataMin', 'dataMax']} tickCount={10} />
                    <YAxis />
                    <Tooltip formatter={(value) => value.toFixed(4)} labelFormatter={(label) => `x: ${parseFloat(label).toFixed(4)}`} />
                    <ReferenceLine y={0} stroke="#000" /> {/* Ось X */}
                    <Area 
                        type="monotone" 
                        dataKey="y" 
                        stroke="#3b82f6" 
                        fill="#93c5fd" 
                        fillOpacity={0.5} 
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};