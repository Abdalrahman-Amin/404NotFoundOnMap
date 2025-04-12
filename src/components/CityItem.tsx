import { CityType } from "../App";
import formatDate from "../utils/formatDate";
import styles from "./CityItem.module.css";

interface CityItemProps {
   city: CityType;
}

function CityItem({ city }: CityItemProps) {
   const { cityName, emoji, date } = city;
   return (
      <li className={styles.cityItem}>
         <span className={styles.emoji}>{emoji}</span>
         <h3 className={styles.name}>{cityName}</h3>
         <time className={styles.date}>({formatDate(date, false)})</time>
         <button className={styles.deleteBtn}>&times;</button>
      </li>
   );
}

export default CityItem;
