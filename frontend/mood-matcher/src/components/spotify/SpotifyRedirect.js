import { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';

function SpotifyRedirect() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isTokenProcessed, setIsTokenProcessed] = useState(false);
    const urlParams = new URLSearchParams(location.search);
    const { loginWithSpotifyToken } = useContext(AuthContext);

    useEffect(() => {
        console.log("SpotifyRedirect useEffect triggered");
        if (!isTokenProcessed) {
            const urlParams = new URLSearchParams(window.location.search);
            const rawToken = urlParams.get('token');
            const token = rawToken ? rawToken.trim() : null;

            console.log("Extracted Token:", token);

            if (token) {
                localStorage.setItem('spotifyAccessToken', token);
                loginWithSpotifyToken(token);
                setIsTokenProcessed(true);
                console.log("Navigating to /spotify");
                navigate('/spotify', { replace: true });  // Redirect to SpotifyPage with URL cleanup
            } else {
                console.error("Token not found in URL");
                console.log("Navigating to /");
                navigate('/');
            }
        }
    }, [navigate, isTokenProcessed, loginWithSpotifyToken]);

    // Fallback redirect mechanism
    useEffect(() => {
        const tokenInLocalStorage = localStorage.getItem('spotifyAccessToken');
        if (tokenInLocalStorage && location.pathname !== '/spotify') {
            console.log("Fallback redirect to /spotify");
            navigate('/spotify');
        }
    }, [navigate, location.pathname]);

    return null;
}

export default SpotifyRedirect;
