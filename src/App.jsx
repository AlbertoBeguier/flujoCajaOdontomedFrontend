import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import { Footer } from "./components/Footer";
import { PaginaInicial } from "./components/PaginaInicial";
import { Ingresos } from "./components/ingresos/Ingresos";
import { GestionCategorias } from "./components/ingresos/categorias/GestionCategorias";
import { RegistroIngresos } from "./components/ingresos/registro/RegistroIngresos";
function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        {/* Ruta para el componente página inicial */}
        <Route path="/" element={<PaginaInicial />} />

        {/* Ruta para el componente Ingresos */}
        <Route path="/ingresos" element={<Ingresos />} />
        {/* Ruta para el componente Agregar catagorias de ingresos  */}
        <Route path="/agregar-ingresos" element={<GestionCategorias />} />
        {/* Ruta para el componente para registar ingresos */}
        <Route path="/registar-ingresos" element={<RegistroIngresos />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
