import { Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import LocalMultiplayer from "./pages/LocalMultiplayer";
import About from "./pages/About";

export default function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/local-multiplayer" element={<LocalMultiplayer />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}
