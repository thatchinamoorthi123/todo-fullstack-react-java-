import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import TodoCard from './components/TodoCard';
import TodoModal from './components/TodoModal';
import ArchitectureModal from './components/ArchitectureModal';
import { todoService, onApiActivity } from './services/todoService';
import { Search, Filter, RefreshCw, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState({ connected: false, error: 'Connecting...' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'PENDING' | 'COMPLETED'
  const [filterPriority, setFilterPriority] = useState('ALL'); // 'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'
  const [filterCategory, setFilterCategory] = useState('ALL'); // 'ALL' | 'Backend' | ...
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [isArchModalOpen, setIsArchModalOpen] = useState(false);
  const [apiLogs, setApiLogs] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Subscribe to real-time API logs for architecture inspector
  useEffect(() => {
    const unsubscribe = onApiActivity((activity) => {
      setApiLogs((prev) => [activity, ...prev].slice(0, 50));
    });
    return unsubscribe;
  }, []);

  // Check health and load initial todos
  const loadData = async () => {
    setLoading(true);
    try {
      const health = await todoService.checkHealth();
      setBackendStatus(health);

      const data = await todoService.getAllTodos();
      setTodos(data);
    } catch (err) {
      console.error('Failed to load initial todos:', err);
      setBackendStatus({ connected: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Check health periodically
    const interval = setInterval(async () => {
      const health = await todoService.checkHealth();
      setBackendStatus(health);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // CRUD Handlers
  const handleToggle = async (id) => {
    try {
      const updated = await todoService.toggleTodo(id);
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
      showToast(
        updated.completed
          ? `Marked "${updated.title}" as completed!`
          : `Re-opened "${updated.title}"!`
      );
    } catch (err) {
      showToast('Failed to update status: ' + err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await todoService.deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
      showToast('Task removed from database!');
    } catch (err) {
      showToast('Failed to delete task: ' + err.message, 'error');
    }
  };

  const handleSave = async (payload, id) => {
    try {
      if (id) {
        const updated = await todoService.updateTodo(id, payload);
        setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
        showToast('Task updated successfully!');
      } else {
        const created = await todoService.createTodo(payload);
        setTodos((prev) => [created, ...prev]);
        showToast('New task added to database!');
      }
    } catch (err) {
      throw err;
    }
  };

  const handleOpenEdit = (todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingTodo(null);
    setIsModalOpen(true);
  };

  // Categories list
  const categories = useMemo(() => {
    const set = new Set(todos.map((t) => t.category).filter(Boolean));
    return ['ALL', ...Array.from(set)];
  }, [todos]);

  // Filtered Todos
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      // Search
      const matchesSearch =
        todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (todo.description && todo.description.toLowerCase().includes(searchTerm.toLowerCase()));

      // Status
      let matchesStatus = true;
      if (filterStatus === 'PENDING') matchesStatus = !todo.completed;
      if (filterStatus === 'COMPLETED') matchesStatus = todo.completed;

      // Priority
      let matchesPriority = true;
      if (filterPriority !== 'ALL') matchesPriority = todo.priority === filterPriority;

      // Category
      let matchesCategory = true;
      if (filterCategory !== 'ALL') matchesCategory = todo.category === filterCategory;

      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });
  }, [todos, searchTerm, filterStatus, filterPriority, filterCategory]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative selection:bg-indigo-500 selection:text-white">
      {/* Ambient background glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none glow-ambient" />
      <div className="fixed top-1/3 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none glow-ambient" />

      {/* Navigation */}
      <Navbar
        backendStatus={backendStatus}
        onOpenNewTodo={handleOpenCreate}
        onOpenArchitecture={() => setIsArchModalOpen(true)}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom duration-300">
          <div
            className={`px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold border ${
              toast.type === 'error'
                ? 'bg-rose-950/90 text-rose-300 border-rose-800'
                : 'bg-emerald-950/90 text-emerald-300 border-emerald-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 z-10">
        {/* Backend Connectivity Banner (if disconnected) */}
        {!backendStatus.connected && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between text-xs text-rose-300">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>
                Backend offline or unreachable at <code className="font-mono text-rose-200">http://localhost:8080</code>.
                Make sure the Spring Boot server is running!
              </span>
            </div>
            <button
              onClick={loadData}
              className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 font-semibold transition cursor-pointer flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          </div>
        )}

        {/* Learning Prompt Card */}
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/20 backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Full Stack React + Spring Boot Lab</h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Every task you create, toggle, or delete is sent to <code className="text-indigo-300 font-mono">http://localhost:8080/api/todos</code> and stored in PostgreSQL!
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsArchModalOpen(true)}
            className="self-start sm:self-auto px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>View Architecture Diagram & Logs</span>
          </button>
        </div>

        {/* Stats Metrics */}
        <StatsOverview todos={todos} />

        {/* Filter & Search Bar */}
        <div className="my-6 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tasks by title or description..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Refresh Button */}
            <button
              onClick={loadData}
              disabled={loading}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center justify-center gap-1.5 transition cursor-pointer"
              title="Sync with Spring Boot Database"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync DB</span>
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
            {/* Status Tabs */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {['ALL', 'PENDING', 'COMPLETED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer capitalize text-[11px] ${
                    filterStatus === st
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {st.toLowerCase()}
                </button>
              ))}
            </div>

            {/* Select Dropdowns: Priority & Category */}
            <div className="flex items-center gap-2">
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-[11px] focus:outline-none focus:border-indigo-500"
              >
                <option value="ALL">All Priorities</option>
                <option value="HIGH">High Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="LOW">Low Priority</option>
              </select>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-[11px] focus:outline-none focus:border-indigo-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'ALL' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Task List Section */}
        {loading && todos.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Fetching tasks from Spring Boot backend...</p>
          </div>
        ) : filteredTodos.length === 0 ? (
          <div className="py-16 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80 p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">No matching tasks found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchTerm || filterStatus !== 'ALL' || filterPriority !== 'ALL' || filterCategory !== 'ALL'
                ? 'Try adjusting your filters or search keywords.'
                : 'Your todo list is empty. Click "+ New Task" above to add your first task to the database!'}
            </p>
            <button
              onClick={handleOpenCreate}
              className="mt-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm cursor-pointer"
            >
              + Create First Task
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTodos.map((todo) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <p>Built with React 19 + Tailwind CSS v4 + Java Spring Boot 4 + PostgreSQL</p>
      </footer>

      {/* Create / Edit Modal */}
      <TodoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editingTodo={editingTodo}
      />

      {/* Architecture & API Inspector Modal */}
      <ArchitectureModal
        isOpen={isArchModalOpen}
        onClose={() => setIsArchModalOpen(false)}
        apiLogs={apiLogs}
      />
    </div>
  );
}
