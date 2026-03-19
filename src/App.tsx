import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  User as UserIcon,
  X,
  ChevronRight,
  ChevronDown,
  Plus,
  Minus,
  Trash2,
  Fish,
  Leaf,
  Phone,
  Mail,
  MapPin,
  Thermometer,
  Utensils,
  Droplets,
  Mountain,
  Gauge,
  Lightbulb,
  CheckCircle2,
  Shell,
  CircleDot,
  Star,
  Heart,
  Sparkles,
  Eye,
  EyeOff,
  Menu,
  Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCTS } from './constants';
import { Product, CartItem, Category, User } from './types';

// Custom Shrimp SVG icon
const ShrimpIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 4c-2 0-3.5 1-4.5 2.5C12.5 8 12 10 12 12c0 2-1 4-3 5s-4 1-5 0" />
    <path d="M16 8c1.5 0 3-.5 3-2" />
    <path d="M14 10c1 0 2.5-.5 3-1.5" />
    <path d="M4 17c0 0 1 2 4 2s4-1 5-2" />
    <circle cx="17" cy="5" r="0.5" fill="currentColor" />
  </svg>
);

// Custom Pump/Valve SVG icon
const PumpIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="8" width="12" height="10" rx="2" />
    <path d="M12 4v4" />
    <path d="M9 4h6" />
    <path d="M6 13H3" />
    <path d="M21 13h-3" />
    <circle cx="12" cy="13" r="2" />
    <path d="M12 18v2" />
  </svg>
);

