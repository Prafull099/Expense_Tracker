import {Wallet, Mail} from "lucide-react";

export default function Footer({setActiveTab}) {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-white/10 dark:bg-gray-950/20 backdrop-blur-xl border-t border-white/20 dark:border-white/5 mt-16">
            <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-1.5 rounded-xl text-white shadow-md shadow-indigo-500/20">
                        <Wallet className="w-4 h-4"/>
                    </div>
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200 tracking-tight">ExpenseTracker</span>
                </div>

                <div className="flex items-center gap-6 text-xs font-semibold text-gray-600 dark:text-gray-400">
                    <button onClick={() => setActiveTab("Home")} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        Home
                    </button>
                    <button onClick={() => setActiveTab("Analytics")} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        Analytics
                    </button>
                    <button onClick={() => setActiveTab("Savings")} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        Savings
                    </button>
                </div>

                <a
                    href="mailto:support@expensetracker.com"
                    className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                    <Mail className="w-3.5 h-3.5"/>
                    support@expensetracker.com
                </a>
            </div>

            <div className="text-center text-[11px] text-gray-400 dark:text-gray-500 pb-6">
                © {year} ExpenseTracker • All rights reserved.
            </div>
        </footer>
    );
}