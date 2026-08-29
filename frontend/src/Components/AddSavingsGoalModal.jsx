import { useState } from "react";
import {
  X,
  IndianRupee,
  FileText,
  Calendar,
  Plane,
  Home,
  Car,
  GraduationCap,
  ShieldCheck,
  Gift,
  Smartphone,
  Gem,
  Palette,
} from "lucide-react";

const ICONS = [
  { icon: Plane, label: "Travel", key: "Plane" },
  { icon: Home, label: "Home", key: "Home" },
  { icon: Car, label: "Car", key: "Car" },
  { icon: GraduationCap, label: "Education", key: "GraduationCap" },
  { icon: ShieldCheck, label: "Emergency", key: "ShieldCheck" },
  { icon: Gift, label: "Gift", key: "Gift" },
  { icon: Smartphone, label: "Gadget", key: "Smartphone" },
  { icon: Gem, label: "Luxury", key: "Gem" },
  { icon: Palette, label: "Hobby", key: "Palette" },
];

const COLORS = [
  { name: "Indigo", from: "from-indigo-500", to: "to-purple-500", bg: "bg-indigo-50 dark:bg-indigo-900/20", text: "text-indigo-600 dark:text-indigo-400", ring: "ring-indigo-300" },
  { name: "Emerald", from: "from-emerald-500", to: "to-teal-500", bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-600 dark:text-emerald-400", ring: "ring-emerald-300" },
  { name: "Rose", from: "from-rose-500", to: "to-pink-500", bg: "bg-rose-50 dark:bg-rose-900/20", text: "text-rose-600 dark:text-rose-400", ring: "ring-rose-300" },
  { name: "Amber", from: "from-amber-500", to: "to-orange-500", bg: "bg-amber-50 dark:bg-amber-900/20", text: "text-amber-600 dark:text-amber-400", ring: "ring-amber-300" },
  { name: "Sky", from: "from-sky-500", to: "to-cyan-500", bg: "bg-sky-50 dark:bg-sky-900/20", text: "text-sky-600 dark:text-sky-400", ring: "ring-sky-300" },
  { name: "Violet", from: "from-violet-500", to: "to-fuchsia-500", bg: "bg-violet-50 dark:bg-violet-900/20", text: "text-violet-600 dark:text-violet-400", ring: "ring-violet-300" },
];

export { ICONS, COLORS };

export default function AddSavingsGoalModal({ isOpen, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("Plane");
  const [selectedColor, setSelectedColor] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !target) return;

    onSubmit({
      id: Date.now(),
      name,
      target: Number(target),
      saved: 0,
      deadline: deadline || null,
      iconKey: selectedIcon,
      colorIndex: selectedColor,
      contributions: [],
      createdAt: new Date().toISOString(),
    });

    setName("");
    setTarget("");
    setDeadline("");
    setSelectedIcon("Plane");
    setSelectedColor(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center px-0 sm:px-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      <div className="relative bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-2xl shadow-xl w-full sm:max-w-md p-6 max-h-[90vh] overflow-y-auto animate-slideUp sm:animate-scaleIn">
        {/* Drag handle on mobile */}
        <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            New Savings Goal
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Goal name */}
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
              Goal Name
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vacation to Goa"
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>

          {/* Target amount */}
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
              Target Amount
            </label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="50000"
                required
                min="1"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
              Target Date{" "}
              <span className="text-gray-400 dark:text-gray-500 font-normal">(optional)</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>

          {/* Icon picker */}
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 block">
              Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map(({ icon: Icon, label, key }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedIcon(key)}
                  title={label}
                  className={`p-2.5 rounded-xl border-2 transition-all duration-200 ${
                    selectedIcon === key
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 scale-110 shadow-sm"
                      : "border-gray-100 dark:border-gray-600 hover:border-gray-200 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      selectedIcon === key
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Color picker */}
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 block">
              Color Theme
            </label>
            <div className="flex gap-3">
              {COLORS.map((color, i) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(i)}
                  className={`w-8 h-8 rounded-full bg-gradient-to-br ${color.from} ${color.to} transition-all duration-200 ${
                    selectedColor === i
                      ? "ring-2 ring-offset-2 dark:ring-offset-gray-800 " + color.ring + " scale-110"
                      : "hover:scale-105"
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-200 dark:hover:shadow-indigo-900/40 transition-all duration-300 active:scale-95"
          >
            Create Goal
          </button>
        </form>
      </div>
    </div>
  );
}