// Category data with previews and subcategories
const CATEGORY_DATA: Record<string, {
  icon: any;
  color: string;
  gradient: string;
  preview: string[];
  subcategories: string[];
}> = {
  'Peces': {
    icon: Fish,
    color: 'bg-blue-500',
    gradient: 'from-blue-500 to-blue-600',
    preview: ['Bettas', 'Corydoras', 'Cuchas', 'Escalares', 'Goldfish', 'Tetras', 'Discos'],
    subcategories: ['Cíclidos', 'Characiformes', 'Siluriformes', 'Laberintos', 'Vivíparos', 'Loricáridos']
  },
  'Plantas': {
    icon: Leaf,
    color: 'bg-green-500',
    gradient: 'from-green-500 to-green-600',
    preview: ['Anubias', 'Helecho de Java', 'Musgo', 'Vallisneria'],
    subcategories: ['Primer plano', 'Medio', 'Fondo', 'Flotantes']
  },
  'Camarones': {
    icon: ShrimpIcon,
    color: 'bg-red-400',
    gradient: 'from-red-400 to-red-500',
    preview: ['Cherry', 'Fantasma', 'Amano', 'Crystal Red'],
    subcategories: ['Neocaridina', 'Caridina', 'Abanicos']
  },
  'Plantados': {
    icon: Leaf,
    color: 'bg-emerald-600',
    gradient: 'from-emerald-500 to-emerald-700',
    preview: ['CO2', 'Sustratos', 'Fertilizantes', 'Tijeras', 'Pinzas'],
    subcategories: ['Sustratos', 'CO2', 'Herramientas', 'Fertilizantes']
  },
  'Termostatos': {
    icon: Thermometer,
    color: 'bg-orange-500',
    gradient: 'from-orange-400 to-orange-600',
    preview: ['Calentadores', 'Reguladores', 'Termómetros digitales'],
    subcategories: ['Calentadores', 'Enfriadores', 'Termómetros']
  },
  'Filtros': {
    icon: PumpIcon,
    color: 'bg-indigo-500',
    gradient: 'from-indigo-500 to-indigo-600',
    preview: ['Bombas de aire', 'Filtros de cascada', 'Esponjas', 'Canister'],
    subcategories: ['Internos', 'Externos', 'Cascada', 'Esponja', 'Bombas']
  },
  'Alimentos': {
    icon: Utensils,
    color: 'bg-yellow-500',
    gradient: 'from-yellow-400 to-yellow-600',
    preview: ['Hojuelas', 'Pellets', 'Artemia', 'Gusanos', 'Spirulina'],
    subcategories: ['Escamas', 'Pellets', 'Vivo', 'Liofilizado']
  },
  'Acondicionadores': {
    icon: Droplets,
    color: 'bg-cyan-500',
    gradient: 'from-cyan-400 to-cyan-600',
    preview: ['Anticloro', 'Bacterias', 'Azul de metileno', 'Sal marina'],
    subcategories: ['Acondicionadores', 'Bacterias', 'Medicamentos', 'Sales']
  },
  'Gravilla': {
    icon: Mountain,
    color: 'bg-stone-500',
    gradient: 'from-stone-400 to-stone-600',
    preview: ['Arena silica', 'Grava natural', 'Piedras decorativas'],
    subcategories: ['Arena', 'Grava', 'Piedras', 'Decoración']
  },
  'Medidores': {
    icon: Gauge,
    color: 'bg-rose-500',
    gradient: 'from-rose-400 to-rose-600',
    preview: ['pH', 'Temperatura', 'TDS', 'Dureza', 'Amonio'],
    subcategories: ['pH', 'Temperatura', 'Químicos', 'Digitales']
  },
  'Lamparas': {
    icon: Lightbulb,
    color: 'bg-amber-400',
    gradient: 'from-amber-300 to-amber-500',
    preview: ['LED', 'RGB', 'Crecimiento plantas', 'Clip', 'Sumergibles'],
    subcategories: ['LED', 'Fluorescentes', 'Para plantas', 'Decorativas']
  },
};

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<Category | 'Inicio'>('Inicio');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [registrationForm, setRegistrationForm] = useState<User>({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [modalStep, setModalStep] = useState<'welcome' | 'register' | 'profile'>('welcome');

  // Load products from JSON (generated by sync_products.py) with fallback to constants
  useEffect(() => {
    fetch('/products.json')
      .then(res => {
        if (!res.ok) throw new Error('No products.json');
        return res.json();
      })
      .then((data: Product[]) => {
        setProducts(data.map(p => ({ ...p, active: true })));
        setIsLoading(false);
      })
      .catch(() => {
        // Fallback to hardcoded constants
        setProducts(PRODUCTS.map(p => ({ ...p, active: true })));
        setIsLoading(false);
      });
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (!isAdmin) {
      result = result.filter(p => p.active !== false);
    }
    if (activeTab !== 'Inicio') {
      result = result.filter(p => p.category === activeTab);
    }
    if (searchQuery) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.scientificName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return result;
  }, [products, activeTab, searchQuery, isAdmin]);

  const productCountByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      const currentQty = existing ? existing.quantity : 0;
      if (currentQty >= product.stock) {
        alert('No hay suficiente stock disponible.');
        return prev;
      }
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const product = products.find(p => p.id === productId);
        const maxStock = product ? product.stock : item.quantity;
        const newQty = Math.min(Math.max(1, item.quantity + delta), maxStock);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(registrationForm);
    setIsUserModalOpen(false);
    setModalStep('welcome');
  };

  const openUserModal = () => {
    if (user) {
      setModalStep('profile');
    } else {
      setModalStep('welcome');
    }
    setIsUserModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="bg-brand-blue text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">
          {/* Hamburger */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors shrink-0"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer shrink-0"
            onClick={() => setActiveTab('Inicio')}
          >
            <img
              src="https://i.postimg.cc/Z0zT6rJy/logo-entre-peces.png"
              alt="Entre Peces Logo"
              className="w-9 h-9 object-contain"
              referrerPolicy="no-referrer"
            />
            <h1 className="text-xl font-bold tracking-tighter hidden sm:block">Entre Peces</h1>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar peces, plantas, accesorios..."
                className="w-full bg-white text-slate-800 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300 transition-all placeholder:text-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={openUserModal}
              className="flex items-center gap-2 hover:bg-white/10 py-2 px-3 rounded-full transition-colors"
            >
              <UserIcon className="w-5 h-5" />
              <span className="hidden lg:inline text-sm font-medium">
                {user ? user.name.split(' ')[0] : 'Ingresar'}
              </span>
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-brand-blue"
                >
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ===== SIDEBAR DRAWER ===== */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 shadow-2xl flex flex-col"
            >
              {/* Sidebar Header */}
              <div className="bg-gradient-to-r from-brand-blue to-brand-dark p-5 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://i.postimg.cc/Z0zT6rJy/logo-entre-peces.png"
                      alt="Logo"
                      className="w-10 h-10"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h2 className="font-bold text-lg">Entre Peces</h2>
                      <p className="text-white/60 text-xs">Marketplace acuariofilia</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto">
                {/* Inicio */}
                <button
                  onClick={() => { setActiveTab('Inicio'); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-colors ${
                    activeTab === 'Inicio'
                      ? 'bg-brand-blue/10 text-brand-blue border-r-3 border-brand-blue'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span>Inicio</span>
                </button>

                <div className="h-px bg-slate-100 mx-4 my-1" />

                {/* Categorías con subcategorías */}
                <div className="py-1">
                  <p className="px-5 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Categorías</p>

                  {Object.entries(CATEGORY_DATA).map(([name, cat]) => {
                    const CatIcon = cat.icon;
                    const isExpanded = expandedCategory === name;
                    const isActive = activeTab === name;
                    const count = productCountByCategory[name] || 0;

                    return (
                      <div key={name}>
                        {/* Category row */}
                        <div className={`flex items-center ${isActive ? 'bg-brand-blue/5' : ''}`}>
                          <button
                            onClick={() => { setActiveTab(name as any); setIsSidebarOpen(false); }}
                            className={`flex-1 flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors ${
                              isActive
                                ? 'text-brand-blue'
                                : 'text-slate-700 hover:text-brand-blue'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg ${cat.color} flex items-center justify-center text-white shrink-0`}>
                              <CatIcon className="w-4 h-4" />
                            </div>
                            <span className="flex-1 text-left">{name}</span>
                            <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">{count}</span>
                          </button>

                          {/* Expand/collapse toggle */}
                          {cat.subcategories.length > 0 && (
                            <button
                              onClick={() => setExpandedCategory(isExpanded ? null : name)}
                              className="p-3 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                          )}
                        </div>

                        {/* Subcategories */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="bg-slate-50 py-1 ml-5 mr-3 rounded-lg mb-1">
                                {cat.subcategories.map((sub) => (
                                  <button
                                    key={sub}
                                    onClick={() => { setActiveTab(name as any); setIsSidebarOpen(false); }}
                                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-600 hover:text-brand-blue hover:bg-white rounded-md transition-colors"
                                  >
                                    <CircleDot className="w-2.5 h-2.5 text-slate-300" />
                                    {sub}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sidebar Footer */}
              <div className="border-t border-slate-100 p-4">
                <button
                  onClick={() => { openUserModal(); setIsSidebarOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <UserIcon className="w-5 h-5" />
                  <span>{user ? user.name : 'Iniciar sesión'}</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {/* Hero Section for Home */}
        {activeTab === 'Inicio' && !searchQuery && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 relative rounded-3xl overflow-hidden aspect-[21/9] bg-brand-dark flex items-center"
          >
            <img
              src="https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&q=80&w=1200"
              alt="Aquarium"
              className="absolute inset-0 w-full h-full object-cover opacity-40"
              referrerPolicy="no-referrer"
            />
            <div className="relative z-10 px-8 md:px-12 max-w-2xl">
              <h2 className="text-3xl md:text-6xl font-bold text-white mb-4 leading-tight">
                Tu pasión por el agua, <br />
                <span className="text-cyan-300">en un solo lugar.</span>
              </h2>
              <p className="text-white/80 text-base md:text-lg mb-8">
                Descubre la mejor selección de peces, plantas y accesorios para tu acuario en Colombia.
              </p>
              <button
                onClick={() => setActiveTab('Peces')}
                className="bg-white text-brand-dark px-8 py-3 rounded-full font-bold hover:bg-cyan-50 transition-colors flex items-center gap-2"
              >
                Ver Catálogo <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.section>
        )}

        {/* Categories Grid with hover previews */}
        {activeTab === 'Inicio' && !searchQuery && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
            {Object.entries(CATEGORY_DATA).map(([name, cat]) => {
              const CatIcon = cat.icon;
              const count = productCountByCategory[name] || 0;
              return (
                <motion.button
                  key={name}
                  whileHover={{ y: -4 }}
                  onClick={() => setActiveTab(name as any)}
                  className="group p-5 rounded-2xl bg-white border border-slate-200 hover:border-transparent hover:shadow-xl transition-all text-left relative overflow-hidden"
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`${cat.color} w-11 h-11 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg`}>
                        <CatIcon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        {count}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-800 group-hover:text-brand-blue transition-colors mb-1">{name}</h3>

                    {/* Preview text - visible on hover */}
                    <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-300">
                      <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                        {cat.preview.join(' · ')}
                      </p>
                    </div>
                    <p className="text-slate-400 text-[10px] mt-1 group-hover:hidden">Explorar catálogo</p>
                  </div>

                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Product Grid */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            {activeTab === 'Inicio' ? 'Productos Destacados' : activeTab}
          </h2>
          <span className="text-slate-500 text-sm">{filteredProducts.length} productos</span>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            >
              <Fish className="w-12 h-12 text-brand-blue" />
            </motion.div>
            <p className="text-slate-500 mt-4">Cargando productos...</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <motion.div
              layout
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow group"
            >
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 right-2">
                  <span className="bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    {product.category}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-slate-900 group-hover:text-brand-blue transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mb-2 min-h-[18px]">
                  {product.scientificName && (
                    <p className="text-xs italic text-slate-500">{product.scientificName}</p>
                  )}
                  {product.size && (
                    <span className="text-[10px] font-bold bg-brand-blue/10 text-brand-blue px-1.5 py-0.5 rounded-md shrink-0">
                      {product.size}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600 line-clamp-2 mb-4 h-10">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-lg font-bold text-brand-dark">
                    ${product.price.toLocaleString('es-CO')}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium ${product.stock > 0 ? 'text-slate-500' : 'text-red-500'}`}>
                      {product.stock > 0 ? `Stock: ${product.stock}` : 'Agotado'}
                    </span>
                    <button
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                      className="bg-brand-blue text-white p-2 rounded-xl hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                {isAdmin && (
                  <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500">Admin:</span>
                    <button
                      onClick={() => setProducts(prev => prev.map(p => p.id === product.id ? { ...p, active: !p.active } : p))}
                      className={`text-xs px-3 py-1 rounded-full font-bold transition-colors ${
                        product.active !== false
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {product.active !== false ? 'Activo' : 'Inactivo'}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 text-white mb-4">
              <img
                src="https://i.postimg.cc/Z0zT6rJy/logo-entre-peces.png"
                alt="Entre Peces Logo"
                className="w-10 h-10 object-contain"
                referrerPolicy="no-referrer"
              />
              <h2 className="text-2xl font-bold">Entre Peces</h2>
              <button
                onClick={() => setIsAdmin(!isAdmin)}
                className={`ml-4 text-xs px-2 py-1 rounded border transition-colors ${
                  isAdmin ? 'bg-brand-blue text-white border-brand-blue' : 'border-slate-600 text-slate-500 hover:text-white'
                }`}
              >
                Admin
              </button>
            </div>
            <p className="max-w-sm mb-6">
              El primer marketplace especializado en acuariofilia de agua dulce en Colombia.
              Calidad, variedad y pasión por el acuarismo.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:text-brand-blue cursor-pointer transition-colors">
                <Phone className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:text-brand-blue cursor-pointer transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:text-brand-blue cursor-pointer transition-colors">
                <MapPin className="w-5 h-5" />
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Categorías</h4>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              {Object.keys(CATEGORY_DATA).map(cat => (
                <li key={cat} className="hover:text-white cursor-pointer transition-colors" onClick={() => setActiveTab(cat as any)}>{cat}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Información</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer transition-colors">Sobre Nosotros</li>
              <li className="hover:text-white cursor-pointer transition-colors">Envíos Nacionales</li>
              <li className="hover:text-white cursor-pointer transition-colors">Términos y Condiciones</li>
              <li className="hover:text-white cursor-pointer transition-colors">Privacidad</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-xs">
          &copy; {new Date().getFullYear()} Entre Peces Colombia. Todos los derechos reservados.
        </div>
      </footer>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b flex items-center justify-between bg-brand-blue text-white">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6" />
                  <h2 className="text-xl font-bold">Tu Carrito</h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/10 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                    <p className="text-lg">Tu carrito está vacío</p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="mt-4 text-brand-blue font-bold hover:underline"
                    >
                      Empezar a comprar
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 rounded-xl object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-900">{item.name}</h4>
                          <p className="text-brand-dark font-bold mb-2">
                            ${(item.price * item.quantity).toLocaleString('es-CO')}
                          </p>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center border rounded-lg">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="p-1 hover:bg-slate-100"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="p-1 hover:bg-slate-100"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 border-t bg-slate-50">
                <div className="flex justify-between mb-4">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="text-xl font-bold text-slate-900">
                    ${cartTotal.toLocaleString('es-CO')}
                  </span>
                </div>
                <button
                  disabled={cart.length === 0}
                  onClick={() => {
                    if (!user) {
                      setIsUserModalOpen(true);
                      setIsCartOpen(false);
                      setModalStep('welcome');
                    } else {
                      alert('¡Gracias por tu pedido! En breve te contactaremos por WhatsApp.');
                      setProducts(prev => prev.map(p => {
                        const cartItem = cart.find(item => item.id === p.id);
                        if (cartItem) {
                          return { ...p, stock: p.stock - cartItem.quantity };
                        }
                        return p;
                      }));
                      setCart([]);
                      setIsCartOpen(false);
                    }
                  }}
                  className="w-full bg-brand-blue text-white py-4 rounded-2xl font-bold hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {user ? 'Finalizar Pedido' : 'Registrarse para Comprar'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ===== NEW USER MODAL ===== */}
      <AnimatePresence>
        {isUserModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsUserModalOpen(false); setModalStep('welcome'); }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Animated header with gradient + bubbles */}
              <div className="relative bg-gradient-to-br from-brand-blue via-brand-dark to-cyan-700 p-8 text-white text-center overflow-hidden">
                {/* Floating bubbles animation */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full bg-white/10"
                      style={{
                        width: 8 + i * 6,
                        height: 8 + i * 6,
                        left: `${15 + i * 14}%`,
                        bottom: -20,
                      }}
                      animate={{
                        y: [-20, -150 - i * 20],
                        opacity: [0, 0.6, 0],
                      }}
                      transition={{
                        duration: 3 + i * 0.5,
                        repeat: Infinity,
                        delay: i * 0.4,
                        ease: 'easeOut',
                      }}
                    />
                  ))}
                </div>

                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="relative z-10"
                >
                  {/* Logo */}
                  <motion.img
                    src="https://i.postimg.cc/Z0zT6rJy/logo-entre-peces.png"
                    alt="Entre Peces"
                    className="w-20 h-20 mx-auto mb-4 drop-shadow-lg"
                    referrerPolicy="no-referrer"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  />

                  <h2 className="text-2xl font-bold mb-1">
                    {modalStep === 'profile' ? `Hola, ${user?.name.split(' ')[0]}` : modalStep === 'register' ? 'Crear tu cuenta' : 'Bienvenido a'}
                  </h2>
                  {modalStep === 'welcome' && (
                    <h2 className="text-3xl font-bold">
                      <span className="text-cyan-300">Entre Peces</span>
                    </h2>
                  )}
                  <p className="text-white/70 text-sm mt-2">
                    {modalStep === 'profile'
                      ? 'Tu información de cuenta'
                      : modalStep === 'register'
                      ? 'Completa tus datos para empezar a comprar'
                      : 'Tu marketplace de acuariofilia favorito'}
                  </p>
                </motion.div>
              </div>

              <div className="p-6">
                <AnimatePresence mode="wait">
                  {/* WELCOME STEP */}
                  {modalStep === 'welcome' && !user && (
                    <motion.div
                      key="welcome"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      {/* Benefits */}
                      <div className="space-y-3 mb-6">
                        {[
                          { icon: Star, text: 'Accede a ofertas exclusivas', color: 'text-yellow-500' },
                          { icon: ShoppingBag, text: 'Rastrea tus pedidos fácilmente', color: 'text-brand-blue' },
                          { icon: Heart, text: 'Guarda tus favoritos', color: 'text-red-400' },
                          { icon: Sparkles, text: 'Envíos a toda Colombia', color: 'text-cyan-500' },
                        ].map((benefit, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + i * 0.08 }}
                            className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl"
                          >
                            <benefit.icon className={`w-5 h-5 ${benefit.color}`} />
                            <span className="text-sm text-slate-700 font-medium">{benefit.text}</span>
                          </motion.div>
                        ))}
                      </div>

                      <button
                        onClick={() => setModalStep('register')}
                        className="w-full bg-gradient-to-r from-brand-blue to-cyan-600 text-white py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-brand-blue/25 transition-all active:scale-[0.98]"
                      >
                        Crear cuenta gratis
                      </button>
                      <p className="text-center text-xs text-slate-400">
                        Ya tengo cuenta? <button className="text-brand-blue font-bold hover:underline">Iniciar sesión</button>
                      </p>
                    </motion.div>
                  )}

                  {/* REGISTER STEP */}
                  {modalStep === 'register' && (
                    <motion.form
                      key="register"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onSubmit={handleRegister}
                      className="space-y-3"
                    >
                      {[
                        { label: 'Nombre completo', type: 'text', placeholder: 'Ej. Juan Pérez', field: 'name' as const, icon: UserIcon },
                        { label: 'Correo electrónico', type: 'email', placeholder: 'juan@ejemplo.com', field: 'email' as const, icon: Mail },
                        { label: 'Celular', type: 'tel', placeholder: '300 123 4567', field: 'phone' as const, icon: Phone },
                        { label: 'Dirección de envío', type: 'text', placeholder: 'Calle 123 #45-67, Ciudad', field: 'address' as const, icon: MapPin },
                      ].map((input, i) => (
                        <motion.div
                          key={input.field}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06 }}
                        >
                          <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">{input.label}</label>
                          <div className="relative">
                            <input.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              required
                              type={input.type}
                              className="w-full bg-slate-50 px-4 py-3 pl-10 rounded-xl border border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-sm"
                              placeholder={input.placeholder}
                              value={registrationForm[input.field]}
                              onChange={e => setRegistrationForm({...registrationForm, [input.field]: e.target.value})}
                            />
                          </div>
                        </motion.div>
                      ))}

                      <div className="pt-2 space-y-3">
                        <button
                          type="submit"
                          className="w-full bg-gradient-to-r from-brand-blue to-cyan-600 text-white py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-brand-blue/25 transition-all active:scale-[0.98]"
                        >
                          Registrarme
                        </button>
                        <button
                          type="button"
                          onClick={() => setModalStep('welcome')}
                          className="w-full text-slate-400 text-sm hover:text-slate-600 transition-colors"
                        >
                          Volver
                        </button>
                      </div>
                    </motion.form>
                  )}

                  {/* PROFILE STEP (logged in) */}
                  {(modalStep === 'profile' || (modalStep === 'welcome' && user)) && user && (
                    <motion.div
                      key="profile"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-3"
                    >
                      {[
                        { icon: CheckCircle2, label: 'Nombre', value: user.name, iconColor: 'text-green-500' },
                        { icon: Mail, label: 'Correo', value: user.email, iconColor: 'text-brand-blue' },
                        { icon: Phone, label: 'Celular', value: user.phone, iconColor: 'text-brand-blue' },
                        { icon: MapPin, label: 'Dirección', value: user.address, iconColor: 'text-brand-blue' },
                      ].map((field, i) => (
                        <motion.div
                          key={field.label}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors"
                        >
                          <field.icon className={`w-5 h-5 ${field.iconColor} shrink-0`} />
                          <div className="min-w-0">
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{field.label}</p>
                            <p className="font-medium text-sm text-slate-800 truncate">{field.value}</p>
                          </div>
                        </motion.div>
                      ))}

                      <div className="pt-3 space-y-2">
                        <button
                          onClick={() => { setUser(null); setModalStep('welcome'); }}
                          className="w-full py-3 text-red-500 text-sm font-medium hover:bg-red-50 rounded-xl transition-colors"
                        >
                          Cerrar sesión
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={() => { setIsUserModalOpen(false); setModalStep('welcome'); }}
                  className="w-full mt-3 text-slate-300 text-xs hover:text-slate-500 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
