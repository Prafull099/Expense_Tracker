import {useState} from "react";
import {
    ChevronLeft, 
    ChevronRight, 
    Wallet, 
    TrendingUp, 
    TrendingDown, 
    Sparkles, 
    RefreshCw, 
    Quote,
    Flame,
    ArrowUpRight
} from "lucide-react";
import TransactionItem from "./TransactionItem";
import BudgetProgress from "./BudgetProgress";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTHLY_BUDGET = 30000;

const FINANCIAL_QUOTES = [
    { quote: "Do not save what is left after spending, but spend what is left after saving.", author: "Warren Buffett", category: "Investing", tag: "💡 Golden Rule" },
    { quote: "A budget is telling your money where to go instead of wondering where it went.", author: "Dave Ramsey", category: "Budgeting", tag: "📊 Planning" },
    { quote: "Small leaks sink great ships. Keep track of every single micro-expense.", author: "Benjamin Franklin", category: "Discipline", tag: "🚢 Efficiency" },
    { quote: "It’s not how much money you make, but how much money you keep.", author: "Robert Kiyosaki", category: "Wealth", tag: "💰 Retention" },
    { quote: "Compound interest is the eighth wonder of the world. He who understands it, earns it.", author: "Albert Einstein", category: "Compounding", tag: "⚡ Exponential" },
    { quote: "Spend less than you make, invest the difference, and wait patiently.", author: "Naval Ravikant", category: "Freedom", tag: "🌱 Long-term" },
    { quote: "Financial peace is not the acquisition of stuff, it is the mastery of living on less.", author: "Morgan Housel", category: "Psychology", tag: "🧠 Mindset" },
    { quote: "The best investment you can ever make is in yourself and your daily financial habits.", author: "Charlie Munger", category: "Growth", tag: "🎯 Habit" }
];

