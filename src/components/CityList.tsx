import { CityType } from "../types/types";
import CityItem from "./CityItem";
import styles from "./CityList.module.css";
import Message from "./Message";
import Spinner from "./Spinner";

type CityListProps = {
   cities: CityType[];
   isLoading: boolean;
};
function CityList({ cities, isLoading }: CityListProps) {
   if (isLoading) return <Spinner />;
   if (!cities.length)
      return (
         <Message message="Add your first city by clicking on city on map" />
      );
   return (
      <ul className={styles.cityList}>
         {cities.map((city) => (
            <CityItem city={city} key={city.id} />
         ))}
      </ul>
   );
}

export default CityList;
