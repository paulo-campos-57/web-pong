import { Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import SinglePlayer from "./pages/SinglePlayer";
import LocalMultiplayer from "./pages/LocalMultiplayer";
import About from "./pages/About";

export default function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/single-player" element={<SinglePlayer />} />
        <Route path="/local-multiplayer" element={<LocalMultiplayer />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}
