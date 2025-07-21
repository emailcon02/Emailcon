import React, { useEffect } from 'react';
import RoutesPage from './pages/Routes/RoutesPage';
import { ToastContainer } from "react-toastify";
import './App.css';

function App() {
  useEffect(() => {
    const handleCopy = (e) => {
      e.preventDefault(); // Block copying text
      console.log("Copy blocked!");
    };

    document.addEventListener("copy", handleCopy);

    return () => {
      document.removeEventListener("copy", handleCopy);
    };
  }, []);

  return (
    <>
      <RoutesPage />
      <ToastContainer
        className="custom-toast"
        position="bottom-center"
        autoClose={2000}
        hideProgressBar={true}
        closeOnClick={false}
        closeButton={false}
        pauseOnHover={true}
        draggable={true}
        theme="light"
      />
    </>
  );
}

export default App;
