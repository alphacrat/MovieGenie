import { useState, useRef, useEffect } from 'react';

const BACKEND_API = import.meta.env.VITE_BACKEND_URL


export const useNavbar = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isNavOpen, setNavOpen] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [userAvatar, setUserAvatar] = useState('');
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [selectedType, setSelectedType] = useState('random');
    const [showTypeDropdown, setShowTypeDropdown] = useState(false);
    const [previewAvatar, setPreviewAvatar] = useState('');
    const dropdownRef = useRef(null);

    const avatarTypes = [
        { id: 'random', label: 'Random Avatar' },
        { id: 'boy', label: 'Male Avatar' },
        { id: 'girl', label: 'Female Avatar' },
        { id: 'job', label: 'Job Avatar' }
    ];

    const jobTitles = [
        'doctor', 'police', 'teacher', 'engineer',
        'chef', 'artist', 'firefighter', 'pilot'
    ];

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`${BACKEND_API}/api/v1/auth/me`, {
                    credentials: 'include',
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUserEmail(userData.email);
                    setUserAvatar(userData.avatar);
                    setPreviewAvatar(userData.avatar);
                } else {
                    console.error('Failed to fetch user details');
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails();
    }, []);

    const generateAvatar = (type = selectedType) => {
        const randomString = Math.random().toString(36).substring(7);
        let avatarUrl;

        switch (type) {
            case 'boy':
                avatarUrl = `https://avatar.iran.liara.run/public/boy?username=${randomString}`;
                break;
            case 'girl':
                avatarUrl = `https://avatar.iran.liara.run/public/girl?username=${randomString}`;
                break;
            case 'job':
                const randomJob = jobTitles[Math.floor(Math.random() * jobTitles.length)];
                const gender = Math.random() < 0.5 ? 'male' : 'female';
                avatarUrl = `https://avatar.iran.liara.run/public/job/${randomJob}/${gender}`;
                break;
            default:
                const randomGender = Math.random() < 0.5 ? 'boy' : 'girl';
                avatarUrl = `https://avatar.iran.liara.run/public/${randomGender}?username=${randomString}`;
        }

        return avatarUrl;
    };

    const handleUpdateAvatar = async () => {
        try {
            const response = await fetch(`${BACKEND_API}/api/v1/auth/updateAvatar`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ avatar: previewAvatar }),
            });

            if (response.ok) {
                setUserAvatar(previewAvatar);
                setShowAvatarModal(false);
            } else {
                await refreshUserDetails();
            }
        } catch (error) {
            console.error('Error updating avatar:', error);
            await refreshUserDetails();
        }
    };

    const refreshUserDetails = async () => {
        const response = await fetch(`${BACKEND_API}/api/v1/auth/me`, {
            credentials: 'include',
        });
        if (response.ok) {
            const userData = await response.json();
            setUserAvatar(userData.avatar);
            setPreviewAvatar(userData.avatar);
        }
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch(`${BACKEND_API}/api/v1/auth/logout`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                window.location.href = '#/auth';
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return {
        isDropdownOpen,
        setDropdownOpen,
        isNavOpen,
        setNavOpen,
        userEmail,
        userAvatar,
        showAvatarModal,
        setShowAvatarModal,
        selectedType,
        setSelectedType,
        showTypeDropdown,
        setShowTypeDropdown,
        previewAvatar,
        setPreviewAvatar,
        dropdownRef,
        avatarTypes,
        generateAvatar,
        handleUpdateAvatar,
        handleLogout
    };
};