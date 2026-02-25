import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LocateFixed, MapPin } from 'lucide-react';

interface LocationPickerProps {
  onLocationChange: (location: { lat: number; lng: number; address: string }) => void;
}

// Fix for default icon issue with webpack
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const LocationMarker = ({ position, setPosition }: { position: LatLng, setPosition: (pos: LatLng) => void }) => {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position ? <Marker position={position}></Marker> : null;
};

export default function LocationPicker({ onLocationChange }: LocationPickerProps) {
  const [position, setPosition] = useState<LatLng | null>(new LatLng(24.7136, 46.6753)); // Default to Riyadh
  const [manualAddress, setManualAddress] = useState('');

  useEffect(() => {
    if (position) {
      // In a real app, you'd use a geocoding service to get the address from lat/lng
      onLocationChange({ lat: position.lat, lng: position.lng, address: `Lat: ${position.lat.toFixed(4)}, Lng: ${position.lng.toFixed(4)}` });
    }
  }, [position, onLocationChange]);

  const handleDetectLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPos = new LatLng(pos.coords.latitude, pos.coords.longitude);
        setPosition(newPos);
      },
      (err) => {
        console.error("Error detecting location:", err);
        alert("Could not detect your location. Please enable location services.");
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <button type="button" onClick={handleDetectLocation} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-500 transition-colors">
          <LocateFixed size={20} />
          <span>Auto-Detect Location</span>
        </button>
      </div>
      <div className="h-64 w-full rounded-lg overflow-hidden border-2 border-gray-700 relative">
        <MapContainer center={[24.7136, 46.6753]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {position && <LocationMarker position={position} setPosition={setPosition} />}
        </MapContainer>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
            <MapPin size={40} className="text-red-500" />
        </div>
      </div>
      <div>
        <label htmlFor="manualAddress" className="block text-sm font-medium text-gray-300 mb-2">Or Enter Address Manually</label>
        <input 
          type="text" 
          name="manualAddress" 
          id="manualAddress" 
          value={manualAddress}
          onChange={(e) => {
            setManualAddress(e.target.value);
            onLocationChange({ lat: 0, lng: 0, address: e.target.value });
          }}
          className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="e.g. 1234 King Fahd Branch Rd, Riyadh"
        />
      </div>
    </div>
  );
}
