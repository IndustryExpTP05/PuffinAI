import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import Stack from '../components/Stack';
import { useMap } from 'react-leaflet';
import CountUp from 'react-countup';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

// 添加渐变动画样式
const gradientAnimationStyle = `
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

// 添加样式到文档
const styleSheet = document.createElement("style");
styleSheet.innerText = gradientAnimationStyle;
document.head.appendChild(styleSheet);

function FlyToCenter({ center }) {
    const map = useMap();
  
    useEffect(() => {
      if (center) {
        map.flyTo(center, map.getZoom(), { duration: 1 });
      }
    }, [center, map]);
  
    return null;
  }
  
// Icon configurations
const iconMap = {
    'Platanus': new L.Icon({
      iconUrl: '/icons/Platanus.png', iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32]
    }),
    'Betulaceae': new L.Icon({
      iconUrl: '/icons/Betulaceae.png', iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32]
    }),
    'Perennial Rye-grass': new L.Icon({
      iconUrl: '/icons/Perennial Rye-grass.png', iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32]
    }),
    'Allocasuarina littoralis': new L.Icon({
      iconUrl: '/icons/Allocasuarina littoralis.png', iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32]
    })
  };
  
const speciesImages = {
    'Platanus': [
      '/images/platanus1.jpg',
      '/images/platanus2.jpg',
      '/images/platanus3.jpg'
    ],
    'Betulaceae': [
      '/images/betulaceae1.jpg',
      '/images/betulaceae2.jpg',
      '/images/betulaceae3.jpg'
    ],
    'Perennial Rye-grass': [
      '/images/grass1.jpg',
      '/images/grass2.jpg',
      '/images/grass3.jpg'
    ],
    'Allocasuarina littoralis': [
      '/images/littoralis1.jpg',
      '/images/littoralis2.jpg',
      '/images/littoralis3.jpg'
    ]
  };
  
// Plant information data
const plantInfo = [
  {
    species: 'Platanus',
    image: '/images/platanus.jpg',
    pollenLevel: 'High',
    description: 'Common urban tree with high spring pollen production',
    icon: '/icons/Platanus.png'
  },
  {
    species: 'Betulaceae',
    image: '/images/betulaceae.jpg',
    pollenLevel: 'Medium',
    description: 'Birch family plants, known for allergy-inducing pollen',
    icon: '/icons/Betulaceae.png'
  },
  {
    species: 'Perennial Rye-grass',
    image: '/images/grass.jpg',
    pollenLevel: 'Very High',
    description: 'Perennial ryegrass, major allergy source',
    icon: '/icons/Perennial Rye-grass.png'
  },
  {
    species: 'Allocasuarina littoralis',
    image: '/images/littoralis.jpg',
    pollenLevel: 'Medium',
    description: 'Coastal she-oak, limited pollen dispersion',
    icon: '/icons/Allocasuarina littoralis.png'
  }
];

const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`,
        {
          headers: {
            'User-Agent': 'YourAppName/1.0 (contact@yourdomain.com)'
          }
        }
      );
      const data = await response.json();
      return data.address?.suburb || data.address?.city_district || 'Unknown';
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  };


  function StatsSection({ markers }) {
    const highRiskLevels = ['High', 'Very High'];
    const highRiskMarkers = markers.filter(m => highRiskLevels.includes(getPollenLevel(m.species)));
    const MidRiskLevels = ['Medium'];
    const MidRiskMarkers = markers.filter(m => MidRiskLevels.includes(getPollenLevel(m.species)));
    
    // 计算高风险花粉百分比
    const highRiskPercentage = markers.length > 0 
      ? Math.round((highRiskMarkers.length / markers.length) * 100) 
      : 0;
    
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px', padding: '20px', background: '#f4f7f2', borderRadius: '10px' }}>
          <StatCard label="🚫High Risk Plants" value={highRiskMarkers.length} />
          <StatCard label="⚠️Medium Risk Plants" value={MidRiskMarkers.length} />
          <StatCard label="🌱Total Allergenic Plants" value={markers.length} />
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          marginTop: '30px', 
          padding: '20px', 
          background: '#fff', 
          borderRadius: '10px',
        }}>
          <div style={{ width: '200px', marginRight: '30px' }}>
            <CircularProgressbar
              value={highRiskPercentage}
              text={`${highRiskPercentage}%`}
              styles={buildStyles({
                pathColor: highRiskPercentage > 70 ? '#ff4d4d' : highRiskPercentage > 40 ? '#ffa64d' : '#4caf50',
                textColor: '#333',
                trailColor: '#d6d6d6',
                textSize: '16px',
              })}
            />
          </div>
          <div>
            <h3 style={{ color: '#333', marginBottom: '10px' }}>The proportion of high-risk pollen in Victoria</h3>
            <p style={{ color: '#666', maxWidth: '300px' }}>
              {highRiskPercentage > 70 
                ? '⚠️ At present, the risk of pollen in the region is high. Please take protective measures.' 
                : highRiskPercentage > 40 
                  ? '⚠️ At present, the risk of pollen in the region is medium. Please pay attention to protection.' 
                  : '✅ At present, the pollen risk in the region is low. You can rest assured.'}
            </p>
          </div>
        </div>

        {/* 添加建议提示板 */}
        <div style={{
          marginTop: '30px',
          padding: '25px',
          background: 'linear-gradient(135deg,rgb(161, 215, 201) 0%,rgb(174, 207, 240) 100%)',
          borderRadius: '15px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        }}>
          <h3 style={{
            color: '#2c3e50',
            fontSize: '1.5rem',
            marginBottom: '20px',
            textAlign: 'center',
            fontWeight: '600'
          }}>
            ______________________ What Should I Do? ______________________
          </h3>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            {/* 高风险建议 */}
            <div style={{
              flex: '1',
              minWidth: '250px',
              padding: '20px',
              background: '#fff5f5',
              borderRadius: '12px',
              border: '1px solid #ffe3e3'
            }}>
              <h4 style={{ color: '#e53e3e', marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '8px' }}>🚫</span> High Risk
              </h4>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0,
                margin: 0,
                color: '#4a5568'
              }}>
                <li style={{ marginBottom: '8px' }}>• Wear a mask when outdoors</li>
                <li style={{ marginBottom: '8px' }}>• Avoid outdoor activities</li>
                <li style={{ marginBottom: '8px' }}>• Use air purifiers indoors</li>
                <li style={{ marginBottom: '8px' }}>• Keep windows closed</li>
              </ul>
            </div>

            {/* 中风险建议 */}
            <div style={{
              flex: '1',
              minWidth: '250px',
              padding: '20px',
              background: '#fffaf0',
              borderRadius: '12px',
              border: '1px solid #feebc8'
            }}>
              <h4 style={{ color: '#d97706', marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '8px' }}>⚠️</span> Medium Risk
              </h4>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0,
                margin: 0,
                color: '#4a5568'
              }}>
                <li style={{ marginBottom: '8px' }}>• Monitor allergy symptoms</li>
                <li style={{ marginBottom: '8px' }}>• Carry medication with you</li>
                <li style={{ marginBottom: '8px' }}>• Change clothes after outdoor activities</li>
                <li style={{ marginBottom: '8px' }}>• Consider wearing sunglasses</li>
              </ul>
            </div>

            {/* 低风险建议 */}
            <div style={{
              flex: '1',
              minWidth: '250px',
              padding: '20px',
              background: '#f0fff4',
              borderRadius: '12px',
              border: '1px solid #c6f6d5'
            }}>
              <h4 style={{ color: '#38a169', marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '8px' }}>✅</span> Low Risk
              </h4>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0,
                margin: 0,
                color: '#4a5568'
              }}>
                <li style={{ marginBottom: '8px' }}>• Normal outdoor activities allowed</li>
                <li style={{ marginBottom: '8px' }}>• Stay informed about pollen levels</li>
                <li style={{ marginBottom: '8px' }}>• Keep basic allergy medication handy</li>
                <li style={{ marginBottom: '8px' }}>• Monitor local pollen forecasts</li>
              </ul>
            </div>
          </div>
        </div>
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
  
  function getPollenLevel(species) {
    const match = plantInfo.find(p => 
      p.species.toLowerCase() === species.toLowerCase() || 
      species.toLowerCase().includes(p.species.toLowerCase())
    );
    return match?.pollenLevel || 'Unknown';
  }

