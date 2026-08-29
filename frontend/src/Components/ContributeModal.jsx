import { useState } from "react";
import { X, IndianRupee, Plus, Minus } from "lucide-react";

export default function ContributeModal({ isOpen, onClose, goal, onContribute }) {
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("add"); // "add" | "withdraw"

  if (!isOpen || !goal) return null;

  const remaining = goal.target - goal.saved;
  const quickAmounts = [500, 1000, 2000, 5000];

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = Number(amount);
    if (!value || value <= 0) return;

    if (mode === "withdraw" && value > goal.saved) return;

    onContribute(goal.id, mode === "add" ? value : -value);

    setAmount("");
    setMode("add");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center px-0 sm:px-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      <div className="relative bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-2xl shadow-xl w-full sm:max-w-sm p-6 animate-slideUp sm:animate-scaleIn">
        {/* Drag handle on mobile */}
        <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              {goal.name}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              ₹{goal.saved.toLocaleString()} saved of ₹{goal.target.toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Add / Withdraw toggle */}
        <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-full mb-5">
          <button
            type="button"
            onClick={() => setMode("add")}
            className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-full text-sm font-medium transition-all ${
              mode === "add"
                ? "bg-green-600 text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
          <button
            type="button"
            onClick={() => setMode("withdraw")}
            className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-full text-sm font-medium transition-all ${
              mode === "withdraw"
                ? "bg-red-500 text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            <Minus className="w-3.5 h-3.5" /> Withdraw
          </button>
        </div>

        {/* Quick amounts */}
        <div className="flex gap-2 mb-4">
          {quickAmounts.map((qa) => (
            <button
              key={qa}
              type="button"
              onClick={() => setAmount(String(qa))}
              className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-all ${
                Number(amount) === qa
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400"
                  : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              ₹{qa.toLocaleString()}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
              {mode === "add" ? "Amount to add" : "Amount to withdraw"}
            </label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                min="1"
                max={mode === "withdraw" ? goal.saved : undefined}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            {mode === "add" && remaining > 0 && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                ₹{remaining.toLocaleString()} remaining to reach goal
              </p>
            )}
            {mode === "withdraw" && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Max: ₹{goal.saved.toLocaleString()}
              </p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full font-medium py-3 rounded-xl text-white transition-all duration-300 active:scale-95 hover:shadow-lg ${
              mode === "add"
                ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-green-200 dark:hover:shadow-green-900/40"
                : "bg-gradient-to-r from-red-500 to-rose-500 hover:shadow-red-200 dark:hover:shadow-red-900/40"
            }`}
          >
            {mode === "add" ? "Add Money" : "Withdraw Money"}
          </button>
        </form>
      </div>
    </div>
  );
}
