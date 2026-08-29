import {useState} from "react";
import {Plus, User, Wallet, Bell, ChevronDown, LogOut, Settings, Sun, Moon, Sparkles} from "lucide-react";

const TABS = ["Home", "Analytics", "Savings"];

export default function Navbar({activeTab, setActiveTab, onAddExpense, user, onLogout, darkMode, setDarkMode}) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [hasNotifications] = useState(true);

    const getInitials = (name) => {
        if (!name) return "U";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/30 dark:bg-gray-950/40 backdrop-blur-2xl border-b border-white/30 dark:border-white/5 px-6 sm:px-10 py-5 sm:py-6 transition-all duration-300 shadow-sm">
            <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
                {/* Logo with pulse & float animation */}
                <div 
                    onClick={() => setActiveTab("Home")}
                    className="flex items-center gap-3.5 group cursor-pointer select-none"
                >
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-2xl blur-md opacity-40 group-hover:opacity-75 transition-opacity duration-300 animate-pulseGlow" />
                        <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-3 rounded-2xl shadow-xl shadow-indigo-500/25 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                            <Wallet className="w-5 h-5 text-white"/>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-300 dark:to-pink-400 bg-clip-text text-transparent tracking-tight">
                            ExpenseTracker
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5 text-indigo-500 animate-spin-slow" /> Finance OS
                        </span>
                    </div>
                </div>

                {/* Nav tabs - Taller, polished pill with glass container */}
                <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 backdrop-blur-xl p-1.5 rounded-full border border-black/5 dark:border-white/10 shadow-inner">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`relative px-5 sm:px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                                activeTab === tab
                                    ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-indigo-500/35 scale-[1.03]"
                                    : "text-gray-600 dark:text-gray-300 hover:text-gray-950 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5 hover:scale-[1.01]"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Right side controls */}
                <div className="flex items-center gap-3">
                    {/* Dark Mode Toggle */}
                    <button 
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-3 rounded-full hover:bg-white/50 dark:hover:bg-white/10 transition-all text-gray-700 dark:text-gray-200 border border-transparent hover:border-white/30 hover:scale-110 active:scale-95 shadow-sm"
                        title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {darkMode ? <Sun className="w-4.5 h-4.5 text-amber-400 animate-spin-slow" /> : <Moon className="w-4.5 h-4.5 text-indigo-600" />}
                    </button>

                    <button className="relative p-3 rounded-full hover:bg-white/50 dark:hover:bg-white/10 transition-all text-gray-700 dark:text-gray-200 hover:scale-110 active:scale-95">
                        <Bell className="w-4.5 h-4.5"/>
                        {hasNotifications && (
                            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-pink-500 rounded-full ring-2 ring-white dark:ring-gray-950 animate-pulse"/>
                        )}
                    </button>

                    <button
                        onClick={onAddExpense}
                        className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-500 hover:to-pink-400 text-white text-xs font-bold px-5 py-3 rounded-full shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                        <Plus className="w-4 h-4"/>
                        Add Expense
                    </button>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-white/50 dark:hover:bg-white/10 transition-all border border-black/5 dark:border-white/10 hover:scale-105 active:scale-95"
                        >
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-xs font-black text-white shadow-md shadow-indigo-500/20">
                                {getInitials(user?.name)}
                            </div>
                            <span className="text-xs font-bold text-gray-800 dark:text-gray-200 max-w-[90px] truncate hidden md:inline">
                                {user?.name?.split(" ")[0]}
                            </span>
                            <ChevronDown className={`w-3.5 h-3.5 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${showDropdown ? "rotate-180" : ""}`}/>
                        </button>

                        {showDropdown && (
                            <div className="absolute right-0 mt-3 w-64 bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-black/5 dark:border-white/10 p-2.5 z-50 animate-fadeIn">
                                <div className="px-3.5 py-3 border-b border-black/5 dark:border-white/10 mb-2">
                                    <p className="text-sm font-extrabold text-gray-900 dark:text-white truncate">{user?.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                                    {user?.provider && user?.provider !== "LOCAL" && (
                                        <span className="inline-block mt-2 text-[10px] bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-extrabold px-2.5 py-0.5 rounded-full uppercase border border-indigo-200 dark:border-indigo-800/50">
                                            {user.provider} Auth
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => setShowDropdown(false)}
                                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                >
                                    <Settings className="w-4 h-4 text-gray-500"/> Settings
                                </button>
                                <button
                                    onClick={() => {
                                        setShowDropdown(false);
                                        onLogout();
                                    }}
                                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                >
                                    <LogOut className="w-4 h-4"/> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

