import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiConfig from '../../apiconfig/apiConfig';

export default function AuthWarning() {
  const [searchParams] = useSearchParams();
  const [mounted, setMounted] = useState(false); 
  const message = searchParams.get('message');
  const email = searchParams.get('email');
  const redirectTo = searchParams.get('redirectTo') || `${apiConfig.baseURL}/auth/google`;

  useEffect(() => {
    setMounted(true); // Triggered once DOM is ready
  }, []);

  useEffect(() => {
    if (mounted && message) {
      const fullMessage = email 
        ? `${message}: ${email}. Please try another account.`
        : message;

      toast.warning(fullMessage, {
        onClose: () => {
          window.location.href = redirectTo;
        }
      });
    }

    if (mounted && !message) {
      window.location.href = redirectTo;
    }
  }, [mounted, message, email, redirectTo]);

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </>
  );
}
