import { BrowserRouter, Route, Routes } from "react-router-dom";
import Product from "./pages/Product";
import Pricing from "./pages/Pricing";
import HomePage from "./pages/HomePage";
import PageNotFound from "./pages/PageNotFound";
import PageNav from "./components/PageNav";
import AppLayout from "./pages/AppLayout";

function App() {
   return (
      <>
         <BrowserRouter>
            <PageNav />
            <Routes>
               <Route path="/" element={<HomePage />} />
               <Route path="/product" element={<Product />} />
               <Route path="/pricing" element={<Pricing />} />
               <Route path="/app" element={<AppLayout />} />
               <Route path="*" element={<PageNotFound />} />
            </Routes>
         </BrowserRouter>
      </>
   );
}

export default App;
