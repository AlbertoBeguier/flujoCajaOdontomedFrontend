import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";

export const useInactivityTimer = (timeoutMinutes = 1) => {
  const navigate = useNavigate();

  const resetTimer = useCallback(() => {
    const timer = localStorage.getItem("inactivityTimer");
    if (timer) {
      clearTimeout(parseInt(timer));
    }

    const newTimer = setTimeout(() => {
      logout();
      navigate("/login");
    }, timeoutMinutes * 60 * 1000);

    localStorage.setItem("inactivityTimer", newTimer.toString());
  }, [navigate, timeoutMinutes]);

  useEffect(() => {
    // Eventos que resetean el timer
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];

    // Iniciar el timer
    resetTimer();

    // Agregar event listeners
    events.forEach((event) => {
      document.addEventListener(event, resetTimer);
    });

    // Cleanup
    return () => {
      const timer = localStorage.getItem("inactivityTimer");
      if (timer) {
        clearTimeout(parseInt(timer));
      }
      events.forEach((event) => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [resetTimer]);
};
