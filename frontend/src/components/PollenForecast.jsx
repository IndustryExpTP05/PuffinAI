import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PollenForecast.css";

const GOOGLE_API_KEY = "AIzaSyBk5Jp0Hurs4ACTPBjGX94uL7ZZv85k8aA";
const JSON_PATH = "/data/postcodes.json";

const PollenForecast = () => {
  const [location, setLocation] = useState({ lat: -37.917, lon: 145.128 });
  const [currentLocationName, setCurrentLocationName] = useState("Clayton");
  const [postcodeList, setPostcodeList] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  // Load postcode data + user location
  useEffect(() => {
    const loadDataAndLocate = async () => {
      const res = await fetch(JSON_PATH);
      const data = await res.json();

      // Normalize postcode + locality
      const cleaned = data.map((row) => ({
        ...row,
        postcode: String(row.postcode).trim(),
        locality: row.locality?.toUpperCase().trim(),
      }));

      setPostcodeList(cleaned);

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setLocation({ lat, lon });

          const closest = findClosestLocation(lat, lon, cleaned);
          if (closest?.locality) {
            setCurrentLocationName(closest.locality);
          }
        },
        () => setCurrentLocationName("Clayton")
      );
    };

    loadDataAndLocate();
  }, []);

  // Fetch forecast when location changes
  useEffect(() => {
    if (!location.lat || !location.lon) return;

    const fetchForecast = async () => {
      try {
        const pollenRes = await axios.get(
          "https://pollen.googleapis.com/v1/forecast:lookup",
          {
            params: {
              key: GOOGLE_API_KEY,
              "location.latitude": location.lat,
              "location.longitude": location.lon,
              days: 5,
            },
          }
        );
        const weatherRes = await axios.get(
          `https://api.open-meteo.com/v1/forecast`,
          {
            params: {
              latitude: location.lat,
              longitude: location.lon,
              daily:
                "temperature_2m_max,temperature_2m_min,weathercode,windspeed_10m_max,relative_humidity_2m_max",
              timezone: "auto",
            },
          }
        );

        const pollenData = pollenRes.data;
        const weatherData = weatherRes.data;

        const combined = weatherData.daily.time.map((date, i) => {
          const pollen = pollenData.daily_forecasts?.[i]?.types || {};
          return {
            day: i === 0 ? "Today" : new Date(date).toLocaleDateString("en-AU", {
              weekday: "long",
            }),
            index:
              Math.max(
                pollen.tree?.index?.value || 0,
                pollen.grass?.index?.value || 0
              ) || 0,
            tree: pollen.tree?.index?.category || "None",
            grass: pollen.grass?.index?.category || "None",
            wind: weatherData.daily.windspeed_10m_max[i],
            weather: getWeatherLabel(weatherData.daily.weathercode[i]),
            tempMax: weatherData.daily.temperature_2m_max[i],
            tempMin: weatherData.daily.temperature_2m_min[i],
            humidity: weatherData.daily.relative_humidity_2m_max[i],
          };
        });

        setForecast(combined);
      } catch (err) {
        console.error("Forecast fetch failed:", err);
      }
    };

    fetchForecast();
  }, [location]);

  // Search bar logic
  const handleSearchChange = (e) => {
    const value = e.target.value.toUpperCase();
    setSearch(value);
    setSelectedOption(null);

    if (postcodeList.length === 0 || value.length < 2) {
      setFilteredOptions([]);
      return;
    }

    const filtered = postcodeList.filter(
      (item) =>
        item.locality?.includes(value) || item.postcode.includes(value)
    );
    setFilteredOptions(filtered.slice(0, 6));
  };

  const handleSelect = (item) => {
    setSelectedOption(item);
    setSearch(`${item.locality} (${item.postcode})`);
    setFilteredOptions([]);
  };

  const handleSearchSubmit = () => {
    let match = selectedOption;

    if (!match) {
      const input = search.trim().toUpperCase();
      match = postcodeList.find(
        (item) =>
          item.locality?.toUpperCase() === input ||
          item.postcode === input
      );
    }

    if (match) {
      setLocation({ lat: parseFloat(match.lat), lon: parseFloat(match.long) });
      setCurrentLocationName(match.locality);
      setSearch(`${match.locality} (${match.postcode})`);
    } else {
      alert("No match found. Please select a valid suburb or postcode.");
    }
  };

  const findClosestLocation = (lat, lon, data) => {
    let closest = null;
    let minDist = Infinity;
    data.forEach((item) => {
      if (!item.lat || !item.long) return;
      const d =
        Math.abs(lat - parseFloat(item.lat)) +
        Math.abs(lon - parseFloat(item.long));
      if (d < minDist) {
        minDist = d;
        closest = item;
      }
    });
    return closest;
  };

  const getWeatherLabel = (code) => {
    if (code === 0) return "Clear";
    if (code <= 2) return "Partly Cloudy";
    if (code === 3) return "Cloudy";
    if (code >= 45 && code <= 48) return "Fog";
    if (code >= 51 && code <= 67) return "Drizzle";
    if (code >= 71 && code <= 77) return "Snow";
    if (code >= 80 && code <= 82) return "Rain";
    if (code >= 95) return "Thunderstorm";
    return "Unknown";
  };

  return (
    <div className="forecast-container">
      <h2 className="forecast-title">Daily Allergy Forecast</h2>
      <p className="forecast-subtitle">
        Forecast for <span className="location">{currentLocationName}</span>
      </p>

      <div className="search-box">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search suburb or postcode..."
        />
        <button onClick={handleSearchSubmit}>Search</button>
        {filteredOptions.length > 0 && (
          <ul className="dropdown">
            {filteredOptions.map((item, i) => (
              <li key={i} onClick={() => handleSelect(item)}>
                {item.locality} ({item.postcode})
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="table-container">
        <table className="forecast-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Index</th>
              <th>🌳 Tree</th>
              <th>🌾 Grass</th>
              <th>💨 Wind</th>
              <th>Weather</th>
              <th>Temp (°C)</th>
              <th>Humidity</th>
            </tr>
          </thead>
          <tbody>
            {forecast.map((item, i) => (
              <tr key={i}>
                <td>{item.day}</td>
                <td>{item.index}</td>
                <td>{item.tree}</td>
                <td>{item.grass}</td>
                <td>{item.wind} km/h</td>
                <td>{item.weather}</td>
                <td>
                  {item.tempMax}° / {item.tempMin}°
                </td>
                <td>{item.humidity}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PollenForecast;
