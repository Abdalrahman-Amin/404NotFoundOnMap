import { createContext, useContext, useEffect, useReducer } from "react";
import {
  CitiesActions,
  CitiesContextState,
  CitiesContextType,
  CountryType,
  NewCityType,
} from "../types/types";

export const BASE_URL = "http://localhost:8000";

const CitiesContext = createContext<unknown>(null);

const initialState: CitiesContextState = {
  cities: [],
  currentCity: null,
  isLoading: false,
  error: "",
};

function citiesReducer(
  state: CitiesContextState,
  action: CitiesActions
): CitiesContextState {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded": {
      return {
        ...state,
        cities: action.payload,
        isLoading: false,
      };
    }
    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "city/created": {
      return {
        ...state,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
        isLoading: false,
      };
    }
    case "city/deleted": {
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        isLoading: false,
        currentCity: null,
      };
    }
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
  }
}

function CitiesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(citiesReducer, initialState);
  const { cities, currentCity, isLoading, error } = state;

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
        dispatch({ type: "loading" });
        const res = await fetch(`${BASE_URL}/cities`, {
          signal: controller.signal,
        });
        const data = await res.json();
        console.log("Fetched cities:", data);
        dispatch({ type: "cities/loaded", payload: data });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Failed to fetch cities:", err);
          dispatch({
            type: "rejected",
            payload: (err as Error).message || "Faild to fetch cities",
          });
        }
      }
    };
    fetchCities();
    return () => {
      controller.abort();
    };
  }, []);

  async function getCity(id: number) {
    if (id === currentCity?.id) {
      return;
    }
    try {
      dispatch({ type: "loading" });
      const response = await fetch(`${BASE_URL}/cities/${id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const cityData = await response.json();
      dispatch({ type: "city/loaded", payload: cityData });
    } catch (err) {
      if (
        typeof err === "object" &&
        err !== null &&
        "name" in err &&
        (err as { name: string }).name !== "AbortError"
      ) {
        console.error("Failed to fetch city data:", err);
        dispatch({
          type: "rejected",
          payload: (err as Error).message || "Failed to fetch city data",
        });
      }
    }
  }

  async function createCity(newCity: NewCityType) {
    try {
      dispatch({ type: "loading" });
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
      dispatch({ type: "city/created", payload: createdCity });
    } catch (err) {
      if (
        typeof err === "object" &&
        err !== null &&
        "name" in err &&
        (err as { name: string }).name !== "AbortError"
      ) {
        console.error("Failed to fetch city data:", err);
        dispatch({
          type: "rejected",
          payload: (err as Error).message || "Failed to create city",
        });
      }
    }
  }

  async function deleteCity(id: number) {
    try {
      dispatch({ type: "loading" });
      const response = await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      dispatch({ type: "city/deleted", payload: id });
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "name" in error &&
        (error as { name: string }).name !== "AbortError"
      ) {
        console.error("Failed to delete city:", error);
        dispatch({
          type: "rejected",
          payload: (error as Error).message || "Failed to delete city",
        });
      }
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        countries,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
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

export { CitiesProvider, useCities };