export default function AllergyPlantPage() {
    const [allPlants, setAllPlants] = useState([]);
    const [selectedSuburb, setSelectedSuburb] = useState('');
    const [suburbList, setSuburbList] = useState([]);
    const [selectedPlant, setSelectedPlant] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [mapCenter, setMapCenter] = useState([-37.8136, 144.9631]);
    const [searchInput, setSearchInput] = useState('');
    const [filteredSuburbs, setFilteredSuburbs] = useState([]);

    // 添加一个函数来获取当前 suburb 的植物
    const getCurrentSuburbPlants = () => {
        if (!selectedSuburb) return [];
        const suburbPlants = allPlants.filter(p => p.suburb === selectedSuburb);
        const uniqueSpecies = [...new Set(suburbPlants.map(p => p.species))];
        return plantInfo.filter(plant => uniqueSpecies.includes(plant.species));
    };

    useEffect(() => {
        fetch('/data/plant.json')
          .then(res => res.json())
          .then(data => {
            const cleaned = data.map(item => ({
              species: item.scientificName,
              lat: item.latitude,
              lng: item.longitude,
              suburb: item.suburb
            }));
            setAllPlants(cleaned);
            setSuburbList([...new Set(cleaned.map(p => p.suburb))].sort());
          });
      }, []);

      useEffect(() => {
        if (!selectedSuburb || allPlants.length === 0) return;
      
        const markersInSuburb = allPlants.filter(p => p.suburb === selectedSuburb);
        if (markersInSuburb.length === 0) return;
      
        const avgLat = markersInSuburb.reduce((sum, m) => sum + m.lat, 0) / markersInSuburb.length;
        const avgLng = markersInSuburb.reduce((sum, m) => sum + m.lng, 0) / markersInSuburb.length;
      
        setMapCenter([avgLat, avgLng]);
      }, [selectedSuburb, allPlants]);

      useEffect(() => {
        if (suburbList.length === 0) return;
      
        if (!navigator.geolocation) {
          console.log('Geolocation not supported');
          return;
        }
      
        const handleSuccess = async (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
          setUserLocation({ lat: latitude, lng: longitude });
      
          const suburb = await reverseGeocode(latitude, longitude);
          console.log('Detected suburb:', suburb);
          const matchedSuburb = suburbList.find(s => s.toLowerCase().includes(suburb.toLowerCase()));
            if (matchedSuburb) {
            setSelectedSuburb(matchedSuburb);
            } else {
            console.log('Suburb not found in list:', suburb);
            }

        };
      
        const handleError = (err) => {
          console.log('Location error:', err);
        };
      
        navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
      }, [suburbList]);
      
    const filteredMarkers = selectedSuburb
    ? allPlants.filter(p => p.suburb === selectedSuburb)
    : [];

    useEffect(() => {
        if (searchInput.trim() === '') {
            setFilteredSuburbs(suburbList);
            return;
        }
        const filtered = suburbList.filter(suburb => 
            suburb.toLowerCase().includes(searchInput.toLowerCase())
        );
        setFilteredSuburbs(filtered);
    }, [searchInput, suburbList]);

    return (
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          width: '100%',
          padding: '10px',
          boxSizing: 'border-box'
        }}>
          <div style={{
            background: 'linear-gradient(-45deg,rgb(72, 170, 72), #a6c1a6,rgb(147, 195, 58))',
            backgroundSize: '400% 400%',
            animation: 'gradientShift 10s ease infinite',
            color: 'white',
            padding: '30px',
            borderRadius: '10px',
            marginBottom: '20px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h1 style={{ 
              fontSize: '2.5rem', 
              marginBottom: '15px',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
            }}>
              Victoria Pollen Allergy Map
            </h1>
            <p style={{ 
              fontSize: '1.2rem', 
              maxWidth: '800px', 
              margin: '0 auto',
              lineHeight: '1.6',
              opacity: 0.9
            }}>
              Explore and monitor allergenic plants across Victoria. This interactive map helps you identify high-risk pollen areas, 
              track medium-risk zones, and understand the distribution of allergenic plants in your neighborhood. 
              Stay informed about potential allergy triggers and take necessary precautions.
            </p>
          </div>

          <div style={{ 
            display: 'flex', 
            flex: 1, 
            width: '100%', 
            marginBottom: '20px',
            minHeight: '500px'
          }}>
            <div style={{ 
              flex: 2, 
              marginRight: '10px', 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              minHeight: '500px'
            }}>
              <div style={{ marginBottom: '10px' }}>
                <label><strong>Search suburb: </strong></label>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Enter the suburb name..."
                    style={{ 
                      padding: '5px 10px',
                      width: '200px',
                      borderRadius: '4px',
                      border: '1px solid #ccc'
                    }}
                  />
                  {searchInput && filteredSuburbs.length > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      backgroundColor: 'white',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      maxHeight: '200px',
                      overflowY: 'auto',
                      zIndex: 1000
                    }}>
                      {filteredSuburbs.map((suburb, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            setSelectedSuburb(suburb);
                            setSearchInput(suburb);
                          }}
                          style={{
                            padding: '8px 10px',
                            cursor: 'pointer',
                            hover: { backgroundColor: '#f0f0f0' }
                          }}
                        >
                          {suburb}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <MapContainer 
                center={mapCenter} 
                zoom={13} 
                style={{ 
                  flex: 1, 
                  width: '100%',
                  minHeight: '450px',
                  borderRadius: '10px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <FlyToCenter center={mapCenter} />
                <TileLayer attribution='&copy; OpenStreetMap contributors' url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
                {userLocation && (<Marker position={[userLocation.lat, userLocation.lng]}><Popup>Your Location</Popup></Marker>)}
                {filteredMarkers.map((item, index) => (
                  <Marker key={index} position={[item.lat, item.lng]} icon={iconMap[item.species] || iconMap['Platanus']}>
                    <Popup minWidth={250}>
                      <div>
                        <strong>Species:</strong> {item.species} <br />
                        <strong>Suburb:</strong> {item.suburb} <br />
                        <Stack direction="horizontal" gap="8px" wrap>
                          {(speciesImages[item.species] || []).map((src, i) => (
                            <img key={i} src={src} alt={`${item.species}-${i}`} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '6px' }} />
                          ))}
                        </Stack>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
    
            <div style={{ 
              flex: 1, 
              padding: '15px', 
              backgroundColor: '#f3faf0', 
              borderRadius: '8px', 
              overflowY: 'auto', 
              height: '100%',
              minHeight: '500px'
            }}>
              <h3 style={{ marginBottom: '20px', color: '#213622' }}>
                {selectedSuburb ? `Major Allergy Plants in ${selectedSuburb}` : 'Select a suburb to view plants'}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                {getCurrentSuburbPlants().map((plant, index) => (
                  <div key={index} style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '8px', 
                    padding: '10px', 
                    cursor: 'pointer', 
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
                    transition: 'transform 0.2s',
                    opacity: selectedSuburb ? 1 : 0.5
                  }} onClick={() => setSelectedPlant(plant)}>
                    <img src={plant.image} alt={plant.species} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '4px' }} />
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                      <img src={plant.icon} alt="icon" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
                      <span style={{ fontWeight: '500' }}>{plant.species}</span>
                    </div>
                  </div>
                ))}
                {!selectedSuburb && (
                  <div style={{ 
                    gridColumn: '1 / -1', 
                    textAlign: 'center', 
                    padding: '20px',
                    color: '#666'
                  }}>
                    Please select a suburb to view the allergenic plants in that area
                  </div>
                )}
                {selectedSuburb && getCurrentSuburbPlants().length === 0 && (
                  <div style={{ 
                    gridColumn: '1 / -1', 
                    textAlign: 'center', 
                    padding: '20px',
                    color: '#666'
                  }}>
                    No allergenic plants found in this suburb
                  </div>
                )}
              </div>
    
              {selectedPlant && (
                <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#f4f5d5', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', zIndex: 1000, maxWidth: '400px' }}>
                  <h3>{selectedPlant.species}</h3>
                  <p><strong>Pollen Level:</strong> {selectedPlant.pollenLevel}</p>
                  <p><strong>Description:</strong> {selectedPlant.description}</p>
                  <button onClick={() => setSelectedPlant(null)} style={{ marginTop: '15px', padding: '8px 16px', backgroundColor: '#2cb835', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Close</button>
                </div>
              )}
            </div>
          </div>
    
          <div style={{ width: '100%', padding: '20px', backgroundColor: '#fff', boxShadow: '0 -2px 10px rgba(0,0,0,0.1)' }}>
            <StatsSection markers={filteredMarkers} />
          </div>
        </div>
      );
    }