import {useState} from "react";
import {X, IndianRupee, Tag, FileText, Calendar} from "lucide-react";

export default function AddExpenseModal({isOpen, onClose, onSubmit}) {
    const [type, setType] = useState("expense"); // "expense" | "income"
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [name, setName] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || !category || !name) return;

        onSubmit({
            id: Date.now(),
            name,
            category,
            amount: type === "expense" ? -Math.abs(Number(amount)) : Math.abs(Number(amount)),
            date: new Date(date).toLocaleDateString("en-IN", {month: "short", day: "numeric", year: "numeric"}),
        });

        // reset form
        setAmount("");
        setCategory("");
        setName("");
        setType("expense");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-semibold text-gray-800">Add Transaction</h2>
                    <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                        <X className="w-5 h-5 text-gray-500"/>
                    </button>
                </div>

                {/* Income / Expense toggle */}
                <div className="flex bg-gray-100 p-1 rounded-full mb-5">
                    <button
                        type="button"
                        onClick={() => setType("expense")}
                        className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
                            type === "expense" ? "bg-red-500 text-white shadow-sm" : "text-gray-600"
                        }`}
                    >
                        Expense
                    </button>
                    <button
                        type="button"
                        onClick={() => setType("income")}
                        className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
                            type === "income" ? "bg-green-600 text-white shadow-sm" : "text-gray-600"
                        }`}
                    >
                        Income
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Amount */}
                    <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">Amount</label>
                        <div className="relative">
                            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                required
                                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">Name / Note</label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Grocery shopping"
                                required
                                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">Category</label>
                        <div className="relative">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
                            <input
                                type="text"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="e.g. Food, Shopping, Rent"
                                required
                                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                    </div>

                    {/* Date */}
                    <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300 active:scale-95"
                    >
                        Add {type === "expense" ? "Expense" : "Income"}
                    </button>
                </form>
            </div>
        </div>
    );
}