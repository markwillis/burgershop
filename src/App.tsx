import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import OrderScreen from "./pages/OrderScreen";
import KitchenScreen from "./pages/KitchenScreen";
import MenuEditor from "./pages/MenuEditor";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/order/:sessionId" element={<OrderScreen />} />
        <Route path="/kitchen/:sessionId" element={<KitchenScreen />} />
        <Route path="/kitchen/:sessionId/menu" element={<MenuEditor />} />
      </Routes>
    </BrowserRouter>
  );
}
