import { useState } from 'react';
import Map from './Map';
import StoreList from './StoreList';
import storesData from '../data/stores.json';
import { Locate } from 'lucide-react';
import './StoreLocator.css';

export default function StoreLocator() {
    const [selectedStore, setSelectedStore] = useState(null);
    const [mapView, setMapView] = useState({ center: [20, 0], zoom: 2 });

    // Flatten stores for the map component
    const allStores = storesData.flatMap(group => group.stores);

    const handleStoreSelect = (store) => {
        setSelectedStore(store);
        setMapView({ center: [store.lat, store.lng], zoom: 15 });
    };

    const handleUseMyLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setMapView({ center: [latitude, longitude], zoom: 13 });
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Unable to retrieve your location.");
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    return (
        <div className="store-locator">
            <div className="sidebar">
                <div className="header">
                    <h1>Find a Store</h1>
                    <p>Locate a Dyson Demo Store near you.</p>
                </div>
                <StoreList
                    storesData={storesData}
                    onStoreSelect={handleStoreSelect}
                    selectedStore={selectedStore}
                    onUseMyLocation={handleUseMyLocation}
                />
            </div>
            <div className="map-wrapper">
                <Map
                    stores={allStores}
                    mapView={mapView}
                    onStoreSelect={handleStoreSelect}
                />
            </div>
        </div>
    );
}
