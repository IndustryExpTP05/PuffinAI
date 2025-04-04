// src/components/Header.jsx
import { Link } from 'react-router-dom';
import './Header.css'; // 可选：放样式

export const Header = () => {
  return (
    <nav style={{ backgroundColor: '#94a98c', padding: '10px' }}>
      <ul style={{ display: 'flex', justifyContent: 'center', listStyle: 'none', gap: '30px', margin: 0 }}>
        <li><Link to="/" style={{ textDecoration: 'none', fontWeight: 'bold' }}>HOME</Link></li>
        <li><Link to="/allergyplant" style={{ textDecoration: 'none', fontWeight: 'bold' }}>ALLERGY PLANT</Link></li>
        <li><Link to="/map" style={{ textDecoration: 'none', fontWeight: 'bold' }}>LIVE MAP</Link></li>
        <li><Link to="/learn" style={{ textDecoration: 'none', fontWeight: 'bold' }}>LEARN VISUALLY</Link></li>
      </ul>
    </nav>
  );
};
