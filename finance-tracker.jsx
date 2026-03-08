import { useState, useMemo, useCallback, useEffect } from "react";
import { PlusCircle, Trash2, TrendingUp, TrendingDown, DollarSign, Calendar, Filter, ChevronDown, ChevronUp, ArrowUpDown, BarChart3, PieChart, X, Edit3, Check, Download, Upload } from "lucide-react";
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

const CATEGORIES = [
  "Kids", "Bills", "Home", "Pets", "Savings", "Recreation",
  "Clothes", "Gas", "Restaurants", "College", "Health",
  "Groceries", "Paycheck", "Other"
];

const CATEGORY_COLORS = {
  Kids: "#f59e0b", Bills: "#ef4444", Home: "#3b82f6", Pets: "#8b5cf6",
  Savings: "#10b981", Recreation: "#f97316", Clothes: "#ec4899",
  Gas: "#6366f1", Restaurants: "#14b8a6", College: "#a855f7",
  Health: "#06b6d4", Groceries: "#84cc16", Paycheck: "#22c55e", Other: "#94a3b8"
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getMonthKey(date) {
  const d = new Date(date + "T00:00:00");
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function getMonthLabel(key) {
  const [year, month] = key.split("-");
  return `${MONTHS[parseInt(month) - 1]} ${year}`;
}

// Sample data to get started
const SAMPLE_TRANSACTIONS = [
  { id: generateId(), date: "2026-03-01", amount: 996.14, description: "Beginning Balance", category: "Savings" },
  { id: generateId(), date: "2026-03-02", amount: -64.16, description: "Sport 2000 Ski", category: "Kids" },
  { id: generateId(), date: "2026-03-02", amount: -11.35, description: "HMS Host International", category: "Kids" },
  { id: generateId(), date: "2026-03-02", amount: -8.99, description: "Paramount+", category: "Bills" },
  { id: generateId(), date: "2026-03-02", amount: -11.28, description: "Fuel at DTW", category: "Gas" },
  { id: generateId(), date: "2026-03-02", amount: -14.15, description: "DTW Qdoba", category: "Kids" },
  { id: generateId(), date: "2026-03-02", amount: -75.00, description: "Delta Airlines", category: "Bills" },
  { id: generateId(), date: "2026-03-02", amount: -342.88, description: "CIE Mont Blanc", category: "Recreation" },
  { id: generateId(), date: "2026-03-02", amount: -59.13, description: "West Elm", category: "Home" },
  { id: generateId(), date: "2026-03-02", amount: -4.25, description: "City of Portland", category: "Other" },
  { id: generateId(), date: "2026-03-02", amount: -30.15, description: "Gas - Toyota", category: "Gas" },
  { id: generateId(), date: "2026-03-02", amount: -100.00, description: "Greenlight", category: "Kids" },
  { id: generateId(), date: "2026-03-02", amount: -36.90, description: "Lobo Tacos", category: "Restaurants" },
  { id: generateId(), date: "2026-03-02", amount: 2000.00, description: "Savings Transfer", category: "Savings" },
  { id: generateId(), date: "2026-03-02", amount: -80.00, description: "Dog Walker", category: "Pets" },
  { id: generateId(), date: "2026-03-05", amount: 1343.09, description: "Jen - Paycheck", category: "Paycheck" },
  { id: generateId(), date: "2026-03-05", amount: -100.00, description: "Venmo", category: "Home" },
  { id: generateId(), date: "2026-03-06", amount: -49.29, description: "EasyJet Airlines", category: "Kids" },
  { id: generateId(), date: "2026-03-06", amount: -80.00, description: "Charlie's Friends", category: "Pets" },
  { id: generateId(), date: "2026-03-06", amount: 8315.92, description: "Capital One Paycheck", category: "Paycheck" },
  { id: generateId(), date: "2026-03-06", amount: -5050.00, description: "Savings Transfer", category: "Savings" },
  { id: generateId(), date: "2026-03-09", amount: -750.00, description: "Mortgage", category: "Bills" },
  { id: generateId(), date: "2026-03-09", amount: -500.00, description: "Best Buy", category: "Bills" },
];

function TransactionForm({ onAdd, editingTx, onUpdate, onCancelEdit }) {
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Other");
  const [isExpense, setIsExpense] = useState(true);

  useEffect(() => {
    if (editingTx) {
      setDate(editingTx.date);
      setAmount(Math.abs(editingTx.amount).toString());
      setDescription(editingTx.description);
      setCategory(editingTx.category);
      setIsExpense(editingTx.amount < 0);
    }
  }, [editingTx]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !amount || !description) return;
    const finalAmount = isExpense ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount));
    if (editingTx) {
      onUpdate({ ...editingTx, date, amount: finalAmount, description, category });
    } else {
      onAdd({ id: generateId(), date, amount: finalAmount, description, category });
    }
    setDate(""); setAmount(""); setDescription(""); setCategory("Other"); setIsExpense(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2 mb-3">
        <button type="button" onClick={() => setIsExpense(true)}
          className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all ${isExpense ? "bg-red-500 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
          Expense
        </button>
        <button type="button" onClick={() => setIsExpense(false)}
          className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all ${!isExpense ? "bg-green-500 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
          Income
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Amount</label>
          <input type="number" step="0.01" min="0" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
        <input type="text" placeholder="e.g. Grocery store, Paycheck..." value={description} onChange={e => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
        <select value={category} onChange={e => setCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white">
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="flex gap-2">
        <button type="submit"
          className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm text-white transition-all shadow-md hover:shadow-lg ${editingTx ? "bg-amber-500 hover:bg-amber-600" : "bg-blue-500 hover:bg-blue-600"}`}>
          {editingTx ? "Update Transaction" : "Add Transaction"}
        </button>
        {editingTx && (
          <button type="button" onClick={() => { onCancelEdit(); setDate(""); setAmount(""); setDescription(""); setCategory("Other"); setIsExpense(true); }}
            className="py-2.5 px-4 rounded-lg font-medium text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function StatCard({ icon: Icon, label, value, color, subtext }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-1">
        <Icon size={16} className={color} />
        <span className="text-xs font-medium text-gray-500">{label}</span>
      </div>
      <div className={`text-xl font-bold ${color}`}>{value}</div>
      {subtext && <div className="text-xs text-gray-400 mt-1">{subtext}</div>}
    </div>
  );
}

function CategoryBadge({ category }) {
  const color = CATEGORY_COLORS[category] || CATEGORY_COLORS.Other;
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: color + "20", color: color }}>
      {category}
    </span>
  );
}

export default function FinanceTracker() {
  const [transactions, setTransactions] = useState(SAMPLE_TRANSACTIONS);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortField, setSortField] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [editingTx, setEditingTx] = useState(null);
  const [view, setView] = useState("list"); // list, summary, charts
  const [showForm, setShowForm] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Available months from data
  const availableMonths = useMemo(() => {
    const months = new Set(transactions.map(t => getMonthKey(t.date)));
    return Array.from(months).sort().reverse();
  }, [transactions]);

  // Filtered & sorted transactions
  const filteredTransactions = useMemo(() => {
    let txs = [...transactions];
    if (selectedMonth !== "all") txs = txs.filter(t => getMonthKey(t.date) === selectedMonth);
    if (filterCategory !== "all") txs = txs.filter(t => t.category === filterCategory);
    if (searchQuery) txs = txs.filter(t => t.description.toLowerCase().includes(searchQuery.toLowerCase()));
    txs.sort((a, b) => {
      let cmp = 0;
      if (sortField === "date") cmp = a.date.localeCompare(b.date);
      else if (sortField === "amount") cmp = a.amount - b.amount;
      else if (sortField === "description") cmp = a.description.localeCompare(b.description);
      else if (sortField === "category") cmp = a.category.localeCompare(b.category);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return txs;
  }, [transactions, selectedMonth, filterCategory, sortField, sortDir, searchQuery]);

  // Running balance
  const transactionsWithBalance = useMemo(() => {
    const allSorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
    let balance = 0;
    const balanceMap = {};
    allSorted.forEach(t => { balance += t.amount; balanceMap[t.id] = balance; });
    return filteredTransactions.map(t => ({ ...t, balance: balanceMap[t.id] }));
  }, [transactions, filteredTransactions]);

  // Stats
  const stats = useMemo(() => {
    const txs = filteredTransactions;
    const income = txs.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const expenses = txs.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
    const net = income - expenses;
    const currentBalance = transactions.reduce((s, t) => s + t.amount, 0);
    return { income, expenses, net, currentBalance, count: txs.length };
  }, [filteredTransactions, transactions]);

  // Category breakdown
  const categoryBreakdown = useMemo(() => {
    const map = {};
    filteredTransactions.filter(t => t.amount < 0).forEach(t => {
      const cat = t.category;
      if (!map[cat]) map[cat] = { category: cat, total: 0, count: 0 };
      map[cat].total += Math.abs(t.amount);
      map[cat].count++;
    });
    return Object.values(map).sort((a, b) => b.total - a.total);
  }, [filteredTransactions]);

  // Weekly spending for bar chart
  const weeklyData = useMemo(() => {
    const weeks = {};
    filteredTransactions.filter(t => t.amount < 0).forEach(t => {
      const d = new Date(t.date + "T00:00:00");
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      const key = weekStart.toISOString().slice(0, 10);
      if (!weeks[key]) weeks[key] = { week: `Week of ${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`, total: 0 };
      weeks[key].total += Math.abs(t.amount);
    });
    return Object.values(weeks);
  }, [filteredTransactions]);

  const addTransaction = useCallback((tx) => {
    setTransactions(prev => [...prev, tx]);
  }, []);

  const updateTransaction = useCallback((tx) => {
    setTransactions(prev => prev.map(t => t.id === tx.id ? tx : t));
    setEditingTx(null);
  }, []);

  const deleteTransaction = useCallback((id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    if (editingTx?.id === id) setEditingTx(null);
  }, [editingTx]);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };

  const exportData = () => {
    const csv = ["Date,Amount,Description,Category", ...transactions.map(t => `${t.date},${t.amount},"${t.description}",${t.category}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "transactions.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const SortIcon = ({ field }) => (
    <ArrowUpDown size={12} className={`inline ml-1 ${sortField === field ? "text-blue-500" : "text-gray-300"}`} />
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center">
                <DollarSign size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Spend Tracker</h1>
                <p className="text-xs text-gray-500">Personal Finance Manager</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={exportData} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all">
                <Download size={14} /> Export CSV
              </button>
              <button onClick={() => setShowForm(f => !f)} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-all md:hidden">
                <PlusCircle size={14} /> {showForm ? "Hide" : "Add"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <StatCard icon={DollarSign} label="Balance" value={formatCurrency(stats.currentBalance)} color="text-blue-600" subtext="Current total" />
          <StatCard icon={TrendingUp} label="Income" value={formatCurrency(stats.income)} color="text-green-600" subtext={`${selectedMonth === "all" ? "All time" : getMonthLabel(selectedMonth)}`} />
          <StatCard icon={TrendingDown} label="Expenses" value={formatCurrency(stats.expenses)} color="text-red-600" subtext={`${stats.count} transactions`} />
          <StatCard icon={BarChart3} label="Net" value={formatCurrency(stats.net)} color={stats.net >= 0 ? "text-green-600" : "text-red-600"} subtext={stats.net >= 0 ? "Surplus" : "Deficit"} />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Left Panel - Form */}
          <div className={`md:w-80 flex-shrink-0 ${showForm ? "" : "hidden md:block"}`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sticky top-20">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">{editingTx ? "Edit Transaction" : "New Transaction"}</h2>
              <TransactionForm onAdd={addTransaction} editingTx={editingTx} onUpdate={updateTransaction} onCancelEdit={() => setEditingTx(null)} />
            </div>
          </div>

          {/* Right Panel - Content */}
          <div className="flex-1 min-w-0">
            {/* Filters & View Toggle */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="all">All Months</option>
                  {availableMonths.map(m => <option key={m} value={m}>{getMonthLabel(m)}</option>)}
                </select>
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="all">All Categories</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-32" />
                <div className="flex bg-gray-100 rounded-lg p-0.5 ml-auto">
                  {[{ key: "list", label: "List" }, { key: "summary", label: "Summary" }, { key: "charts", label: "Charts" }].map(v => (
                    <button key={v.key} onClick={() => setView(v.key)}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${view === v.key ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* List View */}
            {view === "list" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <th className="text-left text-xs font-medium text-gray-500 px-4 py-2.5 cursor-pointer hover:text-gray-700" onClick={() => toggleSort("date")}>
                          Date <SortIcon field="date" />
                        </th>
                        <th className="text-left text-xs font-medium text-gray-500 px-4 py-2.5 cursor-pointer hover:text-gray-700" onClick={() => toggleSort("description")}>
                          Description <SortIcon field="description" />
                        </th>
                        <th className="text-left text-xs font-medium text-gray-500 px-4 py-2.5 cursor-pointer hover:text-gray-700" onClick={() => toggleSort("category")}>
                          Category <SortIcon field="category" />
                        </th>
                        <th className="text-right text-xs font-medium text-gray-500 px-4 py-2.5 cursor-pointer hover:text-gray-700" onClick={() => toggleSort("amount")}>
                          Amount <SortIcon field="amount" />
                        </th>
                        <th className="text-right text-xs font-medium text-gray-500 px-4 py-2.5">Balance</th>
                        <th className="text-right text-xs font-medium text-gray-500 px-4 py-2.5 w-20">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactionsWithBalance.length === 0 && (
                        <tr><td colSpan={6} className="text-center py-12 text-gray-400 text-sm">No transactions found</td></tr>
                      )}
                      {transactionsWithBalance.map((tx) => (
                        <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                          <td className="px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap">{formatDate(tx.date)}</td>
                          <td className="px-4 py-2.5 text-sm font-medium text-gray-900">{tx.description}</td>
                          <td className="px-4 py-2.5"><CategoryBadge category={tx.category} /></td>
                          <td className={`px-4 py-2.5 text-sm font-semibold text-right whitespace-nowrap ${tx.amount >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {tx.amount >= 0 ? "+" : ""}{formatCurrency(tx.amount)}
                          </td>
                          <td className="px-4 py-2.5 text-sm text-right text-gray-500 whitespace-nowrap">{formatCurrency(tx.balance)}</td>
                          <td className="px-4 py-2.5 text-right">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => setEditingTx(tx)} className="p-1 rounded hover:bg-blue-100 text-gray-400 hover:text-blue-600 transition-colors">
                                <Edit3 size={14} />
                              </button>
                              <button onClick={() => deleteTransaction(tx.id)} className="p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Summary View */}
            {view === "summary" && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Spending by Category</h3>
                  {categoryBreakdown.length === 0 ? (
                    <p className="text-sm text-gray-400 py-8 text-center">No expenses to show</p>
                  ) : (
                    <div className="space-y-2">
                      {categoryBreakdown.map(cat => {
                        const pct = stats.expenses > 0 ? (cat.total / stats.expenses) * 100 : 0;
                        return (
                          <div key={cat.category}>
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat.category] }} />
                                <span className="text-sm font-medium text-gray-700">{cat.category}</span>
                                <span className="text-xs text-gray-400">({cat.count})</span>
                              </div>
                              <div className="text-sm font-semibold text-gray-900">{formatCurrency(cat.total)}</div>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                              <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: CATEGORY_COLORS[cat.category] }} />
                            </div>
                            <div className="text-right text-xs text-gray-400 mt-0.5">{pct.toFixed(1)}%</div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Top Expenses */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Top 10 Expenses</h3>
                  <div className="space-y-2">
                    {filteredTransactions
                      .filter(t => t.amount < 0)
                      .sort((a, b) => a.amount - b.amount)
                      .slice(0, 10)
                      .map((tx, i) => (
                        <div key={tx.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 w-5">{i + 1}.</span>
                            <span className="text-sm text-gray-700">{tx.description}</span>
                            <CategoryBadge category={tx.category} />
                          </div>
                          <span className="text-sm font-semibold text-red-600">{formatCurrency(tx.amount)}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Charts View */}
            {view === "charts" && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Spending by Category</h3>
                  {categoryBreakdown.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                      <RechartsPie>
                        <Pie data={categoryBreakdown} dataKey="total" nameKey="category" cx="50%" cy="50%" outerRadius={100} label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`} labelLine={true}>
                          {categoryBreakdown.map((entry) => (
                            <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category] || "#94a3b8"} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                      </RechartsPie>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-sm text-gray-400 py-16 text-center">No data</p>
                  )}
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Weekly Spending</h3>
                  {weeklyData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Spending" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-sm text-gray-400 py-16 text-center">No data</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}