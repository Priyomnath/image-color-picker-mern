import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import MyPalettes from "./pages/MyPalettes";

//22/07/2026 {time: 10:46 PM}
import ExtractColors from "./pages/ExtractColors";
import ColorPaletteGenerator from "./pages/ColorPaletteGenerator";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-palettes"
          element={
            <ProtectedRoute>
              <MyPalettes />
            </ProtectedRoute>
          }
        />

        {/* //22/07/2026 {time: 10:48 PM} */}
        <Route path="/extract-colors-from-image" element={<ExtractColors />} />

        <Route
          path="/color-palette-generator"
          element={<ColorPaletteGenerator />}
        />
        

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
