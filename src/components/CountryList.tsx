import styles from "./CountryList.module.css";
import CountryItem from "./CountryItem";
import Spinner from "./Spinner";
import Message from "./Message";
import { useCities } from "../contexts/CitiesContext";

function CountryList() {
   const { cities, isLoading, countries } = useCities();

   if (isLoading) return <Spinner />;
   if (!cities.length)
      return (
         <Message message="Add your first city by clicking on city on map" />
      );
   return (
      <ul className={styles.countryList}>
         {countries.map((country) => (
            <CountryItem country={country} key={country.country} />
         ))}
      </ul>
   );
}

export default CountryList;
