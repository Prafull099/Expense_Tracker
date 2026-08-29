import {ShoppingBag, Utensils, Car, Home, Zap, MoreHorizontal} from "lucide-react";

const CATEGORY_ICONS = {
    Shopping: ShoppingBag,
    Food: Utensils,
    Transport: Car,
    Rent: Home,
    Utilities: Zap,
};

export default function TransactionItem({transaction}) {
    const Icon = CATEGORY_ICONS[transaction.category] || MoreHorizontal;
    const isExpense = transaction.amount < 0;

    return (
        <div className="flex items-center justify-between py-3.5 px-3 hover:bg-black/5 dark:hover:bg-white/5 rounded-2xl transition-colors duration-200">
            <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 dark:bg-indigo-400/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400"/>
                </div>
                <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white leading-snug">{transaction.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.category}</p>
                </div>
            </div>
            <div className="text-right">
                <p className={`text-sm font-bold tracking-tight ${isExpense ? "text-pink-600 dark:text-pink-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                    {isExpense ? "-" : "+"}₹{Math.abs(transaction.amount).toLocaleString()}
                </p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500">{transaction.date}</p>
            </div>
        </div>
    );
}