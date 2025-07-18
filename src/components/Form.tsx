// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useReducer } from "react";
import styles from "./Form.module.css";
import Button from "./Button";
import ButtonBack from "./ButtonBack";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Message from "./Message";
import { FormAction, FormState, GeocodeResponse } from "../types/types";
import Spinner from "./Spinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../contexts/CitiesContext";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

export function convertToEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

//intial state
const initialState: FormState = {
  isLoadingGeocoding: false,
  cityName: "",
  countryName: "",
  date: new Date(),
  notes: "",
  emoji: "",
  geocodingError: "",
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_LOADING": {
      return {
        ...state,
        isLoadingGeocoding: action.payload,
      };
    }
    case "SET_LOCATION_DATA": {
      return {
        ...state,
        cityName: action.payload.cityName,
        countryName: action.payload.countryName,
        emoji: action.payload.emoji,
      };
    }
    case "SET_CITY": {
      return { ...state, cityName: action.payload };
    }
    case "SET_COUNTRY": {
      return { ...state, countryName: action.payload };
    }
    case "SET_DATE": {
      return { ...state, date: action.payload };
    }
    case "SET_NOTES": {
      return { ...state, notes: action.payload };
    }
    case "SET_EMOJI": {
      return { ...state, emoji: action.payload };
    }
    case "SET_ERROR": {
      return {
        ...state,
        geocodingError: action.payload || "",
        isLoadingGeocoding: false,
      };
    }
    case "RESET": {
      return initialState;
    }
    case "START_GEOCODING": {
      return {
        ...state,
        isLoadingGeocoding: true,
        geocodingError: "",
      };
    }
    default:
      throw new Error(`Unknown action type: ${(action as any).type}`);
  }
}

function Form() {
  //hooks
  const [lat, lng] = useUrlPosition();

  const [state, dispatch] = useReducer(formReducer, initialState);

  const {
    cityName,
    countryName,
    date,
    emoji,
    isLoadingGeocoding,
    notes,
    geocodingError,
  } = state;

  const { createCity, isLoading } = useCities();
  const navigate = useNavigate();

  useEffect(() => {
    // Only fetch if we have valid coordinates
    if (!lat || !lng) return;

    const controller = new AbortController();
    async function fetchCityData(): Promise<void> {
      try {
        dispatch({
          type: "START_GEOCODING",
        });
        const res = await fetch(
          `${BASE_URL}?latitude=${lat}&longitude=${lng}`,
          { signal: controller.signal }
        );
        const data: GeocodeResponse = await res.json();
        if (!data || !data.countryCode) {
          throw new Error(
            "That doesn't seem to be a city. Click somewhere else 😉."
          );
        }
        dispatch({
          type: "SET_LOCATION_DATA",
          payload: {
            cityName: data.city || data.locality || "",
            countryName: data.countryName || "",
            emoji: convertToEmoji(data.countryCode || ""),
          },
        });
        console.log("DEBUG: ~ fetchCityData ~ data:", data);
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Failed to fetch city data:", error);
          dispatch({
            type: "SET_ERROR",
            payload: error.message,
          });
        }
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    }

    fetchCityData();

    return () => {
      controller.abort();
    };
  }, [lat, lng]);

  const handleCityNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_CITY", payload: e.target.value });
  };

  const handleDateChange = (date: Date | null): void => {
    if (!date) return;
    dispatch({ type: "SET_DATE", payload: date });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({ type: "SET_NOTES", payload: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!cityName || !date || !lat || !lng) {
      dispatch({
        type: "SET_ERROR",
        payload: "Please fill in all fields before submitting.",
      });
      return;
    }

    const newCity = {
      cityName,
      country: countryName,
      date: date.toISOString(),
      notes,
      emoji,
      position: {
        lat: Number(lat),
        lng: Number(lng),
      },
    };
    await createCity(newCity);
    console.log("DEBUG: ~ handleSubmit ~ newCity:", newCity);
    dispatch({ type: "RESET" });
    navigate("/app/cities");
  };

  if (isLoadingGeocoding) return <Spinner />;

  if (!lat || !lng)
    return <Message message="Click on the map to select a location." />;

  if (geocodingError) return <Message message={geocodingError} />;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={handleCityNameChange}
          value={cityName}
          disabled
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          id="date"
          selected={date}
          onChange={handleDateChange}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea id="notes" onChange={handleNotesChange} value={notes} />
      </div>

      <div className={styles.buttons}>
        <Button type="primary" onClick={() => {}}>
          Add
        </Button>
        <ButtonBack />
      </div>
    </form>
  );
}

export default Form;
