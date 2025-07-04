import { Link } from "react-router-dom";
import { CityType } from "../types/types";
import formatDate from "../utils/formatDate";
import styles from "./CityItem.module.css";
import { useCities } from "../contexts/CitiesContext";

interface CityItemProps {
  city: CityType;
}

function CityItem({ city }: CityItemProps) {
  const { currentCity, deleteCity } = useCities();
  const { cityName, emoji, date, id, position } = city;
  const { lat, lng } = position;

  const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (window.confirm(`Are you sure you want to delete ${cityName}?`)) {
      await deleteCity(id);
    }
  };
  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          currentCity?.id === id && styles["cityItem--active"]
        }`}
        to={`${id}?lat=${lat}&lng=${lng}`}
      >
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>({formatDate(date, false)})</time>
        <button className={styles.deleteBtn} onClick={handleDelete}>
          &times;
        </button>
      </Link>
    </li>
  );
}

export default CityItem;
