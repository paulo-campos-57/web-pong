import { Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import LocalMultiplayer from "./pages/LocalMultiplayer";

export default function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/local-multiplayer" element={<LocalMultiplayer />} />
      </Routes>
    </>
  );
}
