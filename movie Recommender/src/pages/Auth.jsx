import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, User, Lock, RefreshCw, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BACKEND_API = import.meta.env.VITE_BACKEND_URL;

const Auth = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedType, setSelectedType] = useState('random');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        avatar: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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

    const generateAvatar = (type = selectedType) => {
        let avatarUrl;
        const randomString = Math.random().toString(36).substring(7);

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
            default: // random type
                const randomGender = Math.random() < 0.5 ? 'boy' : 'girl';
                avatarUrl = `https://avatar.iran.liara.run/public/${randomGender}?username=${randomString}`;
        }

        setFormData(prev => ({ ...prev, avatar: avatarUrl }));
    };

    // Generate initial avatar when switching to registration
    useEffect(() => {
        if (!isLogin && !formData.avatar) {
            generateAvatar();
        }
    }, [isLogin]);

    // Generate new avatar when type changes
    useEffect(() => {
        if (!isLogin) {
            generateAvatar();
        }
    }, [selectedType]);

    const handleAvatarTypeSelect = (type) => {
        setSelectedType(type);
        setShowDropdown(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const endpoint = isLogin
            ? `${BACKEND_API}/api/v1/auth/login`
            : `${BACKEND_API}/api/v1/auth/register`;

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(isLogin ? {
                    email: formData.email,
                    password: formData.password
                } : formData),
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Authentication failed');
            }

            console.log('Success:', data);
            setError('');

            setTimeout(() => {
                navigate('/', { replace: true });
            }, 100);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    // Cleanup effect
    useEffect(() => {
        return () => {
            setFormData({ name: '', email: '', password: '', avatar: '' });
            setError('');
        };
    }, []);

    return (
        <main className="min-h-screen flex items-center justify-center">
            <img src="./hero-bg.png" alt="Hero BG" className="pattern absolute inset-0 object-cover" />
            <div className="wrapper relative z-10">
                <div className="max-w-md mx-auto w-full bg-opacity-80 backdrop-blur-sm p-8 rounded-lg">
                    <h1 className="text-4xl mb-8 font-bold text-center">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!isLogin && (
                            <>
                                <div className="flex flex-col items-center gap-4">
                                    <div className="relative">
                                        <img
                                            src={formData.avatar}
                                            alt="Profile Avatar"
                                            className="w-24 h-24 rounded-full"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => generateAvatar()}
                                            className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full hover:bg-purple-700 transition-colors"
                                            title="Generate new avatar"
                                        >
                                            <RefreshCw size={16} className="text-white" />
                                        </button>
                                    </div>
                                    <div className="relative w-full">
                                        <button
                                            type="button"
                                            onClick={() => setShowDropdown(!showDropdown)}
                                            className="w-full bg-dark-100 text-white px-4 py-2 rounded-lg flex items-center justify-between"
                                        >
                                            <span>{avatarTypes.find(t => t.id === selectedType)?.label}</span>
                                            <ChevronDown size={20} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                                        </button>
                                        {showDropdown && (
                                            <div className="absolute w-full mt-2 bg-dark-100 rounded-lg shadow-lg overflow-hidden z-50">
                                                {avatarTypes.map((type) => (
                                                    <button
                                                        key={type.id}
                                                        type="button"
                                                        onClick={() => handleAvatarTypeSelect(type.id)}
                                                        className="w-full px-4 py-2 text-left hover:bg-purple-600 text-white transition-colors"
                                                    >
                                                        {type.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Full Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-dark-100 text-white px-10 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                </div>
                            </>
                        )}

                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-dark-100 text-white px-10 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-dark-100 text-white px-10 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm text-center">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-light-200">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                                setFormData({ name: '', email: '', password: '', avatar: '' });
                            }}
                            className="text-purple-500 hover:text-purple-400 font-medium"
                        >
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </div>
        </main>
    );
};

export default Auth;