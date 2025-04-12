import styles from "./CountryList.module.css";
import CountryItem from "./CountryItem";
import Spinner from "./Spinner";
import Message from "./Message";
import { CityType, CountryType } from "../types/types";

interface CountryListProps {
   isLoading: boolean;
   cities: CityType[];
}

function CountryList({ isLoading, cities }: CountryListProps) {
   const countries: CountryType[] | [] = cities.reduce(function (
      acc: CountryType[],
      curr
   ) {
      if (!acc.map((el) => el.country).includes(curr.country)) {
         return [...acc, { country: curr.country, emoji: curr.emoji }];
      } else {
         return acc;
      }
   },
   []);

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
