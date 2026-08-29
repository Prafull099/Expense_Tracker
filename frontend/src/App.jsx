import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "./config/api";
import Navbar from "./Components/Navbar";

import Footer from "./Components/Footer";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Analytics from "./Components/Analytics";
import Savings from "./Components/Savings";
import AddExpenseModal from "./Components/AddExpenseModal";

function App() {
    const [activeTab, setActiveTab] = useState("Home");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    
    // User-scoped transactions and savings goals
    const [transactions, setTransactions] = useState([]);
    const [savingsGoals, setSavingsGoals] = useState([]);

    // Dark mode state initialized from user preferences
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark" || 
               (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
    });

    // Load user-specific transactions & savings goals whenever user changes
    useEffect(() => {
        if (user && user.email) {
            const userTxKey = `expense_transactions_${user.email}`;
            const userGoalsKey = `expense_savings_goals_${user.email}`;

            const storedTx = localStorage.getItem(userTxKey);
            const storedGoals = localStorage.getItem(userGoalsKey);

            setTransactions(storedTx ? JSON.parse(storedTx) : []);
            setSavingsGoals(storedGoals ? JSON.parse(storedGoals) : []);
        } else {
            setTransactions([]);
            setSavingsGoals([]);
        }
    }, [user]);

    // Apply dark mode theme
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    const handleAddExpense = () => setIsModalOpen(true);

    const handleAddTransaction = (newTransaction) => {
        if (!user || !user.email) return;
        const userTxKey = `expense_transactions_${user.email}`;
        setTransactions((prev) => {
            const updated = [{ ...newTransaction, id: Date.now() }, ...prev];
            localStorage.setItem(userTxKey, JSON.stringify(updated));
            return updated;
        });
    };

    // Savings handlers
    const handleAddGoal = (newGoal) => {
        if (!user || !user.email) return;
        const userGoalsKey = `expense_savings_goals_${user.email}`;
        setSavingsGoals((prev) => {
            const updated = [...prev, { ...newGoal, id: Date.now(), saved: 0 }];
            localStorage.setItem(userGoalsKey, JSON.stringify(updated));
            return updated;
        });
    };

    const handleContributeGoal = (goalId, amount) => {
        if (!user || !user.email) return;
        const userGoalsKey = `expense_savings_goals_${user.email}`;
        setSavingsGoals((prev) => {
            const updated = prev.map((g) =>
                g.id === goalId ? { ...g, saved: g.saved + Number(amount) } : g
            );
            localStorage.setItem(userGoalsKey, JSON.stringify(updated));
            return updated;
        });
    };

    const handleDeleteGoal = (goalId) => {
        if (!user || !user.email) return;
        const userGoalsKey = `expense_savings_goals_${user.email}`;
        setSavingsGoals((prev) => {
            const updated = prev.filter((g) => g.id !== goalId);
            localStorage.setItem(userGoalsKey, JSON.stringify(updated));
            return updated;
        });
    };


    // Handle initial auth & OAuth2 callback redirect
    useEffect(() => {
        const checkAuth = async () => {
            const params = new URLSearchParams(window.location.search);
            const token = params.get("token");

            if (token) {
                localStorage.setItem("token", token);
                window.history.replaceState({}, document.title, window.location.pathname);
            }

            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                try {
                    const response = await axios.get(`${API_BASE_URL}/auth/me`, {
                        headers: {
                            Authorization: `Bearer ${storedToken}`
                        }
                    });

                    setUser({
                        name: response.data.name || response.data.username,
                        email: response.data.email,
                        provider: response.data.provider
                    });
                } catch (error) {
                    console.error("Auth check failed:", error);
                    localStorage.removeItem("token");
                }
            } else {
                const storedGuest = localStorage.getItem("expense_user");
                if (storedGuest) {
                    setUser(JSON.parse(storedGuest));
                }
            }
            setAuthLoading(false);
        };

        checkAuth();
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("expense_user");
        setUser(null);
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900">
                <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <div className="min-h-screen flex flex-col relative overflow-x-hidden text-gray-900 dark:text-gray-100 bg-slate-50 dark:bg-gray-950 transition-colors duration-500">
            {/* Fixed Ambient Background Image: subtle in light, glowing in dark */}
            <div 
                className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none z-0 transition-opacity duration-700 opacity-20 dark:opacity-45 scale-105"
                style={{ backgroundImage: "url('/finance_abstract_bg.jpg')" }}
            />
            {/* Ambient Gradients for Light and Dark */}
            <div className="fixed inset-0 bg-gradient-to-br from-indigo-50/80 via-white/85 to-purple-50/80 dark:from-gray-950/90 dark:via-gray-950/95 dark:to-indigo-950/90 backdrop-blur-2xl pointer-events-none z-0 transition-colors duration-500" />
            
            {/* Vibrant Light / Glowing Dark Orbs */}
            <div className="fixed -top-24 -left-24 w-96 h-96 bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none z-0" />
            <div className="fixed bottom-0 -right-24 w-96 h-96 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none z-0" />
            <div className="fixed top-1/2 left-1/3 w-72 h-72 bg-pink-300/15 dark:bg-pink-500/5 rounded-full blur-3xl pointer-events-none z-0" />

            <div className="relative z-10 flex flex-col min-h-screen">

                <Navbar 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                    onAddExpense={handleAddExpense} 
                    user={user} 
                    onLogout={handleLogout}
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                />

                <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 w-full animate-fadeIn">
                    {activeTab === "Home" && <Home transactions={transactions}/>}
                    {activeTab === "Analytics" && <Analytics transactions={transactions}/>}
                    {activeTab === "Savings" && (
                        <Savings 
                            savingsGoals={savingsGoals}
                            onAddGoal={handleAddGoal}
                            onContribute={handleContributeGoal}
                            onDeleteGoal={handleDeleteGoal}
                        />
                    )}
                </main>

                <Footer setActiveTab={setActiveTab}/>
            </div>

            <AddExpenseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddTransaction}
            />
        </div>
    );
}

export default App;