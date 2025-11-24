import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';
import dysonPin from '../assets/map-pin-dyson.svg';

// Custom Dyson Icon
const dysonIcon = L.icon({
  iconUrl: dysonPin,
  iconSize: [40, 40], // Adjust size as needed
  iconAnchor: [20, 40], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -40] // Point from which the popup should open relative to the iconAnchor
});

// Custom Cluster Icon Function
const createClusterCustomIcon = function (cluster) {
  return L.divIcon({
    html: `<span>${cluster.getChildCount()}</span>`,
    className: 'custom-cluster-icon',
    iconSize: L.point(50, 50, true),
  });
}

function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function Map({ stores, mapView, onStoreSelect }) {
  return (
    <MapContainer center={mapView.center} zoom={mapView.zoom} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
      <ChangeView center={mapView.center} zoom={mapView.zoom} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup
        chunkedLoading
        showCoverageOnHover={false}
        iconCreateFunction={createClusterCustomIcon}
      >
        {stores.map((store, index) => (
          <Marker
            key={index}
            position={[store.lat, store.lng]}
            icon={dysonIcon}
            eventHandlers={{
              click: () => {
                onStoreSelect(store);
              },
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg">{store.name}</h3>
                <p className="text-sm">{store.address}</p>
                <p className="text-sm">{store.city}, {store.state || store.country}</p>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="directions-link"
                >
                  Get Directions
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
