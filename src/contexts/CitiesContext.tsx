import { createContext, useContext, useEffect, useState } from "react";
import { CityType, CountryType, NewCityType } from "../types/types";

export const BASE_URL = "http://localhost:8000";

const CitiesContext = createContext<unknown>(null);

function CitiesProvider({ children }: { children: React.ReactNode }) {
  const [cities, setCities] = useState<CityType[]>([]);
  const [currentCity, setCurrentCity] = useState<CityType | null>(null);
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
          console.error("Failed to fetch cities:", err);
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

  async function getCity(id: number) {
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}/cities/${id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const cityData = await response.json();
      setCurrentCity(cityData);
    } catch (err) {
      if (
        typeof err === "object" &&
        err !== null &&
        "name" in err &&
        (err as { name: string }).name !== "AbortError"
      ) {
        console.error("Failed to fetch city data:", err);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function createCity(newCity: NewCityType) {
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCity),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const createdCity = await response.json();
      setCities((prevCities) => [...prevCities, createdCity]);
      setCurrentCity(createdCity);
    } catch (err) {
      if (
        typeof err === "object" &&
        err !== null &&
        "name" in err &&
        (err as { name: string }).name !== "AbortError"
      ) {
        console.error("Failed to fetch city data:", err);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        countries,
        currentCity,
        getCity,
        createCity,
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
  currentCity: CityType | null;
  getCity: (id: number) => Promise<void>;
  createCity: (newCity: NewCityType) => Promise<void>;
};

export { CitiesProvider, useCities };
