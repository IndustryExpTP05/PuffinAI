import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';

// 图标定义
const iconMap = {
  Platanus: new L.Icon({
    iconUrl: '/icons/Platanus.png', iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32] }),
  Betulaceae: new L.Icon({
    iconUrl: '/icons/Betulaceae.png', iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32] }),
  grass: new L.Icon({
    iconUrl: '/icons/grass.png', iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32] }),
  littoralis: new L.Icon({
    iconUrl: '/icons/littoralis.png', iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32] }),
};

export default function AllergyPlantPage() {
  const [markers, setMarkers] = useState([]);
  const [selectedSpecies, setSelectedSpecies] = useState('all');
  const [imageFile, setImageFile] = useState(null);
  const [organ, setOrgan] = useState('leaf');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const files = [
      { file: 'Platanus.json', speciesKey: 'Platanus' },
      { file: 'Betulaceae.json', speciesKey: 'Betulaceae' },
      { file: 'grass.json', speciesKey: 'grass' },
      { file: 'littoralis.json', speciesKey: 'littoralis' }
    ];

    Promise.all(
      files.map(({ file, speciesKey }) =>
        fetch(`/data/${file}`)
          .then((res) => res.json())
          .then((json) =>
            json.map((item) => ({
              species: speciesKey,
              lat: item.latitude || item.decimalLatitude,
              lng: item.longitude || item.decimalLongitude
            }))
          )
      )
    ).then((allMarkers) => {
      setMarkers(allMarkers.flat());
    });
  }, []);

  const filteredMarkers = selectedSpecies === 'all'
    ? markers
    : markers.filter(m => m.species === selectedSpecies);

const identifyPlant = async () => {
  if (!imageFile) return;
  setLoading(true);

  try {
    // 1. 读取 image 文件为 base64
    const toBase64 = (file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // 会包含 data:image/jpeg;base64,...
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

    const base64Image = await toBase64(imageFile);

    // 2. 构造 JSON payload
    const payload = {
      images: [base64Image],  // PlantNet 支持 base64 array
      organs: [organ]         // e.g., ["leaf"]
    };

    // 3. 请求你自己的中转 Lambda（不要直接请求 plantnet.org）
    const res = await fetch("https://your-api-gateway-endpoint/plantnet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    setResult(data);
  } catch (err) {
    console.error("Error identifying plant:", err);
    setResult(null);
  } finally {
    setLoading(false);
  }
};


  return (
    <div style={{ height: '100%', width: '100%' }}>
      <div style={{ padding: '10px', textAlign: 'center' }}>
        <label><strong>Filter by species: </strong></label>
        <select
          value={selectedSpecies}
          onChange={(e) => setSelectedSpecies(e.target.value)}
          style={{ padding: '5px 10px', marginLeft: '10px' }}
        >
          <option value="all">All</option>
          <option value="Platanus">Platanus</option>
          <option value="Betulaceae">Betulaceae</option>
          <option value="grass">Ryegrass</option>
          <option value="littoralis">Littoralis</option>
        </select>
      </div>

      <div style={{ height: '60vh', width: '280%', margin: '0 auto' }}>
        <MapContainer center={[-37.8136, 144.9631]} zoom={14} style={{ height: '60vh', width: '100%' }}>
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
              <Popup>
                <strong>Species:</strong> {item.species} <br />
                <strong>Lat:</strong> {item.lat.toFixed(4)} <br />
                <strong>Lng:</strong> {item.lng.toFixed(4)}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <h3>🌿 Identify Your Plant</h3>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          style={{ marginBottom: '10px' }}
        /><br />
        <select value={organ} onChange={(e) => setOrgan(e.target.value)}>
          <option value="leaf">leaf</option>
          <option value="flower">flower</option>
          <option value="fruit">fruit</option>
          <option value="bark">bark</option>
          <option value="auto">auto</option>
        </select><br /><br />
        <button onClick={identifyPlant} style={{ padding: '8px 20px' }}>
          {loading ? 'Identifying...' : 'Identify Plant'}
        </button>

        {result && (
          <div style={{ marginTop: '20px', textAlign: 'left', maxWidth: '600px', margin: '20px auto' }}>
            <h4>Result:</h4>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}