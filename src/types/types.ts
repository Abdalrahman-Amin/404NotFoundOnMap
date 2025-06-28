export interface CityType {
  cityName: string;
  country: string;
  emoji: string;
  date: string;
  notes: string;
  position: {
    lat: number;
    lng: number;
  };
  id: number;
}

export interface CountryType {
  emoji: string;
  country: string;
}

export interface FormState {
  isLoadingGeocoding: boolean;
  cityName: string;
  countryName: string;
  date: Date;
  notes: string;
  emoji: string;
  geocodingError: string;
}

export type FormAction =
  | { type: "SET_LOADING"; payload: boolean }
  | {
      type: "SET_LOCATION_DATA";
      payload: { cityName: string; countryName: string; emoji: string };
    }
  | { type: "SET_CITY"; payload: string }
  | { type: "SET_COUNTRY"; payload: string }
  | { type: "SET_DATE"; payload: Date }
  | { type: "SET_NOTES"; payload: string }
  | { type: "SET_EMOJI"; payload: string }
  | { type: "RESET" }
  | { type: "SET_ERROR"; payload: string }
  | { type: "START_GEOCODING" };

// API response type (based on BigDataCloud API)
export interface GeocodeResponse {
  city?: string;
  locality?: string;
  countryName?: string;
  countryCode?: string;
}
