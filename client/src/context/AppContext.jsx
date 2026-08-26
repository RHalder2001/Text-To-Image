import { createContext, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext()

const AppContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false)
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [credit, setCredit] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const navigate = useNavigate()

  
  const loadCreditsData = useCallback(async () => {
    try {
      const headers = token ? { token } : {};
      const { data } = await axios.get(
        backendUrl + 'api/user/credits',
        { headers }
      );

      if (data.success) {
        setCredit(data.credits);
        setUser(data.user);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      
      if (errorMessage === 'invalid signature' || 
          errorMessage.includes('jwt') ||
          errorMessage === 'Not Authorized. Login Again' ||
          error.response?.status === 401) {
        localStorage.removeItem('token');
        setToken('');
        setUser(null);
        toast.error('Session expired. Please login again.');
      } else {
        toast.error(errorMessage);
      }
    }
  }, [token, backendUrl]);

  const buyCredits = useCallback(async (credits) => {
    if (!token) {
      setShowLogin(true);
      return false;
    }

    try {
      const { data } = await axios.post(
        backendUrl + 'api/user/buy-credits',
        { credits },
        { headers: { token } }
      );

      if (data.success) {
        setCredit(data.creditBalance);
        setUser(data.user);
        toast.success(data.message || 'Credits added successfully');
        return true;
      }

      toast.error(data.message || 'Unable to add credits');
      return false;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
      return false;
    }
  }, [token, backendUrl]);

  //for imageImage generation 
  const generateImage = async (prompt) => {
  try {
    if (credit !== false && credit <= 0) {
      navigate('/buy');
      toast.warning('You have no credits left. Buy more credits to continue.');
      return null;
    }

    const headers = token ? { token } : {};
    const { data } = await axios.post(
      backendUrl + 'api/image/generate-image',
      { prompt },
      { headers }
    );

    if (data.success) {
      loadCreditsData();
      return data.resultImage;
    } else {
      toast.error(data.message);
       loadCreditsData();
       if(data.creditBalance ===0){
        navigate('/buy')
       }
    }

  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    
    if (errorMessage === 'invalid signature' || 
        errorMessage.includes('jwt') ||
        errorMessage === 'Not Authorized. Login Again' ||
        error.response?.status === 401) {
      localStorage.removeItem('token');
      setToken('');
      setUser(null);
      toast.error('Session expired. Please login again.');
    } else {
      toast.error(errorMessage);
    }
  }
};

  //for logout
  const logout = () => {
  localStorage.removeItem('token');
  setToken('');
  setUser(null);
};


  useEffect(() => {
    if (token && token.trim() !== '') {
      loadCreditsData();
    }
  }, [token, loadCreditsData]);



  const value = {
    user,
    setUser,
    showLogin,
    setShowLogin,
    backendUrl,
    token,
    setToken,
    credit,
    setCredit,
    loadCreditsData,
    buyCredits,
    logout,
    generateImage
  }

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppContextProvider