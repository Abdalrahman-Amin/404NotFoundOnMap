import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
function Map() {
   const [searchParams, setSearchParams] = useSearchParams();
   const lat = searchParams.get("lat");
   const lng = searchParams.get("lng");
   const navigate = useNavigate();

   const handleClick = () => {
      navigate("form");
   };

   return (
      <div className={styles.mapContainer} onClick={handleClick}>
         <h1>Map</h1>
         <h2>
            Position: {lat}, {lng}
         </h2>
      </div>
   );
}

export default Map;
