import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiConfig from '../../apiconfig/apiConfig';

export default function AuthWarning() {
  const [searchParams] = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const message = searchParams.get('message') || searchParams.get('error');
  const email = searchParams.get('email');
  const userId = searchParams.get('userId'); 
  const redirectTo = searchParams.get('redirectTo') || `${apiConfig.baseURL}/api/auth/google?userId=${userId}`;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
   
      const fullMessage = message
        ? email
          ? `${message}: ${email}. Please try another account.`
          : message
        : "Authentication failed. Redirecting...";

      toast.warning(fullMessage, {
        autoClose: 4000,
        onClose: () => {
          window.location.href = redirectTo;
        },
      });
    }
  }, [mounted, message, email, userId, redirectTo]);

  return (
    <ToastContainer
      position="top-center"
      autoClose={4000}
      hideProgressBar={false}
      closeOnClick
      pauseOnHover
      draggable
      theme="colored"
    />
  );
}
