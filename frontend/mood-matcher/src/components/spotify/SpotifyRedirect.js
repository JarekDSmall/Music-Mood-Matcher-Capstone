import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SpotifyRedirect() {
    const navigate = useNavigate();
    const [token, setToken] = useState(null); // State variable to store the token

    useEffect(() => {
        if (!token) { // Only extract the token if it hasn't been extracted yet
            const urlParams = new URLSearchParams(window.location.search);
            const extractedToken = urlParams.get('token');
            setToken(extractedToken); // Store the token in the state variable
        }

        if (token) {
            localStorage.setItem('jwtToken', token);
            navigate('/dashboard');
        } else {
            console.error("Token not found in URL");
            navigate('/');
        }
    }, [token, navigate]); // Add token and navigate as dependencies

    return null;
}

export default SpotifyRedirect;
