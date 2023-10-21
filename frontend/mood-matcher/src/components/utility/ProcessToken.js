import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ProcessToken() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
        localStorage.setItem('spotifyAuthToken', token);
        navigate('/dashboard');
    } else {
        navigate('/login');
    }
}, [navigate]);

  return null; // This component doesn't render anything
}

export default ProcessToken;
