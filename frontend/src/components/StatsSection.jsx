import React from 'react';
import CountUp from 'react-countup';

export default function StatsSection({ markers }) {
  // 高风险等级定义
  const highRiskLevels = ['High', 'Very High'];

  // 统计逻辑
  const highRiskMarkers = markers.filter(m => {
    const info = getPlantInfo(m.species);
    return highRiskLevels.includes(info?.pollenLevel);
  });

  const uniqueHighRiskSpecies = [...new Set(highRiskMarkers.map(m => m.species))];

  return (
    <div style={{ 
        display: 'flex', 
        justifyContent: 'space-around', 
        marginTop: '30px', 
        padding: '20px', 
        background: '#ffffff', 
        borderRadius: '10px',
        width: '200%'
    }}>
      <StatCard label="High Risk Plants" value={highRiskMarkers.length} />
      <StatCard label="High Risk Species" value={uniqueHighRiskSpecies.length} />
      <StatCard label="Total spread pollen plants" value={markers.length} />
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '36px', color: '#4caf50', fontWeight: 'bold' }}>
        <CountUp end={value} duration={1.5} />
      </div>
      <div style={{ fontSize: '16px', marginTop: '5px' }}>{label}</div>
    </div>
  );
}

// 你可以从 plantInfo 获取 pollenLevel
import { plantInfo } from '../views/Allergyplantpage.jsx'; // 如果不方便export建议你复制pollenLevel信息出来

function getPlantInfo(species) {
  return plantInfo.find(p => p.species === species || p.species.includes(species));
}
