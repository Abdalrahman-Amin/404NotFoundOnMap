import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import AppLayout from "./pages/AppLayout";
import PageNotFound from "./pages/PageNotFound";
import Product from "./pages/Product";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import CityList from "./components/CityList";
import { useEffect, useState } from "react";
import CountryList from "./components/CountryList";
import { CityType } from "./types/types";
import City from "./components/City";
import Form from "./components/Form";

const BASE_URL = "http://localhost:8000";

function App() {
   const [cities, setCities] = useState<CityType[]>([]);
   const [isLoading, setIsLoading] = useState<boolean>(false);
   console.log("DEBUG: ~ App ~ cities:", cities);

   useEffect(() => {
      const controller = new AbortController();
      const fetchCities = async () => {
         try {
            setIsLoading(true);
            const res = await fetch(`${BASE_URL}/cities`, {
               signal: controller.signal,
            });
            const data = await res.json();
            console.log("DEBUG: ~ fetchCities ~ data:", data);
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
      <>
         <BrowserRouter>
            {/* <PageNav /> */}
            <Routes>
               <Route index element={<Homepage />} />
               <Route path="/product" element={<Product />} />
               <Route path="/pricing" element={<Pricing />} />
               <Route path="/login" element={<Login />} />
               <Route path="/app" element={<AppLayout />}>
                  <Route
                     index
                     element={
                        <CityList cities={cities} isLoading={isLoading} />
                     }
                  />
                  <Route
                     path="cities"
                     element={
                        <CityList cities={cities} isLoading={isLoading} />
                     }
                  />
                  <Route path="cities/:id" element={<City />} />
                  <Route
                     path="countries"
                     element={
                        <CountryList cities={cities} isLoading={isLoading} />
                     }
                  />
                  <Route path="form" element={<Form />} />
               </Route>
               <Route path="*" element={<PageNotFound />} />
            </Routes>
         </BrowserRouter>
      </>
   );
}

export default App;
