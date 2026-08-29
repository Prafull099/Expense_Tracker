import { useState } from "react";
import {
  PiggyBank,
  Plus,
  Target,
  TrendingUp,
  Sparkles,
  Trash2,
  Plane,
  Home,
  Car,
  GraduationCap,
  ShieldCheck,
  Gift,
  Smartphone,
  Gem,
  Palette,
  CalendarDays,
} from "lucide-react";
import AddSavingsGoalModal, { COLORS } from "./AddSavingsGoalModal";
import ContributeModal from "./ContributeModal";

const ICON_MAP = {
  Plane,
  Home,
  Car,
  GraduationCap,
  ShieldCheck,
  Gift,
  Smartphone,
  Gem,
  Palette,
};

export default function Savings({ savingsGoals, onAddGoal, onContribute, onDeleteGoal }) {
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [contributeGoal, setContributeGoal] = useState(null);

  const totalSaved = savingsGoals.reduce((sum, g) => sum + g.saved, 0);
  const totalTarget = savingsGoals.reduce((sum, g) => sum + g.target, 0);
  const completedGoals = savingsGoals.filter((g) => g.saved >= g.target).length;
  const overallPercent = totalTarget > 0 ? Math.min((totalSaved / totalTarget) * 100, 100) : 0;

  const getDaysLeft = (deadline) => {
    if (!deadline) return null;
    const diff = new Date(deadline) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeInUp">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Savings Goals</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Track and grow your savings
          </p>
        </div>
        <button
          onClick={() => setShowGoalModal(true)}
          className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-200 dark:hover:shadow-indigo-900/40 text-white text-sm font-medium px-4 py-2.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          New Goal
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Total saved */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/30 animate-fadeInUp stagger-1">
          <div className="flex items-center gap-2 text-indigo-100 text-sm mb-1">
            <PiggyBank className="w-4 h-4" /> Total Saved
          </div>
          <p className="text-3xl font-bold">₹{totalSaved.toLocaleString()}</p>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-indigo-200 mb-1">
              <span>Overall progress</span>
              <span>{overallPercent.toFixed(0)}%</span>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full animate-progressFill"
                style={{ width: `${overallPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Target */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-gray-900/20 p-5 flex flex-col gap-2 animate-fadeInUp stagger-2">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
            <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Total Target
          </div>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            ₹{totalTarget.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            ₹{(totalTarget - totalSaved).toLocaleString()} remaining
          </p>
        </div>

        {/* Completed */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-gray-900/20 p-5 flex flex-col gap-2 animate-fadeInUp stagger-3">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
            <Sparkles className="w-4 h-4 text-amber-500" /> Completed
          </div>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {completedGoals}{" "}
            <span className="text-sm font-normal text-gray-400 dark:text-gray-500">
              / {savingsGoals.length} goals
            </span>
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {savingsGoals.length - completedGoals} in progress
          </p>
        </div>
      </div>

      {/* Goals list */}
      {savingsGoals.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-12 text-center animate-fadeInUp">
          <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-float">
            <PiggyBank className="w-8 h-8 text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">
            No savings goals yet
          </h3>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-5 max-w-xs mx-auto">
            Start by creating your first savings goal — whether it's a vacation,
            emergency fund, or something special.
          </p>
          <button
            onClick={() => setShowGoalModal(true)}
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:shadow-lg hover:shadow-indigo-200 dark:hover:shadow-indigo-900/40 transition-all duration-300 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Create First Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savingsGoals.map((goal, i) => {
            const color = COLORS[goal.colorIndex] || COLORS[0];
            const Icon = ICON_MAP[goal.iconKey] || PiggyBank;
            const percent = Math.min((goal.saved / goal.target) * 100, 100);
            const isComplete = goal.saved >= goal.target;
            const daysLeft = getDaysLeft(goal.deadline);

            return (
              <div
                key={goal.id}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:shadow-gray-900/20 p-5 border-2 transition-all duration-300 hover:shadow-md animate-fadeInUp ${
                  isComplete ? "border-green-200 dark:border-green-800" : "border-transparent"
                }`}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {/* Goal header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color.from} ${color.to} flex items-center justify-center shadow-sm`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white flex items-center gap-1.5">
                        {goal.name}
                        {isComplete && (
                          <Sparkles className="w-4 h-4 text-amber-500" />
                        )}
                      </h4>
                      {goal.deadline && (
                        <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                          <CalendarDays className="w-3 h-3" />
                          {daysLeft === 0
                            ? "Due today"
                            : daysLeft !== null
                            ? `${daysLeft} days left`
                            : ""}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteGoal(goal.id)}
                    className="p-1.5 rounded-lg text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Delete goal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Amount */}
                <div className="flex items-baseline gap-1 mb-3">
                  <span className={`text-xl font-bold ${color.text}`}>
                    ₹{goal.saved.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-400 dark:text-gray-500">
                    / ₹{goal.target.toLocaleString()}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${color.from} ${color.to} animate-progressFill`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {percent.toFixed(0)}% complete
                  </span>
                  {!isComplete ? (
                    <button
                      onClick={() => setContributeGoal(goal)}
                      className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 ${color.bg} ${color.text}`}
                    >
                      <Plus className="w-3 h-3" /> Add Money
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full">
                      <Sparkles className="w-3 h-3" /> Goal Reached!
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tips section */}
      {savingsGoals.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-2xl p-5 border border-indigo-100/50 dark:border-indigo-800/30 animate-fadeInUp">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Savings Tip
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Try the 50/30/20 rule — allocate 50% of income to needs, 30% to
            wants, and 20% to savings. Small, consistent contributions grow
            faster than you think!
          </p>
        </div>
      )}

      {/* Modals */}
      <AddSavingsGoalModal
        isOpen={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        onSubmit={onAddGoal}
      />

      <ContributeModal
        isOpen={!!contributeGoal}
        onClose={() => setContributeGoal(null)}
        goal={contributeGoal}
        onContribute={onContribute}
      />
    </div>
  );
}
