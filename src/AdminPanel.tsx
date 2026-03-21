import React, { useState, useMemo, useEffect } from 'react';
import {
  Search, Edit3, Save, X, Eye, EyeOff, ArrowLeft, Package, Users, ShoppingBag,
  BarChart3, TrendingUp, DollarSign, AlertTriangle, ChevronDown, ChevronUp,
  Plus, Trash2, Filter, RefreshCw, Shield, Database, Copy, Check,
  CheckCircle2, Clock, ChevronRight, Bug
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, User, BugReport } from './types';
import { supabase } from './lib/supabase';
import { MIGRATIONS, getAppliedMigrations, markMigrationApplied, unmarkMigrationApplied, type Migration } from './migrations';

interface AdminPanelProps {
  user: User | null;
  products: Product[];
  onUpdateProduct: (id: string, updates: Partial<Product>) => void;
  onToggleActive: (id: string) => void;
  onBack: () => void;
  onLogin: () => void;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  initialTab?: string;
}

type AdminTab = 'dashboard' | 'products' | 'clients' | 'orders' | 'sqlhistory' | 'bugs';

export default function AdminPanel({
  user, products, onUpdateProduct, onToggleActive, onBack, onLogin, isAdmin, setIsAdmin, initialTab,
}: AdminPanelProps) {
  const [adminTab, setAdminTab] = useState<AdminTab>((initialTab as AdminTab) || 'dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterActive, setFilterActive] = useState<string>('all');
  const [sortField, setSortField] = useState<'name' | 'price' | 'stock' | 'category'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  // SQL History state
  const [expandedMigration, setExpandedMigration] = useState<string | null>(null);
  const [appliedMap, setAppliedMap] = useState<Record<string, string>>(getAppliedMigrations);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  // Bug Reports state
  const [bugs, setBugs] = useState<BugReport[]>([]);
  const [bugsLoading, setBugsLoading] = useState(false);
  const [bugFilter, setBugFilter] = useState<string>('all');
  const [showBugForm, setShowBugForm] = useState(false);
  const [bugForm, setBugForm] = useState({ title: '', description: '', priority: 'medium', page: '', steps: '' });
  const [savingBug, setSavingBug] = useState(false);

  // Switch to initialTab when it changes (e.g. from BugReportWidget)
  useEffect(() => {
    if (initialTab && initialTab !== adminTab) {
      setAdminTab(initialTab as AdminTab);
    }
  }, [initialTab]);

  // Load bugs from Supabase
  useEffect(() => {
    if (adminTab === 'bugs') loadBugs();
  }, [adminTab]);

  const loadBugs = async () => {
    if (!supabase) return;
    setBugsLoading(true);
    const { data } = await supabase.from('BugReport').select('*').order('createdAt', { ascending: false });
    if (data) setBugs(data as BugReport[]);
    setBugsLoading(false);
  };

  const createBug = async () => {
    if (!supabase || !user || !bugForm.title.trim()) return;
    setSavingBug(true);
    const { error } = await supabase.from('BugReport').insert({
      title: bugForm.title.trim(),
      description: bugForm.description.trim() || '',
      priority: bugForm.priority,
      status: 'open',
      page: bugForm.page.trim() || null,
      steps: bugForm.steps.trim() || null,
      reportedBy: user.email,
    });
    if (error) {
      console.error('[AdminPanel] Bug insert error:', error.message, error.details, error.hint);
      alert(`Error al crear bug: ${error.message}`);
    }
    setBugForm({ title: '', description: '', priority: 'medium', page: '', steps: '' });
    setShowBugForm(false);
    setSavingBug(false);
    loadBugs();
  };

  const updateBugStatus = async (id: number, status: string) => {
    if (!supabase) return;
    const updates: Record<string, unknown> = { status, updatedAt: new Date().toISOString() };
    if (status === 'resolved' || status === 'closed') updates.resolvedAt = new Date().toISOString();
    await supabase.from('BugReport').update(updates).eq('id', id);
    loadBugs();
  };

  // ── Auth gate (role-based, no PIN) ──
  if (!user) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10"
        >
          <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Acceso Administrativo</h2>
          <p className="text-slate-500 text-sm mb-8">
            Necesitas iniciar sesión para acceder al panel de administración.
          </p>
          <button
            onClick={onLogin}
            className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-3.5 rounded-2xl font-bold hover:shadow-lg transition-all"
          >
            Iniciar sesión
          </button>
          <button onClick={onBack} className="block mx-auto mt-4 text-sm text-slate-400 hover:text-slate-600 transition-colors">
            ← Volver al inicio
          </button>
        </motion.div>
      </div>
    );
  }

  // ── Stats ──
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.active !== false).length;
  const inactiveProducts = totalProducts - activeProducts;
  const lowStock = products.filter(p => p.stock <= 3 && p.active !== false).length;
  const outOfStock = products.filter(p => p.stock === 0).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const categories = [...new Set(products.map(p => p.category))].sort();

  // ── Filtered & sorted products ──
  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.scientificName?.toLowerCase().includes(q)
      );
    }
    if (filterCategory !== 'all') {
      result = result.filter(p => p.category === filterCategory);
    }
    if (filterActive === 'active') result = result.filter(p => p.active !== false);
    else if (filterActive === 'inactive') result = result.filter(p => p.active === false);
    else if (filterActive === 'lowstock') result = result.filter(p => p.stock <= 3 && p.stock > 0);
    else if (filterActive === 'nostock') result = result.filter(p => p.stock === 0);

    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortField === 'price') cmp = a.price - b.price;
      else if (sortField === 'stock') cmp = a.stock - b.stock;
      else if (sortField === 'category') cmp = a.category.localeCompare(b.category);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [products, searchQuery, filterCategory, filterActive, sortField, sortDir]);

  const startEdit = (product: Product) => {
    setEditingProduct(product.id);
    setEditForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description,
      scientificName: product.scientificName || '',
      size: product.size || '',
    });
  };

  const saveEdit = (id: string) => {
    onUpdateProduct(id, editForm);
    setEditingProduct(null);
    setEditForm({});
  };

  const formatCOP = (n: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const SortIcon = ({ field }: { field: typeof sortField }) => {
    if (sortField !== field) return null;
    return sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />;
  };

  const tabs: { key: AdminTab; label: string; icon: React.ElementType; count?: number }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { key: 'products', label: 'Productos', icon: Package, count: totalProducts },
    { key: 'clients', label: 'Clientes', icon: Users },
    { key: 'orders', label: 'Pedidos', icon: ShoppingBag },
    { key: 'sqlhistory', label: 'SQL History', icon: Database, count: MIGRATIONS.length },
    { key: 'bugs', label: 'Bug Reports', icon: Bug, count: bugs.filter(b => b.status === 'open' || b.status === 'in_progress').length },
  ];

  return (
    <div className="max-w-7xl mx-auto py-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-800">Panel Admin</h1>
                <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Admin</span>
              </div>
              <p className="text-sm text-slate-500">Bienvenido, {user.name}</p>
            </div>
          </div>
          <button
            onClick={() => { setIsAdmin(false); onBack(); }}
            className="text-sm text-red-500 hover:text-red-600 font-medium hover:bg-red-50 px-4 py-2 rounded-xl transition-colors"
          >
            Salir del panel
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setAdminTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  adminTab === tab.key
                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-200'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.count !== undefined && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    adminTab === tab.key ? 'bg-white/20' : 'bg-slate-100'
                  }`}>{tab.count}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* ══════ DASHBOARD ══════ */}
        {adminTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: 'Total Productos', value: totalProducts, icon: Package, color: 'bg-blue-500', bg: 'bg-blue-50' },
                { label: 'Activos', value: activeProducts, icon: Eye, color: 'bg-emerald-500', bg: 'bg-emerald-50' },
                { label: 'Inactivos', value: inactiveProducts, icon: EyeOff, color: 'bg-slate-400', bg: 'bg-slate-50' },
                { label: 'Stock Bajo', value: lowStock, icon: AlertTriangle, color: 'bg-orange-500', bg: 'bg-orange-50' },
                { label: 'Agotados', value: outOfStock, icon: X, color: 'bg-red-500', bg: 'bg-red-50' },
                { label: 'Valor Inventario', value: formatCOP(totalValue), icon: DollarSign, color: 'bg-amber-500', bg: 'bg-amber-50' },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className={`${stat.bg} rounded-2xl p-5 border border-slate-100`}>
                    <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center text-white mb-3`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-xl font-bold text-slate-800 mt-1">{stat.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Category breakdown */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-500" />
                Productos por Categoría
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {categories.map(cat => {
                  const count = products.filter(p => p.category === cat).length;
                  const activeCount = products.filter(p => p.category === cat && p.active !== false).length;
                  return (
                    <div key={cat} className="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-colors cursor-pointer"
                      onClick={() => { setAdminTab('products'); setFilterCategory(cat); }}
                    >
                      <p className="font-semibold text-sm text-slate-800">{cat}</p>
                      <p className="text-xs text-slate-500 mt-1">{activeCount}/{count} activos</p>
                      <div className="h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(activeCount / count) * 100}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Low stock alerts */}
            {lowStock > 0 && (
              <div className="bg-orange-50 rounded-2xl border border-orange-200 p-6">
                <h3 className="font-bold text-orange-800 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Alertas de Stock Bajo ({lowStock})
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {products.filter(p => p.stock <= 3 && p.active !== false && p.stock > 0).map(p => (
                    <div key={p.id} className="flex items-center justify-between bg-white rounded-xl p-3 border border-orange-100">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                        <div>
                          <p className="text-sm font-medium text-slate-800">{p.name}</p>
                          <p className="text-xs text-slate-400">{p.category}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-orange-600">{p.stock} und.</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════ PRODUCTS ══════ */}
        {adminTab === 'products' && (
          <div className="space-y-4">
            {/* Filters bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar producto..."
                  className="w-full bg-slate-50 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-sm"
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-amber-500 outline-none"
              >
                <option value="all">Todas las categorías</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                value={filterActive}
                onChange={(e) => setFilterActive(e.target.value)}
                className="bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-amber-500 outline-none"
              >
                <option value="all">Todos</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
                <option value="lowstock">Stock bajo</option>
                <option value="nostock">Agotados</option>
              </select>
              <span className="text-xs text-slate-400 font-medium">
                {filteredProducts.length} resultados
              </span>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Imagen</th>
                      <th
                        className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-600"
                        onClick={() => handleSort('name')}
                      >
                        <span className="flex items-center gap-1">Nombre <SortIcon field="name" /></span>
                      </th>
                      <th
                        className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-600"
                        onClick={() => handleSort('category')}
                      >
                        <span className="flex items-center gap-1">Categoría <SortIcon field="category" /></span>
                      </th>
                      <th
                        className="text-right px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-600"
                        onClick={() => handleSort('price')}
                      >
                        <span className="flex items-center justify-end gap-1">Precio <SortIcon field="price" /></span>
                      </th>
                      <th
                        className="text-right px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-600"
                        onClick={() => handleSort('stock')}
                      >
                        <span className="flex items-center justify-end gap-1">Stock <SortIcon field="stock" /></span>
                      </th>
                      <th className="text-center px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                      <th className="text-center px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.slice(0, 50).map((product) => {
                      const isEd = editingProduct === product.id;
                      return (
                        <tr
                          key={product.id}
                          className={`border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${
                            product.active === false ? 'opacity-50' : ''
                          }`}
                        >
                          <td className="px-4 py-3">
                            <img
                              src={product.image}
                              alt=""
                              className="w-12 h-12 rounded-xl object-cover bg-slate-100"
                              onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&q=60&w=100'; }}
                            />
                          </td>
                          <td className="px-4 py-3">
                            {isEd ? (
                              <input
                                value={editForm.name || ''}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                className="w-full bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                              />
                            ) : (
                              <div>
                                <p className="text-sm font-semibold text-slate-800">{product.name}</p>
                                {product.scientificName && (
                                  <p className="text-[11px] text-slate-400 italic">{product.scientificName}</p>
                                )}
                                <p className="text-[10px] text-slate-300 font-mono">{product.id}</p>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {isEd ? (
                              <input
                                type="number"
                                value={editForm.price || 0}
                                onChange={(e) => setEditForm({ ...editForm, price: parseInt(e.target.value) || 0 })}
                                className="w-24 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 text-sm text-right focus:outline-none focus:ring-2 focus:ring-amber-300"
                              />
                            ) : (
                              <span className="text-sm font-bold text-slate-800">{formatCOP(product.price)}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {isEd ? (
                              <input
                                type="number"
                                value={editForm.stock ?? 0}
                                onChange={(e) => setEditForm({ ...editForm, stock: parseInt(e.target.value) || 0 })}
                                className="w-20 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 text-sm text-right focus:outline-none focus:ring-2 focus:ring-amber-300"
                              />
                            ) : (
                              <span className={`text-sm font-bold ${
                                product.stock === 0 ? 'text-red-500' : product.stock <= 3 ? 'text-orange-500' : 'text-slate-700'
                              }`}>{product.stock}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => onToggleActive(product.id)}
                              className={`text-xs px-3 py-1.5 rounded-full font-bold transition-colors ${
                                product.active !== false
                                  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                  : 'bg-red-100 text-red-700 hover:bg-red-200'
                              }`}
                            >
                              {product.active !== false ? 'Activo' : 'Inactivo'}
                            </button>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {isEd ? (
                              <div className="flex gap-1 justify-center">
                                <button onClick={() => saveEdit(product.id)} className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors">
                                  <Save className="w-4 h-4" />
                                </button>
                                <button onClick={() => setEditingProduct(null)} className="p-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <button onClick={() => startEdit(product)} className="p-1.5 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors">
                                <Edit3 className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {filteredProducts.length > 50 && (
                <div className="px-4 py-3 bg-slate-50 text-center text-xs text-slate-400">
                  Mostrando 50 de {filteredProducts.length} productos. Usa los filtros para encontrar lo que buscas.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════ CLIENTS ══════ */}
        {adminTab === 'clients' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Gestión de Clientes</h3>
            <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
              Los clientes están almacenados en Supabase. Aquí podrás ver, buscar y gestionar tus clientes registrados.
            </p>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-medium">
              <RefreshCw className="w-4 h-4" />
              Conectar con Supabase para ver clientes
            </div>
            <p className="text-xs text-slate-400 mt-4">
              Próximamente: integración directa con la base de datos para gestión completa de clientes.
            </p>
          </div>
        )}

        {/* ══════ ORDERS ══════ */}
        {adminTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Gestión de Pedidos</h3>
            <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
              Los pedidos están almacenados en Supabase. Aquí podrás ver el historial, cambiar estados y gestionar entregas.
            </p>
            <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-xl text-sm font-medium">
              <RefreshCw className="w-4 h-4" />
              Conectar con Supabase para ver pedidos
            </div>
            <p className="text-xs text-slate-400 mt-4">
              Próximamente: vista de pedidos en tiempo real con estados y notificaciones.
            </p>
          </div>
        )}

        {/* ══════ SQL HISTORY ══════ */}
        {adminTab === 'sqlhistory' && (
          <div className="space-y-4">
            {/* Header info */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                  <Database className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">SQL Migration History</h3>
                  <p className="text-xs text-slate-400">
                    {MIGRATIONS.length} migraciones &middot; {MIGRATIONS.filter(m => appliedMap[m.id] || m.appliedAt).length} aplicadas
                  </p>
                </div>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg font-medium">
                  <CheckCircle2 className="w-3 h-3" /> Aplicado
                </span>
                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg font-medium">
                  <Clock className="w-3 h-3" /> Pendiente
                </span>
              </div>
            </div>

            {/* Migration List */}
            <div className="space-y-3">
              {MIGRATIONS.map((migration, idx) => {
                const isExpanded = expandedMigration === migration.id;
                const isApplied = !!(appliedMap[migration.id] || migration.appliedAt);
                const isCopied = copiedId === migration.id;

                return (
                  <div key={migration.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    {/* Migration header — clickable */}
                    <button
                      onClick={() => setExpandedMigration(isExpanded ? null : migration.id)}
                      className="w-full flex items-center gap-4 p-5 text-left hover:bg-slate-50 transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isApplied ? 'bg-emerald-100' : 'bg-amber-100'
                      }`}>
                        {isApplied
                          ? <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          : <Clock className="w-4 h-4 text-amber-600" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-mono text-slate-400">#{String(idx + 1).padStart(3, '0')}</span>
                          <span className="text-sm font-bold text-slate-800 truncate">{migration.title}</span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1">{migration.description}</p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Creado: {migration.createdAt}
                          {isApplied && <> &middot; Aplicado: {appliedMap[migration.id] ? new Date(appliedMap[migration.id]).toLocaleDateString() : migration.appliedAt}</>}
                        </p>
                      </div>
                      <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>

                    {/* Expanded SQL content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-slate-100 px-5 pb-5">
                            {/* Action buttons */}
                            <div className="flex items-center gap-2 py-3 flex-wrap">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(migration.sql);
                                  setCopiedId(migration.id);
                                  setTimeout(() => setCopiedId(null), 2000);
                                }}
                                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                  isCopied
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
                                }`}
                              >
                                {isCopied ? <><Check className="w-3.5 h-3.5" /> Copiado</> : <><Copy className="w-3.5 h-3.5" /> Copiar SQL</>}
                              </button>

                              <button
                                onClick={() => {
                                  if (isApplied) {
                                    const updated = unmarkMigrationApplied(migration.id);
                                    setAppliedMap({ ...updated });
                                  } else {
                                    const updated = markMigrationApplied(migration.id);
                                    setAppliedMap({ ...updated });
                                  }
                                }}
                                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                  isApplied
                                    ? 'bg-emerald-100 text-emerald-700 hover:bg-red-100 hover:text-red-600'
                                    : 'bg-amber-100 text-amber-700 hover:bg-emerald-100 hover:text-emerald-700'
                                }`}
                              >
                                {isApplied
                                  ? <><CheckCircle2 className="w-3.5 h-3.5" /> Aplicado</>
                                  : <><Clock className="w-3.5 h-3.5" /> Marcar como aplicado</>
                                }
                              </button>
                            </div>

                            {/* SQL code block */}
                            <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto max-h-96 overflow-y-auto">
                              <pre className="text-xs text-slate-300 font-mono leading-relaxed whitespace-pre">
                                {migration.sql}
                              </pre>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* How to add migrations info */}
            <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-6 text-center">
              <p className="text-sm text-slate-500">
                Las migraciones se registran en <code className="bg-slate-200 px-1.5 py-0.5 rounded text-xs font-mono">src/migrations.ts</code>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Cada cambio de schema o datos se agrega como una nueva entrada en el array MIGRATIONS.
              </p>
            </div>
          </div>
        )}

        {/* ══════ BUG REPORTS ══════ */}
        {adminTab === 'bugs' && (
          <div className="space-y-4">
            {/* Header */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <Bug className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Bug Reports</h3>
                  <p className="text-xs text-slate-400">
                    {bugs.length} reportes &middot; {bugs.filter(b => b.status === 'open').length} abiertos
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={bugFilter}
                  onChange={(e) => setBugFilter(e.target.value)}
                  className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-red-500 outline-none"
                >
                  <option value="all">Todos</option>
                  <option value="open">Abiertos</option>
                  <option value="in_progress">En progreso</option>
                  <option value="resolved">Resueltos</option>
                  <option value="closed">Cerrados</option>
                </select>
                <button
                  onClick={() => setShowBugForm(true)}
                  className="inline-flex items-center gap-1.5 bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-600 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Nuevo Bug
                </button>
              </div>
            </div>

            {/* New Bug Form */}
            <AnimatePresence>
              {showBugForm && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-white rounded-2xl border border-red-200 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-800">Reportar Bug</h4>
                      <button onClick={() => setShowBugForm(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                        <X className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Titulo del bug *"
                      value={bugForm.title}
                      onChange={(e) => setBugForm({ ...bugForm, title: e.target.value })}
                      className="w-full bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
                    />
                    <textarea
                      placeholder="Descripcion detallada..."
                      value={bugForm.description}
                      onChange={(e) => setBugForm({ ...bugForm, description: e.target.value })}
                      rows={3}
                      className="w-full bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none resize-none"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <select
                        value={bugForm.priority}
                        onChange={(e) => setBugForm({ ...bugForm, priority: e.target.value })}
                        className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-red-500 outline-none"
                      >
                        <option value="low">Prioridad: Baja</option>
                        <option value="medium">Prioridad: Media</option>
                        <option value="high">Prioridad: Alta</option>
                        <option value="critical">Prioridad: Critica</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Pagina/Seccion"
                        value={bugForm.page}
                        onChange={(e) => setBugForm({ ...bugForm, page: e.target.value })}
                        className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-red-500 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Pasos para reproducir"
                        value={bugForm.steps}
                        onChange={(e) => setBugForm({ ...bugForm, steps: e.target.value })}
                        className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-red-500 outline-none"
                      />
                    </div>
                    <button
                      onClick={createBug}
                      disabled={!bugForm.title.trim() || savingBug}
                      className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      {savingBug ? 'Guardando...' : 'Crear Bug Report'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bug List */}
            {bugsLoading ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <RefreshCw className="w-8 h-8 text-slate-300 animate-spin mx-auto mb-3" />
                <p className="text-sm text-slate-400">Cargando bugs...</p>
              </div>
            ) : bugs.filter(b => bugFilter === 'all' || b.status === bugFilter).length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <Bug className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <p className="text-sm text-slate-400">No hay bugs {bugFilter !== 'all' ? `con estado "${bugFilter}"` : 'reportados'}.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bugs.filter(b => bugFilter === 'all' || b.status === bugFilter).map((bug) => {
                  const priorityColors: Record<string, string> = {
                    low: 'bg-blue-100 text-blue-700',
                    medium: 'bg-amber-100 text-amber-700',
                    high: 'bg-orange-100 text-orange-700',
                    critical: 'bg-red-100 text-red-700',
                  };
                  const statusColors: Record<string, string> = {
                    open: 'bg-red-100 text-red-700',
                    in_progress: 'bg-amber-100 text-amber-700',
                    resolved: 'bg-emerald-100 text-emerald-700',
                    closed: 'bg-slate-100 text-slate-500',
                  };
                  const statusLabels: Record<string, string> = {
                    open: 'Abierto',
                    in_progress: 'En progreso',
                    resolved: 'Resuelto',
                    closed: 'Cerrado',
                  };
                  const nextStatus: Record<string, string> = {
                    open: 'in_progress',
                    in_progress: 'resolved',
                    resolved: 'closed',
                  };

                  return (
                    <div key={bug.id} className="bg-white rounded-2xl border border-slate-200 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${priorityColors[bug.priority] || ''}`}>
                              {bug.priority}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColors[bug.status] || ''}`}>
                              {statusLabels[bug.status] || bug.status}
                            </span>
                            <span className="text-[10px] text-slate-400">#{bug.id}</span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-800 mb-1">{bug.title}</h4>
                          {bug.description && <p className="text-xs text-slate-500 mb-2">{bug.description}</p>}
                          <div className="flex gap-4 text-[10px] text-slate-400">
                            <span>Por: {bug.reportedBy}</span>
                            {bug.page && <span>Pagina: {bug.page}</span>}
                            <span>{new Date(bug.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        {nextStatus[bug.status] && (
                          <button
                            onClick={() => updateBugStatus(bug.id, nextStatus[bug.status])}
                            className="shrink-0 text-xs font-bold px-4 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-700 transition-colors"
                          >
                            → {statusLabels[nextStatus[bug.status]]}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
