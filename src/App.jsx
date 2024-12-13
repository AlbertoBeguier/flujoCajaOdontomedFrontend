import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import { Footer } from "./components/Footer";
import { PaginaInicial } from "./components/PaginaInicial";
import { Ingresos } from "./components/ingresos/Ingresos";
import { AgregarIngresos } from "./components/ingresos/AgregarIngresos";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        {/* Ruta para el componente página inicial */}
        <Route path="/" element={<PaginaInicial />} />

        {/* Ruta para el componente Ingresos */}
        <Route path="/ingresos" element={<Ingresos />} />
        {/* Ruta para el componente AgregarIngresos */}
        <Route path="/agregar-ingresos" element={<AgregarIngresos />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
