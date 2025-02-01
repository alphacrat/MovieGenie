import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchUserProfile = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/v1/auth/me', {
                credentials: 'include',
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                navigate('/auth');
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            navigate('/auth');
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                setUser(null);
                navigate('/auth');
            }
        } catch (error) {
            console.error('Logout error:', error);
            setErrorMessage('Failed to logout');
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, [navigate]);

    return { user, errorMessage, handleLogout };
};
