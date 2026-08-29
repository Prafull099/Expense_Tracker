import {Target} from "lucide-react";

export default function BudgetProgress({spent, budget}) {
    const percent = Math.min((spent / budget) * 100, 100);
    const isOverBudget = spent > budget;
    const remaining = budget - spent;

    const barColor = isOverBudget
        ? "bg-gradient-to-r from-red-500 to-rose-500"
        : percent > 75
            ? "bg-gradient-to-r from-amber-400 to-amber-500"
            : "bg-gradient-to-r from-indigo-500 to-purple-500";

    return (
        <div className="w-full space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-sm">
                    <Target className="w-4 h-4 text-indigo-500 dark:text-indigo-400"/>
                    Monthly Budget
                </div>
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                    ₹{spent.toLocaleString()} / ₹{budget.toLocaleString()}
                </span>
            </div>

            <div className="w-full h-2.5 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden p-0.5">
                <div
                    className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                    style={{width: `${percent}%`}}
                />
            </div>

            <p className={`text-xs ${isOverBudget ? "text-red-500 dark:text-red-400 font-semibold" : "text-gray-500 dark:text-gray-400"}`}>
                {isOverBudget
                    ? `You've exceeded your monthly budget by ₹${Math.abs(remaining).toLocaleString()}`
                    : `₹${remaining.toLocaleString()} safe to spend this month (${(100 - percent).toFixed(0)}% remaining)`}
            </p>
        </div>
    );
}