import { useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  Flame,
  Award,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

// category → color mapping
const CATEGORY_COLORS = {
  Food: { fill: "#6366f1", bg: "bg-indigo-50 dark:bg-indigo-900/20", text: "text-indigo-600 dark:text-indigo-400" },
  Shopping: { fill: "#8b5cf6", bg: "bg-violet-50 dark:bg-violet-900/20", text: "text-violet-600 dark:text-violet-400" },
  Transport: { fill: "#ec4899", bg: "bg-pink-50 dark:bg-pink-900/20", text: "text-pink-600 dark:text-pink-400" },
  Rent: { fill: "#f59e0b", bg: "bg-amber-50 dark:bg-amber-900/20", text: "text-amber-600 dark:text-amber-400" },
  Utilities: { fill: "#10b981", bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-600 dark:text-emerald-400" },
  Entertainment: { fill: "#06b6d4", bg: "bg-cyan-50 dark:bg-cyan-900/20", text: "text-cyan-600 dark:text-cyan-400" },
  Health: { fill: "#ef4444", bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-600 dark:text-red-400" },
  Education: { fill: "#3b82f6", bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-600 dark:text-blue-400" },
};

const DEFAULT_COLOR = { fill: "#94a3b8", bg: "bg-gray-50 dark:bg-gray-700/30", text: "text-gray-600 dark:text-gray-400" };

function getColorFor(cat) {
  return CATEGORY_COLORS[cat] || DEFAULT_COLOR;
}

/* ---------- Donut chart (pure SVG) ---------- */
function DonutChart({ data, size = 200, isDark = false }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;

  const radius = 70;
  const cx = size / 2;
  const cy = size / 2;
  const strokeWidth = 28;
  let cumulativePercent = 0;

  const getCoords = (pct) => {
    const angle = pct * 2 * Math.PI - Math.PI / 2;
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {data.map((slice, i) => {
        const pct = slice.value / total;
        if (pct === 0) return null;
        const startAngle = cumulativePercent;
        const endAngle = cumulativePercent + pct;
        cumulativePercent += pct;

        const start = getCoords(startAngle);
        const end = getCoords(endAngle);
        const largeArc = pct > 0.5 ? 1 : 0;

        const d = [
          `M ${start.x} ${start.y}`,
          `A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`,
        ].join(" ");

        return (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={slice.color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))" }}
          />
        );
      })}
      {/* Center text */}
      <text
        x={cx}
        y={cy - 8}
        textAnchor="middle"
        fill={isDark ? "#f3f4f6" : "#1f2937"}
        style={{ fontSize: "20px", fontWeight: 700 }}
      >
        ₹{total.toLocaleString()}
      </text>
      <text
        x={cx}
        y={cy + 14}
        textAnchor="middle"
        fill={isDark ? "#6b7280" : "#9ca3af"}
        style={{ fontSize: "11px" }}
      >
        Total Spent
      </text>
    </svg>
  );
}

/* ---------- Bar chart (CSS) ---------- */
function BarChartSection({ data }) {
  const maxVal = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex items-end gap-1.5 sm:gap-2 h-40">
      {data.map((bar, i) => {
        const heightPct = (bar.value / maxVal) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
              {bar.value > 0 ? `₹${(bar.value / 1000).toFixed(1)}k` : ""}
            </span>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-t-lg relative overflow-hidden" style={{ height: "120px" }}>
              <div
                className="absolute bottom-0 w-full rounded-t-lg bg-gradient-to-t from-indigo-600 to-purple-500 animate-progressFill"
                style={{ height: `${heightPct}%`, animationDelay: `${i * 0.1}s` }}
              />
            </div>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
              {bar.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Main Analytics ---------- */
export default function Analytics({ transactions }) {
  const [monthIndex, setMonthIndex] = useState(new Date().getMonth());
  const [view, setView] = useState("overview");

  const changeMonth = (delta) => {
    setMonthIndex((prev) => (prev + delta + 12) % 12);
  };

  // Check dark mode from parent
  const isDark = document.documentElement.closest('.dark') !== null ||
    document.querySelector('.dark') !== null;

  // Derived data
  const stats = useMemo(() => {
    const expenses = transactions.filter((t) => t.amount < 0);
    const income = transactions.filter((t) => t.amount > 0);

    const totalExpenses = expenses.reduce((s, t) => s + Math.abs(t.amount), 0);
    const totalIncome = income.reduce((s, t) => s + t.amount, 0);

    // Category breakdown
    const categoryMap = {};
    expenses.forEach((t) => {
      const cat = t.category || "Other";
      categoryMap[cat] = (categoryMap[cat] || 0) + Math.abs(t.amount);
    });

    const categories = Object.entries(categoryMap)
      .map(([name, value]) => ({
        name,
        value,
        color: getColorFor(name).fill,
        ...getColorFor(name),
      }))
      .sort((a, b) => b.value - a.value);

    // Daily spending (last 7 days)
    const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const dailySpending = dayLabels.map((label, i) => {
      const dayExpenses = expenses.filter((_, idx) => idx % 7 === i);
      const total = dayExpenses.reduce((s, t) => s + Math.abs(t.amount), 0);
      return { label, value: total };
    });

    // Top transaction
    const topExpense = expenses.length > 0
      ? expenses.reduce((max, t) =>
          Math.abs(t.amount) > Math.abs(max.amount) ? t : max
        )
      : null;

    // Average daily
    const avgDaily = expenses.length > 0 ? totalExpenses / 30 : 0;

    // Savings rate
    const savingsRate = totalIncome > 0
      ? ((totalIncome - totalExpenses) / totalIncome) * 100
      : 0;

    return {
      totalExpenses,
      totalIncome,
      categories,
      dailySpending,
      topExpense,
      avgDaily,
      savingsRate,
      transactionCount: transactions.length,
    };
  }, [transactions]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeInUp">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Analytics</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Understand your spending patterns
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Month selector */}
          <div className="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-100 dark:border-gray-700 px-1 py-1">
            <button
              onClick={() => changeMonth(-1)}
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-20 text-center">
              {MONTHS[monthIndex]}
            </span>
            <button
              onClick={() => changeMonth(1)}
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* View toggle */}
          <div className="flex bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-100 dark:border-gray-700 p-1">
            <button
              onClick={() => setView("overview")}
              className={`p-2 rounded-full transition-all ${
                view === "overview"
                  ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
              title="Overview"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("categories")}
              className={`p-2 rounded-full transition-all ${
                view === "categories"
                  ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
              title="Categories"
            >
              <PieChart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 border border-gray-50 dark:border-gray-700/50 animate-fadeInUp stagger-1 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs mb-2">
            <TrendingDown className="w-3.5 h-3.5 text-red-500 dark:text-red-400" />
            Spent
          </div>
          <p className="text-lg font-bold text-gray-800 dark:text-white">
            ₹{stats.totalExpenses.toLocaleString()}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 border border-gray-50 dark:border-gray-700/50 animate-fadeInUp stagger-2 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-green-500 dark:text-green-400" />
            Earned
          </div>
          <p className="text-lg font-bold text-gray-800 dark:text-white">
            ₹{stats.totalIncome.toLocaleString()}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 border border-gray-50 dark:border-gray-700/50 animate-fadeInUp stagger-3 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs mb-2">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            Daily Avg
          </div>
          <p className="text-lg font-bold text-gray-800 dark:text-white">
            ₹{Math.round(stats.avgDaily).toLocaleString()}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 border border-gray-50 dark:border-gray-700/50 animate-fadeInUp stagger-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs mb-2">
            <Award className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
            Savings Rate
          </div>
          <p className={`text-lg font-bold ${stats.savingsRate >= 0 ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
            {stats.savingsRate.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* No data state */}
      {transactions.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-12 text-center animate-fadeInUp">
          <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-float">
            <BarChart3 className="w-8 h-8 text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">
            No data to analyze
          </h3>
          <p className="text-sm text-gray-400 dark:text-gray-500 max-w-xs mx-auto">
            Add some transactions from the Home tab to see your spending
            analytics and category breakdown here.
          </p>
        </div>
      ) : (
        <>
          {view === "overview" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Donut chart */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 animate-fadeInUp stagger-1">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Spending Breakdown
                </h3>
                <div className="flex flex-col items-center">
                  <DonutChart
                    data={stats.categories.map((c) => ({
                      value: c.value,
                      color: c.color,
                    }))}
                    isDark={isDark}
                  />
                  <div className="flex flex-wrap justify-center gap-3 mt-4">
                    {stats.categories.slice(0, 6).map((cat) => (
                      <div key={cat.name} className="flex items-center gap-1.5">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {cat.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Weekly spending bars */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 animate-fadeInUp stagger-2">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Weekly Spending
                </h3>
                <BarChartSection data={stats.dailySpending} />
              </div>

              {/* Income vs Expense comparison */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 lg:col-span-2 animate-fadeInUp stagger-3">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">
                  Income vs Expenses
                </h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <ArrowUpRight className="w-4 h-4 text-green-500 dark:text-green-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Income</span>
                      </div>
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                        ₹{stats.totalIncome.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400 animate-progressFill"
                        style={{
                          width: `${
                            stats.totalIncome + stats.totalExpenses > 0
                              ? (stats.totalIncome / Math.max(stats.totalIncome, stats.totalExpenses)) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <ArrowDownRight className="w-4 h-4 text-red-500 dark:text-red-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Expenses</span>
                      </div>
                      <span className="text-sm font-semibold text-red-500 dark:text-red-400">
                        ₹{stats.totalExpenses.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-400 animate-progressFill"
                        style={{
                          width: `${
                            stats.totalIncome + stats.totalExpenses > 0
                              ? (stats.totalExpenses / Math.max(stats.totalIncome, stats.totalExpenses)) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ===== CATEGORIES VIEW ===== */
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 animate-fadeInUp">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Category Breakdown
                </h3>

                {stats.categories.length === 0 ? (
                  <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6">
                    No expense categories to show
                  </p>
                ) : (
                  <div className="space-y-3">
                    {stats.categories.map((cat) => {
                      const pct = stats.totalExpenses > 0 ? (cat.value / stats.totalExpenses) * 100 : 0;
                      return (
                        <div key={cat.name} className="group">
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-lg ${cat.bg} flex items-center justify-center`}>
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{cat.name}</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500">{pct.toFixed(1)}% of total</p>
                              </div>
                            </div>
                            <p className={`text-sm font-semibold ${cat.text}`}>₹{cat.value.toLocaleString()}</p>
                          </div>
                          <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full animate-progressFill"
                              style={{ width: `${pct}%`, backgroundColor: cat.color }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Top expense highlight */}
              {stats.topExpense && (
                <div className="bg-gradient-to-r from-rose-50 via-pink-50 to-red-50 dark:from-rose-900/20 dark:via-pink-900/20 dark:to-red-900/20 rounded-2xl p-5 border border-rose-100/50 dark:border-rose-800/30 animate-fadeInUp stagger-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Flame className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      Biggest Expense
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">{stats.topExpense.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {stats.topExpense.category} • {stats.topExpense.date}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-red-500 dark:text-red-400">
                      ₹{Math.abs(stats.topExpense.amount).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {/* All transactions */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 sm:p-6 animate-fadeInUp stagger-2">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  All Transactions
                </h3>
                <div className="space-y-1">
                  {transactions.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between py-2.5 px-2 sm:px-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
                            t.amount < 0 ? getColorFor(t.category).bg : "bg-green-50 dark:bg-green-900/20"
                          }`}
                        >
                          {t.amount < 0 ? (
                            <ArrowDownRight className="w-4 h-4 text-red-500 dark:text-red-400" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4 text-green-500 dark:text-green-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{t.name}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{t.category} • {t.date}</p>
                        </div>
                      </div>
                      <p className={`text-sm font-semibold flex-shrink-0 ml-2 ${
                        t.amount < 0 ? "text-red-500 dark:text-red-400" : "text-green-600 dark:text-green-400"
                      }`}>
                        {t.amount < 0 ? "-" : "+"}₹{Math.abs(t.amount).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
