import { useState } from 'react';
import { Search, MapPin, Locate } from 'lucide-react';

export default function StoreList({ storesData, onStoreSelect, selectedStore, onUseMyLocation }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('All');

    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const handleCountryChange = (e) => {
        setSelectedCountry(e.target.value);
    };

    const countries = ['All', ...storesData.map(group => group.country)];

    const filteredStores = storesData
        .filter(group => selectedCountry === 'All' || group.country === selectedCountry)
        .map(countryGroup => {
            const filtered = countryGroup.stores.filter(store =>
                store.name.toLowerCase().includes(searchTerm) ||
                store.city.toLowerCase().includes(searchTerm) ||
                store.address.toLowerCase().includes(searchTerm)
            );
            return { ...countryGroup, stores: filtered };
        }).filter(group => group.stores.length > 0);

    return (
        <div className="store-list-container">
            <div className="filter-bar" style={{ padding: '16px 24px 0', display: 'flex', gap: '10px' }}>
                <select
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    style={{
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                        width: '100%',
                        fontFamily: 'Dyson Futura',
                        fontWeight: 500
                    }}
                    aria-label="Filter by country"
                >
                    {countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                    ))}
                </select>
            </div>
            <div className="search-bar">
                <Search className="search-icon" size={20} />
                <input
                    type="text"
                    placeholder="Search by city or store..."
                    value={searchTerm}
                    onChange={handleSearch}
                    aria-label="Search stores"
                />
                <button
                    className="location-btn"
                    onClick={onUseMyLocation}
                    aria-label="Use my location"
                    title="Use my location"
                >
                    <Locate size={20} />
                </button>
            </div>
            <div className="store-list">
                {filteredStores.map((group, idx) => (
                    <div key={idx} className="country-group">
                        <h2 className="country-header">{group.country}</h2>
                        <ul>
                            {group.stores.map((store, sIdx) => (
                                <li key={sIdx}>
                                    <button
                                        className={`store-item ${selectedStore === store ? 'selected' : ''}`}
                                        onClick={() => onStoreSelect(store)}
                                        aria-label={`Select ${store.name}`}
                                    >
                                        <div className="store-info">
                                            <h3 className="store-name">{store.name}</h3>
                                            <p className="store-address">{store.address}</p>
                                            <p className="store-city">{store.city}, {store.state || store.country}</p>
                                            <a
                                                href={`https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="directions-link"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                Get Directions
                                            </a>
                                        </div>
                                        <MapPin size={16} className="pin-icon" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
                {filteredStores.length === 0 && (
                    <div className="no-results">No stores found.</div>
                )}
            </div>
        </div>
    );
}
