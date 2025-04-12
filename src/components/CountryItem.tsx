import { CountryType } from "../types/types";
import styles from "./CountryItem.module.css";

interface CountryItemProps {
   country: CountryType;
}

function CountryItem({ country }: CountryItemProps) {
   return (
      <li className={styles.countryItem}>
         <span>{country.emoji}</span>
         <span>{country.country}</span>
      </li>
   );
}

export default CountryItem;
