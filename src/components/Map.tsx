import styles from "./Map.module.css";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import { useNavigate, useSearchParams } from "react-router-dom";
function Map() {
   const [searchParams] = useSearchParams();
   const lat = searchParams.get("lat");
   const lng = searchParams.get("lng");
   const [mapPosition, setMapPosition] = useState([51.505, -0.09]); // Default position (London)
   const { cities } = useCities();

   useEffect(() => {
      if (lat && lng) {
         console.log("DEBUG MAP", typeof lat, lng);
         setMapPosition([lat, lng]);
      }
   }, [lat, lng]);

   return (
      <div className={styles.mapContainer}>
         <MapContainer
            center={mapPosition}
            zoom={6}
            scrollWheelZoom={true}
            className={styles.map}
         >
            <TileLayer
               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
               url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            />
            {cities.map((city) => (
               <Marker
                  position={[city.position.lat, city.position.lng]}
                  key={city.id}
               >
                  <Popup>
                     <span>{city.emoji}</span>
                     <span>{city.cityName}</span>
                  </Popup>
               </Marker>
            ))}
            <ChangeCenter position={mapPosition} />
            <DetectClick />
         </MapContainer>
      </div>
   );
}

function ChangeCenter({position}) {
  const map = useMap();
  map.setView(position, 8);
  return null;
}

function DetectClick() {
   const navigate = useNavigate();
   useMapEvents({
      click: (e) => {
         console.log("DEBUG: ~ DetectClick ~ e:", e);
         navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
      },
   });
   
   return null;
}

export default Map;
