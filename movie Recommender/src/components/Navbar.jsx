import React from 'react';
import { User, LogOut, RefreshCw, ChevronDown } from 'lucide-react';
import { useNavbar } from '../hooks/useNavbar';

export default function Navbar() {
    const {
        isDropdownOpen,
        setDropdownOpen,
        isNavOpen,
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
    } = useNavbar();

    return (
        <>
            <nav className="bg-white border-gray-700 dark:bg-gray-900 rounded-full border">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    {/* Logo */}
                    <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src="./logo.png" className="h-10 w-10 rounded-full" alt="logo" />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">MovieGenie</span>
                    </a>

                    {/* User Menu and Mobile Toggle */}
                    <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!isDropdownOpen)}
                            className=""
                        >
                            <img
                                className="w-12 h-12 rounded-full -ml-3 -mt-1"
                                src={userAvatar}
                                alt="user photo"
                            />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow-lg dark:bg-gray-700 dark:divide-gray-600">
                                <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    <div className="font-medium truncate">{userEmail}</div>
                                </div>
                                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                    <li>
                                        <button
                                            onClick={() => {
                                                setShowAvatarModal(true);
                                                setDropdownOpen(false);
                                            }}
                                            className="w-full text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                        >
                                            <div className="flex items-center">
                                                <User className="mr-2 h-4 w-4" />
                                                Change Avatar
                                            </div>
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                        >
                                            <div className="flex items-center">
                                                <LogOut className="mr-2 h-4 w-4" />
                                                Logout
                                            </div>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Navigation Menu */}
                    <div className={`${isNavOpen ? "block" : "hidden"} md:flex md:w-auto md:order-1 mr-24`} id="navbar-user">
                        <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                            {["Home", "About", "Favorites"].map((item, index) => (
                                <li key={index}>
                                    <a
                                        href={item.toLowerCase() === 'home' ? '/' : `#/${item.toLowerCase()}`}
                                        className={`block py-2 px-3 rounded-sm ${window.location.pathname === (item.toLowerCase() === 'home' ? '/' : `#/${item.toLowerCase()}`)
                                            ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:dark:text-blue-500"
                                            : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                                            }`}
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Avatar Change Modal */}
            {showAvatarModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4 dark:text-white">Change Avatar</h3>

                        <div className="flex flex-col items-center gap-4">
                            <div className="relative">
                                <img
                                    src={previewAvatar}
                                    alt="Profile Avatar"
                                    className="w-48 h-48 rounded-full"
                                />
                                <button
                                    onClick={() => setPreviewAvatar(generateAvatar())}
                                    className="absolute -bottom-2 -right-2 bg-purple-600 p-3 rounded-full hover:bg-purple-700 transition-colors"
                                    title="Generate new avatar"
                                >
                                    <RefreshCw size={24} className="text-white" />
                                </button>
                            </div>

                            <div className="relative w-full">
                                <button
                                    onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                                    className="w-full bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg flex items-center justify-between"
                                >
                                    <span className="dark:text-white">
                                        {avatarTypes.find(t => t.id === selectedType)?.label}
                                    </span>
                                    <ChevronDown size={20} className={`transition-transform ${showTypeDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                {showTypeDropdown && (
                                    <div className="absolute w-full mt-2 bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden z-50">
                                        {avatarTypes.map((type) => (
                                            <button
                                                key={type.id}
                                                onClick={() => {
                                                    setSelectedType(type.id);
                                                    setShowTypeDropdown(false);
                                                    setPreviewAvatar(generateAvatar(type.id));
                                                }}
                                                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white transition-colors"
                                            >
                                                {type.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end mt-6 gap-2">
                            <button
                                onClick={() => {
                                    setShowAvatarModal(false);
                                    setPreviewAvatar(userAvatar);
                                }}
                                className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateAvatar}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                Update Avatar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}