import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SpotifyRedirect() {
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            // Send the code to the backend to get the JWT token
            fetch('http://localhost:5000/spotify/callback', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                const token = data.token;
                if (token) {
                    localStorage.setItem('spotifyAuthToken', token);
                    navigate('/dashboard');
                } else {
                    console.error("Token not received from backend");
                    navigate('/');
                }
            })
            .catch(error => {
                console.error("Error fetching token from backend:", error);
                navigate('/');
            });
        } else {
            console.error("Code not found in URL");
            navigate('/');
        }
    }, [navigate]);

    return null;
}


export default SpotifyRedirect;
