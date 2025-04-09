import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import axios from 'axios';
import './PollenMap.css';

mapboxgl.accessToken = 'pk.eyJ1IjoibnlhbjAwMjUiLCJhIjoiY204dHBvdjdjMGRxajJyb2NhbTRuYnVzOCJ9.002RhpjH1--fp6uxHi1viA';

const PollenMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const popup = useRef(new mapboxgl.Popup({ closeButton: false, closeOnClick: false }));
  const hoveredFeatureId = useRef(null);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [144.9631, -37.8136],
      zoom: 6.5,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      fetch('/data/vic_forecast_districts.geojson')
        .then((res) => res.json())
        .then(async (geojson) => {
          const updatedFeatures = await Promise.all(
            geojson.features.map(async (feature, index) => {
              const center = turf.centroid(feature);
              const [lon, lat] = center.geometry.coordinates;

              let treeUPI = 0;
              let grassUPI = 0;

              try {
                const response = await axios.get(
                  'https://pollen.googleapis.com/v1/forecast:lookup',
                  {
                    params: {
                      key: 'AIzaSyBk5Jp0Hurs4ACTPBjGX94uL7ZZv85k8aA',
                      'location.latitude': lat,
                      'location.longitude': lon,
                      days: 1,
                    },
                  }
                );

                const pollenInfo = response.data?.dailyInfo?.[0]?.pollenTypeInfo || [];
                const getUPI = (type) =>
                  pollenInfo.find(p => p.code === type && p.indexInfo?.value != null)?.indexInfo.value || 0;

                treeUPI = getUPI('TREE');
                grassUPI = getUPI('GRASS');
              } catch (err) {
                console.warn(`API failed for ${lat}, ${lon}`, err);
              }

              feature.properties.treeUPI = treeUPI;
              feature.properties.grassUPI = grassUPI;
              feature.properties.generalUPI = Math.max(treeUPI, grassUPI);
              feature.id = index;
              return feature;
            })
          );

          map.current.addSource('forecast-districts', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: updatedFeatures,
            },
          });

          map.current.addLayer({
            id: 'district-fill',
            type: 'fill',
            source: 'forecast-districts',
            paint: {
              'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'generalUPI'],
                0, '#a5d6a7',
                1, '#dce775',
                2, '#fff176',
                3, '#ffb74d',
                4, '#ef5350',
                5, '#b71c1c'
              ],
              'fill-opacity': 0.75,
            },
          });

          map.current.addLayer({
            id: 'district-outline',
            type: 'line',
            source: 'forecast-districts',
            paint: {
              'line-color': '#000',
              'line-width': 1,
            },
          });

          map.current.addLayer({
            id: 'district-hover',
            type: 'line',
            source: 'forecast-districts',
            paint: {
              'line-color': '#ffffff',
              'line-width': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                3,
                0,
              ],
            },
          });

          map.current.addLayer({
            id: 'district-labels',
            type: 'symbol',
            source: 'forecast-districts',
            layout: {
              'text-field': ['get', 'DISTRICT'],
              'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
              'text-size': 12,
              'text-offset': [0, 0.6],
              'text-anchor': 'top',
            },
            paint: {
              'text-color': '#ffffff',
              'text-halo-color': '#000000',
              'text-halo-width': 1,
            },
          });

          map.current.on('mousemove', 'district-fill', (e) => {
            const feature = e.features[0];
            const id = feature.id;

            if (hoveredFeatureId.current !== null) {
              map.current.setFeatureState(
                { source: 'forecast-districts', id: hoveredFeatureId.current },
                { hover: false }
              );
            }

            hoveredFeatureId.current = id;

            map.current.setFeatureState(
              { source: 'forecast-districts', id },
              { hover: true }
            );

            const tree = feature.properties.treeUPI || 0;
            const grass = feature.properties.grassUPI || 0;

            popup.current
              .setLngLat(e.lngLat)
              .setHTML(
                `<strong>Pollen UPI</strong><br/>
                 🌳 Tree: ${tree}<br/>
                 🌾 Grass: ${grass}`
              )
              .addTo(map.current);
          });

          map.current.on('mouseleave', 'district-fill', () => {
            if (hoveredFeatureId.current !== null) {
              map.current.setFeatureState(
                { source: 'forecast-districts', id: hoveredFeatureId.current },
                { hover: false }
              );
            }
            hoveredFeatureId.current = null;
            popup.current.remove();
          });
        });
    });
  }, []);

  return (
    <div className="map-container">
      <div ref={mapContainer} className="map" />
      <div className="map-legend">
        <strong>Pollen UPI</strong>
        <div><span style={{ background: '#a5d6a7' }}></span> 0 – Very Low</div>
        <div><span style={{ background: '#dce775' }}></span> 1 – Low</div>
        <div><span style={{ background: '#fff176' }}></span> 2 – Moderate</div>
        <div><span style={{ background: '#ffb74d' }}></span> 3 – High</div>
        <div><span style={{ background: '#ef5350' }}></span> 4 – Very High</div>
        <div><span style={{ background: '#b71c1c' }}></span> 5 – Extreme</div>
      </div>
    </div>
  );
};

export default PollenMap;
