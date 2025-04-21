import { Link } from "react-router-dom";
import { CityType } from "../types/types";
import formatDate from "../utils/formatDate";
import styles from "./CityItem.module.css";

interface CityItemProps {
   city: CityType;
}

function CityItem({ city }: CityItemProps) {
   const { cityName, emoji, date, id, position } = city;
   console.log("DEBUG: ~ CityItem ~ position:", position);
   const { lat, lng } = position;
   return (
      <li>
         <Link className={styles.cityItem} to={`${id}?lat=${lat}&lng=${lng}`}>
            <span className={styles.emoji}>{emoji}</span>
            <h3 className={styles.name}>{cityName}</h3>
            <time className={styles.date}>({formatDate(date, false)})</time>
            <button className={styles.deleteBtn}>&times;</button>
         </Link>
      </li>
   );
}

export default CityItem;
