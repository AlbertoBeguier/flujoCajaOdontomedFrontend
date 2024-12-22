import "./App.scss";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { NavBar } from "./components/NavBar";
import { Footer } from "./components/Footer";
import { PaginaInicial } from "./components/PaginaInicial";
import { Ingresos } from "./components/ingresos/Ingresos";
import { GestionCategorias } from "./components/ingresos/categorias/GestionCategorias";
import { RegistroIngresos } from "./components/ingresos/registro/RegistroIngresos";
import { Egresos } from "./components/egresos/Egresos";
import { GestionCategoriasEgresos } from "./components/egresos/categorias/GestionCategoriasEgresos";
import { GestionSubcategoriasEgresos } from "./components/egresos/subcategorias/GestionSubcategoriasEgresos";
import { RegistroEgresos } from "./components/egresos/registro/RegistroEgresos";
import { Login } from "./components/auth/Login";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Register } from "./components/auth/Register";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas sin protección - sin NavBar */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas - con NavBar */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="app-container">
                <NavBar />
                <Routes>
                  <Route path="/home" element={<PaginaInicial />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/ingresos" element={<Ingresos />} />
                  <Route
                    path="/agregar-ingresos"
                    element={<GestionCategorias />}
                  />
                  <Route
                    path="/registar-ingresos"
                    element={<RegistroIngresos />}
                  />
                  <Route path="/egresos" element={<Egresos />} />
                  <Route
                    path="/agregar-egresos"
                    element={<GestionCategoriasEgresos />}
                  />
                  <Route
                    path="/agregar-subcategorias-egresos"
                    element={<GestionSubcategoriasEgresos />}
                  />
                  <Route
                    path="/registrar-egresos"
                    element={<RegistroEgresos />}
                  />
                </Routes>
                <Footer />
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
