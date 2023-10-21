import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SpotifyRedirect() {
    const navigate = useNavigate();
    const [token, setToken] = useState(null); // State variable to store the token

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const extractedToken = urlParams.get('token');
        if (extractedToken) {
            localStorage.setItem('spotifyAuthToken', extractedToken);
            navigate('/dashboard');
        } else {
            console.error("Token not found in URL");
            navigate('/');
        }
    }, [navigate]);
     // Add token and navigate as dependencies

    return null;
}

export default SpotifyRedirect;
