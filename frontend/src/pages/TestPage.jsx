import React from 'react';
import PollenMap from '../components/PollenMap'; // Adjust the path if needed
// import ForecastTable from './ForecastTable'; // add other components here

const TestPage = () => {
  return (
    <div style={{ height: '100vh', width: '100vw', padding: '0', margin: '0' }}>
      {/* Drop test components below */}
      <PollenMap />
      {/* <ForecastTable /> */}
    </div>
  );
};

export default TestPage;
