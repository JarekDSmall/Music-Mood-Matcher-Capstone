import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ProcessToken() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      // Save the token (e.g., in local storage or context)
      localStorage.setItem('jwtToken', token);

      // Redirect the user to the dashboard or another page
      navigate('/dashboard');
    } else {
      // Handle error: token not found
      navigate('/login');
    }
  }, [navigate]);

  return null; // This component doesn't render anything
}

export default ProcessToken;
