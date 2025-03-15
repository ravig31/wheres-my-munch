// MapBox.jsx
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWxleGlzbG92ZXNtYXBib3giLCJhIjoiY204YTZsbHg0MGw0NTJsb2U5aHQxMmFxdCJ9.rrkiFebFzzUp2y1D6VBVxg'; //lol

function MapBox({ long, lat }) {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [long, lat], // Glen Waverley
      zoom: 14,
    });

    new mapboxgl.Marker()
      .setLngLat([long, lat])
      .setPopup(new mapboxgl.Popup().setText('YOMG Glen Waverley'))
      .addTo(map);

    return () => map.remove();
  }, []);

  return <div ref={mapContainerRef} className="map-container" />;
}

export default MapBox;
