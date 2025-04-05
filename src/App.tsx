import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import AppLayout from "./pages/AppLayout";
import PageNotFound from "./pages/PageNotFound";
import Product from "./pages/Product";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
// import PageNav from "./components/PageNav";

function App() {
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
                  <Route index element={<p>cities route</p>} />
                  <Route path="cities" element={<p>cities route</p>} />
                  <Route path="countries" element={<p>countries route</p>} />
                  <Route path="form" element={<p>form route</p>} />
               </Route>
               <Route path="*" element={<PageNotFound />} />
            </Routes>
         </BrowserRouter>
      </>
   );
}

export default App;