export default function Home({transactions}) {
    const [monthIndex, setMonthIndex] = useState(new Date().getMonth());
    const [quoteIndex, setQuoteIndex] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const changeMonth = (delta) => {
        setMonthIndex((prev) => (prev + delta + 12) % 12);
    };

    const handleNextQuote = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setQuoteIndex((prev) => (prev + 1) % FINANCIAL_QUOTES.length);
            setIsRefreshing(false);
        }, 220);
    };

    const totalIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const balance = totalIncome - totalExpenses;

    const recentTransactions = transactions.slice(0, 4);
    const currentQuote = FINANCIAL_QUOTES[quoteIndex];

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header / Welcome Strip */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-1">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                        Financial Overview
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                            Live
                        </span>
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        Track live spending, cashflow &amp; budget goals effortlessly
                    </p>
                </div>

                {/* Sleek Month selector Pill with springy hover */}
                <div className="flex items-center gap-1.5 bg-white/60 dark:bg-gray-900/50 backdrop-blur-xl p-1.5 rounded-full border border-white/60 dark:border-white/10 shadow-sm hover:scale-[1.02] transition-transform duration-300">
                    <button 
                        onClick={() => changeMonth(-1)} 
                        className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-300 hover:scale-110 active:scale-95"
                        title="Previous Month"
                    >
                        <ChevronLeft className="w-4 h-4"/>
                    </button>
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200 w-24 text-center select-none tracking-wide">
                        {MONTHS[monthIndex]}
                    </span>
                    <button 
                        onClick={() => changeMonth(1)} 
                        className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-300 hover:scale-110 active:scale-95"
                        title="Next Month"
                    >
                        <ChevronRight className="w-4 h-4"/>
                    </button>
                </div>
            </div>

            {/* Interactive Daily Financial Quote Widget */}
            <div 
                onClick={handleNextQuote}
                className="group relative cursor-pointer overflow-hidden rounded-3xl p-6 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-pink-950/40 backdrop-blur-2xl border border-indigo-500/20 dark:border-white/10 shadow-xl shadow-indigo-950/5 dark:shadow-black/20 hover:border-indigo-500/40 hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.99]"
            >
                {/* Ambient glow in background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/20 to-purple-500/0 rounded-full blur-3xl pointer-events-none group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-black uppercase tracking-wider bg-white/70 dark:bg-white/10 text-indigo-600 dark:text-indigo-400 px-2.5 py-0.5 rounded-full border border-indigo-200/50 dark:border-indigo-800/40 flex items-center gap-1 shadow-sm">
                                <Sparkles className="w-3 h-3 animate-spin-slow" /> Daily Wisdom
                            </span>
                            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
                                {currentQuote.tag}
                            </span>
                        </div>

                        <div className={`transition-all duration-200 ${isRefreshing ? "opacity-0 scale-[0.98]" : "opacity-100 scale-100"}`}>
                            <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-white leading-snug italic">
                                &ldquo;{currentQuote.quote}&rdquo;
                            </p>
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">
                                — {currentQuote.author} <span className="text-[10px] opacity-60">({currentQuote.category})</span>
                            </p>
                        </div>
                    </div>

                    {/* Refresh Button on click */}
                    <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 group-hover:underline hidden md:inline">
                            Tap to refresh
                        </span>
                        <div className="p-3 rounded-2xl bg-white/80 dark:bg-gray-800/80 shadow-md group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 group-hover:scale-110">
                            <RefreshCw className={`w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-transform duration-500 ${isRefreshing ? "rotate-180" : ""}`} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Cards with Hover Lift */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Total Balance Card */}
                <div className="group bg-white/60 dark:bg-gray-900/50 backdrop-blur-2xl rounded-3xl p-6 border border-white/60 dark:border-white/10 shadow-xl shadow-indigo-950/5 dark:shadow-black/20 hover:border-indigo-500/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Total Balance
                        </span>
                        <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                            <Wallet className="w-5 h-5"/>
                        </div>
                    </div>
                    <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                        ₹{balance.toLocaleString()}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-200/50 dark:border-indigo-800/40">
                            <Flame className="w-3 h-3 text-orange-500" /> Active Funds
                        </span>
                        <span className="text-[11px] font-bold text-gray-400">Updated now</span>
                    </div>
                </div>

                {/* Total Income Card */}
                <div className="group bg-white/60 dark:bg-gray-900/50 backdrop-blur-2xl rounded-3xl p-6 border border-white/60 dark:border-white/10 shadow-xl shadow-indigo-950/5 dark:shadow-black/20 hover:border-emerald-500/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Total Income
                        </span>
                        <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm">
                            <TrendingUp className="w-5 h-5"/>
                        </div>
                    </div>
                    <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                        ₹{totalIncome.toLocaleString()}
                    </p>
                    <span className="inline-block text-[11px] font-medium text-gray-500 dark:text-gray-400 mt-2">
                        Incoming this month
                    </span>
                </div>

                {/* Total Expenses Card */}
                <div className="group bg-white/60 dark:bg-gray-900/50 backdrop-blur-2xl rounded-3xl p-6 border border-white/60 dark:border-white/10 shadow-xl shadow-indigo-950/5 dark:shadow-black/20 hover:border-pink-500/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Total Expenses
                        </span>
                        <div className="p-3 rounded-2xl bg-pink-500/10 text-pink-600 dark:text-pink-400 group-hover:scale-110 group-hover:bg-pink-600 group-hover:text-white transition-all duration-300 shadow-sm">
                            <TrendingDown className="w-5 h-5"/>
                        </div>
                    </div>
                    <p className="text-3xl font-black text-pink-600 dark:text-pink-400 tracking-tight">
                        ₹{totalExpenses.toLocaleString()}
                    </p>
                    <span className="inline-block text-[11px] font-medium text-gray-500 dark:text-gray-400 mt-2">
                        Spent this month
                    </span>
                </div>
            </div>

            {/* Budget Progress */}
            <div className="bg-white/60 dark:bg-gray-900/50 backdrop-blur-2xl rounded-3xl p-6 border border-white/60 dark:border-white/10 shadow-xl shadow-indigo-950/5 dark:shadow-black/20 hover:border-indigo-500/30 transition-all duration-300">
                <BudgetProgress spent={totalExpenses} budget={MONTHLY_BUDGET}/>
            </div>

            {/* Recent Transactions Section */}
            <div className="bg-white/60 dark:bg-gray-900/50 backdrop-blur-2xl rounded-3xl p-6 border border-white/60 dark:border-white/10 shadow-xl shadow-indigo-950/5 dark:shadow-black/20">
                <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/10">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Transactions</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Latest activity on your account</p>
                    </div>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 rounded-full border border-indigo-200/50 dark:border-indigo-800/40">
                        {transactions.length} total
                    </span>
                </div>
                <div className="pt-2 divide-y divide-black/5 dark:divide-white/5">
                    {recentTransactions.length === 0 ? (
                        <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-10">
                            No transactions recorded yet. Click &quot;Add Expense&quot; above to get started!
                        </p>
                    ) : (
                        recentTransactions.map((t) => <TransactionItem key={t.id} transaction={t}/>)
                    )}
                </div>
            </div>
        </div>
    );
}

