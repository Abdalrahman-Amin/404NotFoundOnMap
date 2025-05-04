import { createContext, useContext, useEffect, useState } from "react";
import { CityType, CountryType } from "../types/types";

const BASE_URL = "http://localhost:8000";

const CitiesContext = createContext<unknown>(null);

function CitiesProvider({ children }: { children: React.ReactNode }) {
   const [cities, setCities] = useState<CityType[]>([]);
   const [isLoading, setIsLoading] = useState<boolean>(false);

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

   useEffect(() => {
      const controller = new AbortController();
      const fetchCities = async () => {
         try {
            setIsLoading(true);
            const res = await fetch(`${BASE_URL}/cities`, {
               signal: controller.signal,
            });
            const data = await res.json();
            setCities(data);
         } catch (err) {
            if ((err as Error).name !== "AbortError") {
               console.log("DEBUG: ~ fetchCities ~ err:", err);
            }
         } finally {
            setIsLoading(false);
         }
      };
      fetchCities();
      return () => {
         controller.abort();
      };
   }, []);

   return (
      <CitiesContext.Provider
         value={{
            cities,
            isLoading,
            countries,
         }}
      >
         {children}
      </CitiesContext.Provider>
   );
}

/**
 * Hook to access the cities context. Throws an error if used outside of a `CitiesProvider`.
 * @returns The `cities` state and `isLoading` state as an object with type `CitiesContextType`.
 */
function useCities(): CitiesContextType {
   const context = useContext(CitiesContext) as CitiesContextType;
   if (context === undefined) {
      throw new Error("useCities must be used within a CitiesProvider");
   }
   return context;
}

type CitiesContextType = {
   cities: CityType[];
   isLoading: boolean;
   countries: CountryType[];
};

export { CitiesProvider, useCities };
