import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import Stack from '../components/Stack';

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
    species: 'Ryegrass',
    image: '/images/grass.jpg',
    pollenLevel: 'Very High',
    description: 'Perennial ryegrass, major allergy source',
    icon: '/icons/Perennial Rye-grass.png'
  },
  {
    species: 'She-oak',
    image: '/images/littoralis.jpg',
    pollenLevel: 'Medium',
    description: 'Coastal she-oak, limited pollen dispersion',
    icon: '/icons/Allocasuarina littoralis.png'
  }
];


export default function AllergyPlantPage() {
    const [allPlants, setAllPlants] = useState([]);
    const [selectedSuburb, setSelectedSuburb] = useState('');
    const [suburbList, setSuburbList] = useState([]);
    const [selectedPlant, setSelectedPlant] = useState(null); 

  
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
  
          const uniqueSuburbs = [...new Set(cleaned.map(p => p.suburb))].sort();
          setSuburbList(uniqueSuburbs);
        });
    }, []);

    const filteredMarkers = selectedSuburb
    ? allPlants.filter(p => p.suburb === selectedSuburb)
    : [];

  return (
    <div style={{ 
      display: 'flex',
      height: '100vh',
      width: '100%',
      padding: '10px',
      boxSizing: 'border-box'
    }}>
      {/* Map Section - 2/3 width */}
      <div style={{ flex: 2, marginRight: '10px', height: '100%' }}>
        <div style={{ marginBottom: '10px' }}>
          <label><strong>Filter by Suburb: </strong></label>
          <select
            value={selectedSuburb}
            onChange={(e) => setSelectedSuburb(e.target.value)}
            style={{ padding: '5px 10px' }}
          >
            <option value="">Select a suburb</option>
            {suburbList.map((s, i) => (
              <option key={i} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <MapContainer center={[-37.8136, 144.9631]} zoom={13} style={{ height: '55%', width: '100%' }}> 
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          {filteredMarkers.map((item, index) => (
            <Marker
              key={index}
              position={[item.lat, item.lng]}
              icon={iconMap[item.species] || iconMap['Platanus']}
            >
              <Popup minWidth={250}>
                <div>
                  <strong>Species:</strong> {item.species} <br />
                  <strong>Suburb:</strong> {item.suburb} <br />
                  <Stack direction="horizontal" gap="8px" wrap>
                    {(speciesImages[item.species] || []).map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`${item.species}-${i}`}
                        style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '6px' }}
                      />
                    ))}
                  </Stack>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* 右边改这里 */}
      <div style={{ 
        flex: 1,
        padding: '15px',
        height: '450px',
        backgroundColor: '#f3faf0',
        borderRadius: '8px',
        overflowY: 'auto'
      }}>
        <h3 style={{ marginBottom: '20px', color: '#213622' }}>Major Allergy Plants</h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '15px'
        }}>
          {plantInfo.map((plant, index) => (
            <div 
              key={index}
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '10px',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s',
                ':hover': {
                  transform: 'translateY(-2px)'
                }
              }}
              onClick={() => setSelectedPlant(plant)}
            >
              <img 
                src={plant.image}
                alt={plant.species}
                style={{
                  width: '100%',
                  height: '120px',
                  objectFit: 'cover',
                  borderRadius: '4px'
                }}
              />
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '8px'
              }}>
                <img 
                  src={plant.icon}
                  alt="icon"
                  style={{ width: '24px', height: '24px', marginRight: '8px' }}
                />
                <span style={{ fontWeight: '500' }}>{plant.species}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Popup Modal */}
        {selectedPlant && (
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#f4f5d5',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            zIndex: 1000,
            maxWidth: '400px'
          }}>
            <h3>{selectedPlant.species}</h3>
            <p><strong>Pollen Level:</strong> {selectedPlant.pollenLevel}</p>
            <p><strong>Description:</strong> {selectedPlant.description}</p>
            <button 
              onClick={() => setSelectedPlant(null)}
              style={{
                marginTop: '15px',
                padding: '8px 16px',
                backgroundColor: '#2cb835',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}