import React, { useState, useMemo, useEffect, useCallback } from 'react';
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
  CircleDot,
  Star,
  Heart,
  Sparkles,
  Eye,
  EyeOff,
  Menu,
  Home,
  SearchX,
  AlertCircle,
  BookOpen,
  Newspaper,
  Lightbulb as LightbulbIcon,
  Table2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCTS } from './constants';
import { Product, CartItem, Category, User } from './types';
import CompatibilityTable from './CompatibilityTable';
import HeroCarousel from './HeroCarousel';

// ── Constants ──────────────────────────────────────────────────────────
const WHATSAPP_NUMBER = '573124380879';
const FREE_SHIPPING_THRESHOLD = 200000;
const PRODUCTS_PER_PAGE = 20;
const API_URL = import.meta.env.DEV ? 'http://localhost:3001' : '';
const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&q=60&w=400';

// Payment methods
const PAYMENT_METHODS = [
  {
    id: 'nequi',
    name: 'Nequi',
    description: 'Escanea el QR con tu app Nequi',
    color: 'bg-[#200020]',
    textColor: 'text-white',
    qrImage: '/payment/nequi-qr.jpg',
    available: true,
  },
  {
    id: 'daviplata',
    name: 'Daviplata',
    description: 'Próximamente',
    color: 'bg-red-600',
    textColor: 'text-white',
    qrImage: null,
    available: false,
  },
  {
    id: 'bold',
    name: 'Bold (Datáfono)',
    description: 'Solicitar link de pago por WhatsApp',
    color: 'bg-blue-700',
    textColor: 'text-white',
    qrImage: null,
    available: true,
  },
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    description: 'Próximamente',
    color: 'bg-orange-500',
    textColor: 'text-white',
    qrImage: null,
    available: false,
  },
];

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

// Social media SVG icons
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

// Category data with previews and subcategories
const CATEGORY_DATA: Record<string, {
  icon: React.ComponentType<{ className?: string }>;
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
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('entrepeces_cart');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('entrepeces_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
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
  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc' | 'name'>('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isCompatOpen, setIsCompatOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCheckoutFormOpen, setIsCheckoutFormOpen] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    nombre: '',
    celular: '',
    direccion: '',
    fecha: '',
    hora: '',
  });
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('entrepeces_favs');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // Persist favorites
  useEffect(() => {
    localStorage.setItem('entrepeces_favs', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback((productId: string) => {
    setFavorites(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  }, []);

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem('entrepeces_cart', JSON.stringify(cart));
  }, [cart]);

  // Persist user to localStorage
  useEffect(() => {
    if (user) localStorage.setItem('entrepeces_user', JSON.stringify(user));
    else localStorage.removeItem('entrepeces_user');
  }, [user]);

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
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.scientificName?.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    // Sort
    switch (sortBy) {
      case 'price-asc':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return result;
  }, [products, activeTab, searchQuery, isAdmin, sortBy]);

  // Reset page when filters change
  useEffect(() => { setCurrentPage(1); }, [activeTab, searchQuery, sortBy]);

  // Paginated products - Home shows only 8 featured, categories paginate normally
  const isHomeFeatured = activeTab === 'Inicio' && !searchQuery;
  const totalPages = isHomeFeatured ? 1 : Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    if (isHomeFeatured) {
      // Show top 8 products from Peces category (most popular) sorted by price desc
      return [...filteredProducts]
        .filter(p => p.category === 'Peces')
        .sort((a, b) => b.price - a.price)
        .slice(0, 8);
    }
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage, isHomeFeatured]);

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    setUser(registrationForm);

    // Save to Google Sheets in background
    try {
      await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationForm),
      });
    } catch {
      // Silent fail - registration saved locally regardless
    }

    setIsRegistering(false);
    setIsUserModalOpen(false);
    setModalStep('welcome');
    // Show thank-you popup
    setShowWelcomePopup(true);
    setTimeout(() => setShowWelcomePopup(false), 5000);
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
        <div className="w-full px-6 md:px-10 lg:px-16 xl:px-24 h-16 flex items-center gap-6 md:gap-8 lg:gap-12">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-4 md:gap-5 shrink-0">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2.5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => { setActiveTab('Inicio'); setSearchQuery(''); setSortBy('relevance'); setCurrentPage(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              <img
                src="https://i.postimg.cc/Z0zT6rJy/logo-entre-peces.png"
                alt="Entre Peces Logo"
                className="w-10 h-10 object-contain"
                referrerPolicy="no-referrer"
              />
              <h1 className="text-xl font-bold tracking-tight hidden md:block whitespace-nowrap">Entre Peces</h1>
            </div>
          </div>

          {/* Center: Search bar — fills all available space */}
          <div className="flex-1">
            <div className="relative max-w-4xl mx-auto">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar peces, plantas, accesorios..."
                className="w-full bg-white text-slate-800 rounded-full py-3 pl-13 pr-6 text-base tracking-wide focus:outline-none focus:ring-2 focus:ring-cyan-300 transition-all placeholder:text-slate-400 placeholder:tracking-wider"
                style={{ paddingLeft: '52px' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Right: User + Cart — far right edge */}
          <div className="flex items-center gap-3 md:gap-4 shrink-0">
            <button
              onClick={openUserModal}
              className="flex items-center gap-2 hover:bg-white/10 py-2 px-3 md:px-4 rounded-full transition-colors"
            >
              <UserIcon className="w-5 h-5" />
              <span className="hidden lg:inline text-sm font-medium">
                {user ? user.name.split(' ')[0] : 'Ingresar'}
              </span>
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 hover:bg-white/10 rounded-full transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-brand-blue"
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
              <div className="flex-1 overflow-y-auto py-3">
                {/* Inicio */}
                <button
                  onClick={() => { setActiveTab('Inicio'); setSearchQuery(''); setIsSidebarOpen(false); window.scrollTo({ top: 0 }); }}
                  className={`w-full flex items-center gap-4 px-6 py-4 text-sm font-semibold transition-all ${
                    activeTab === 'Inicio'
                      ? 'bg-brand-blue/10 text-brand-blue border-r-4 border-brand-blue'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    <Home className="w-5 h-5 text-slate-600" />
                  </div>
                  <span>Inicio</span>
                </button>

                {/* Conocimiento */}
                <button
                  onClick={() => { setActiveTab('Inicio'); setSearchQuery(''); setIsSidebarOpen(false); window.scrollTo({ top: 0 }); setTimeout(() => document.getElementById('conocimiento')?.scrollIntoView({ behavior: 'smooth' }), 300); }}
                  className="w-full flex items-center gap-4 px-6 py-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-emerald-600" />
                  </div>
                  <span>Conocimiento</span>
                </button>

                <div className="h-px bg-slate-100 mx-6 my-3" />

                {/* Categorías */}
                <p className="px-6 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">Categorías</p>

                <div className="space-y-1 px-3">
                  {Object.entries(CATEGORY_DATA)
                    .filter(([name]) => (productCountByCategory[name] || 0) > 0)
                    .map(([name, cat]) => {
                    const CatIcon = cat.icon;
                    const isExpanded = expandedCategory === name;
                    const isActive = activeTab === name;
                    const count = productCountByCategory[name] || 0;

                    return (
                      <div key={name} className="rounded-xl overflow-hidden">
                        {/* Category row */}
                        <div className={`flex items-center rounded-xl transition-all ${
                          isActive ? 'bg-brand-blue/8' : 'hover:bg-slate-50'
                        }`}>
                          <button
                            onClick={() => { setActiveTab(name as Category); setIsSidebarOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            className={`flex-1 flex items-center gap-3.5 px-3 py-3.5 text-sm font-medium transition-colors ${
                              isActive ? 'text-brand-blue' : 'text-slate-700'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-xl ${cat.color} flex items-center justify-center text-white shrink-0 shadow-sm`}>
                              <CatIcon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 text-left">
                              <span className="block">{name}</span>
                              <span className="text-[10px] text-slate-400 font-normal">{count} productos</span>
                            </div>
                          </button>

                          {/* Expand/collapse toggle - bigger */}
                          {cat.subcategories.length > 0 && (
                            <button
                              onClick={() => setExpandedCategory(isExpanded ? null : name)}
                              className="p-3 mr-1 text-slate-400 hover:text-brand-blue hover:bg-white rounded-lg transition-all"
                            >
                              <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
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
                              <div className="bg-slate-50 py-2 ml-6 mr-2 rounded-xl mb-2">
                                {cat.subcategories.map((sub) => (
                                  <button
                                    key={sub}
                                    onClick={() => { setActiveTab(name as Category); setIsSidebarOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-600 hover:text-brand-blue hover:bg-white rounded-lg transition-colors"
                                  >
                                    <CircleDot className="w-2 h-2 text-slate-300" />
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
              <div className="border-t border-slate-100 p-4 space-y-2">
                {/* Redes sociales */}
                <div className="flex justify-center gap-3 pb-3">
                  <a href="https://wa.me/573124380879" target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center text-white transition-colors">
                    <WhatsAppIcon className="w-4 h-4" />
                  </a>
                  <a href="https://www.facebook.com/entre.peces.2025" target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center text-white transition-colors">
                    <FacebookIcon className="w-4 h-4" />
                  </a>
                  <a href="https://www.instagram.com/entrepecescol/" target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 hover:opacity-80 flex items-center justify-center text-white transition-all">
                    <InstagramIcon className="w-4 h-4" />
                  </a>
                </div>

                <button
                  onClick={() => { setIsCartOpen(true); setIsSidebarOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-brand-blue/5 hover:text-brand-blue rounded-xl transition-colors"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span className="flex-1 text-left">Mi Carrito</span>
                  {cart.length > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                      {cart.reduce((s, i) => s + i.quantity, 0)}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => { openUserModal(); setIsSidebarOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-brand-blue/5 hover:text-brand-blue rounded-xl transition-colors"
                >
                  <UserIcon className="w-5 h-5" />
                  <span>{user ? user.name : 'Iniciar sesión'}</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 max-w-screen-2xl mx-auto w-full px-4 md:px-8 lg:px-12 py-8">
        {/* Hero Section for Home — Carousel */}
        {activeTab === 'Inicio' && !searchQuery && (
          <HeroCarousel onViewCatalog={() => { setActiveTab('Peces'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
        )}

        {/* Categories Grid with hover previews */}
        {activeTab === 'Inicio' && !searchQuery && (
          <div className="mb-12 mt-8 md:mt-10 lg:mt-12">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-6 lg:gap-8">
              {Object.entries(CATEGORY_DATA)
                .filter(([name]) => (productCountByCategory[name] || 0) > 0)
                .map(([name, cat]) => {
                const CatIcon = cat.icon;
                const count = productCountByCategory[name] || 0;
                return (
                  <motion.button
                    key={name}
                    whileHover={{ y: -6, boxShadow: '0 16px 32px rgba(0,0,0,0.1)' }}
                    onClick={() => { setActiveTab(name as Category); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="group p-6 md:p-7 lg:p-8 rounded-2xl bg-white border border-slate-200 hover:border-transparent transition-all text-center relative overflow-hidden"
                  >
                    {/* Gradient overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />

                    <div className="relative z-10 flex flex-col items-center">
                      <div className={`${cat.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg mb-4`}>
                        <CatIcon className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-sm md:text-base text-slate-800 group-hover:text-brand-blue transition-colors mb-2">{name}</h3>
                      <span className="text-[11px] font-medium text-slate-400 mb-2">
                        Disponibles: {count}
                      </span>

                      {/* Preview text - visible on hover */}
                      <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-300">
                        <p className="text-xs text-slate-500 leading-relaxed mt-1">
                          {cat.preview.join(' · ')}
                        </p>
                      </div>
                      <p className="text-brand-blue text-xs font-semibold mt-1 group-hover:underline">Explorar catálogo →</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* ===== CONOCIMIENTO SECTION ===== */}
        {activeTab === 'Inicio' && !searchQuery && (
          <section id="conocimiento" style={{ marginTop: '40px', marginBottom: '40px' }}>
            <div className="text-center mb-10 md:mb-12">
              <div className="flex items-center justify-center gap-3 mb-2">
                <BookOpen className="w-7 h-7 text-emerald-500" />
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Conocimiento</h2>
              </div>
              <p className="text-sm md:text-base text-slate-500">Aprende sobre acuariofilia y mejora tu acuario</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {/* Noticias */}
              <motion.div
                whileHover={{ y: -6 }}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow cursor-pointer group flex flex-col"
              >
                <div className="h-1.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-t-3xl" />
                <div className="p-7 lg:p-8 flex flex-col flex-1">
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Newspaper className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="font-bold text-slate-800 text-xl">Noticias</h3>
                    </div>
                    <p className="text-xs text-slate-400">Últimas novedades</p>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6 text-center">
                    Las últimas novedades del mundo de la acuariofilia, tendencias y consejos de expertos.
                  </p>
                  <div className="space-y-3 flex-1">
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                      <p className="text-sm font-semibold text-blue-800">🐠 Temporada de Discos 2026</p>
                      <p className="text-xs text-slate-500 mt-1">Nuevas variedades disponibles en Colombia</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                      <p className="text-sm font-semibold text-blue-800">🌧️ Cuidado en época de lluvias</p>
                      <p className="text-xs text-slate-500 mt-1">Cómo proteger tu acuario del clima</p>
                    </div>
                  </div>
                  <p className="text-sm text-blue-500 font-bold mt-6 group-hover:underline flex items-center justify-center gap-1">
                    Próximamente <span className="text-lg">→</span>
                  </p>
                </div>
              </motion.div>

              {/* Datos Curiosos */}
              <motion.div
                whileHover={{ y: -6 }}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow cursor-pointer group flex flex-col"
              >
                <div className="h-1.5 bg-gradient-to-r from-amber-400 to-orange-400 rounded-t-3xl" />
                <div className="p-7 lg:p-8 flex flex-col flex-1">
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <LightbulbIcon className="w-5 h-5 text-amber-600" />
                      </div>
                      <h3 className="font-bold text-slate-800 text-xl">Datos Curiosos</h3>
                    </div>
                    <p className="text-xs text-slate-400">Sabías que...</p>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6 text-center">
                    Descubre hechos fascinantes sobre las especies de agua dulce y su hábitat natural.
                  </p>
                  <div className="space-y-3 flex-1">
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                      <p className="text-sm text-amber-900">🐟 El pez disco puede reconocer a su dueño y cambiar de color según su estado de ánimo.</p>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                      <p className="text-sm text-amber-900">🦐 Los camarones Cherry pueden vivir hasta 2 años y se reproducen fácilmente en acuarios.</p>
                    </div>
                  </div>
                  <p className="text-sm text-amber-500 font-bold mt-6 group-hover:underline flex items-center justify-center gap-1">
                    Próximamente <span className="text-lg">→</span>
                  </p>
                </div>
              </motion.div>

              {/* Tabla de Compatibilidad */}
              <motion.div
                whileHover={{ y: -6 }}
                onClick={() => setIsCompatOpen(true)}
                role="button"
                tabIndex={0}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow cursor-pointer group flex flex-col"
              >
                <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-green-400 rounded-t-3xl" />
                <div className="p-7 lg:p-8 flex flex-col flex-1">
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Table2 className="w-5 h-5 text-emerald-600" />
                      </div>
                      <h3 className="font-bold text-slate-800 text-xl">Compatibilidad</h3>
                    </div>
                    <p className="text-xs text-slate-400">25 especies analizadas</p>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6 text-center">
                    Consulta qué especies pueden convivir juntas en tu acuario de forma segura.
                  </p>
                  <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100 flex-1">
                    <div className="flex items-center justify-center gap-5 mb-3 flex-wrap">
                      <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-green-500" /><span className="text-xs text-slate-700 font-medium">Compatible</span></div>
                      <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-yellow-400" /><span className="text-xs text-slate-700 font-medium">Precaución</span></div>
                      <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-red-500" /><span className="text-xs text-slate-700 font-medium">Incompatible</span></div>
                    </div>
                    <p className="text-xs text-slate-500 text-center mt-2">Tabla interactiva · Toca para explorar</p>
                  </div>
                  <p className="text-sm text-emerald-500 font-bold mt-6 group-hover:underline flex items-center justify-center gap-1">
                    Ver tabla completa <span className="text-lg">→</span>
                  </p>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Free shipping banner */}
        {activeTab !== 'Inicio' && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-3 mb-6 flex items-center gap-3">
            <span className="text-green-600 text-lg">🚚</span>
            <p className="text-sm text-green-800">
              <span className="font-bold">¡Envío gratis</span> en compras superiores a ${FREE_SHIPPING_THRESHOLD.toLocaleString('es-CO')}!
              <span className="text-green-600 ml-1">Envíos a toda Colombia.</span>
            </p>
          </div>
        )}

        {/* Product Grid Header with Sort */}
        <div className="mt-12 md:mt-16 lg:mt-20 mb-8">
          {activeTab === 'Inicio' && !searchQuery ? (
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Star className="w-7 h-7 text-brand-blue" />
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Productos Destacados</h2>
              </div>
              <p className="text-sm md:text-base text-slate-500">Los peces más vendidos esta semana</p>
            </div>
          ) : (
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-1">
              {searchQuery ? 'Resultados' : activeTab}
            </h2>
          )}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="text-slate-500 text-sm">
              {activeTab === 'Inicio' && !searchQuery
                ? `${Math.min(8, filteredProducts.length)} de ${filteredProducts.length} productos`
                : `${filteredProducts.length} productos`}
            </span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
          <div></div>
          <div className={`flex items-center gap-2 ${isHomeFeatured ? 'hidden' : ''}`}>
            <span className="text-xs text-slate-500">Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            >
              <option value="relevance">Relevancia</option>
              <option value="price-asc">Menor precio</option>
              <option value="price-desc">Mayor precio</option>
              <option value="name">A - Z</option>
            </select>
          </div>
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

        {/* Empty state */}
        {!isLoading && filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <SearchX className="w-16 h-16 text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-600 mb-2">No encontramos resultados</h3>
            <p className="text-slate-400 max-w-md">
              {searchQuery
                ? `No hay productos que coincidan con "${searchQuery}". Intenta con otro término.`
                : `No hay productos en esta categoría.`}
            </p>
            <button
              onClick={() => { setSearchQuery(''); setActiveTab('Inicio'); }}
              className="mt-6 bg-brand-blue text-white px-6 py-2.5 rounded-xl font-medium hover:bg-brand-dark transition-colors"
            >
              Ver todo el catálogo
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 lg:gap-6">
          {paginatedProducts.map((product) => (
            <motion.div
              layout
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-brand-blue/20 transition-all duration-300 group flex flex-col cursor-pointer"
              onClick={() => setSelectedProduct(product)}
            >
              {/* Image */}
              <div className="aspect-[4/3] relative overflow-hidden bg-slate-100">
                <img
                  src={product.image}
                  alt={`${product.name}${product.scientificName ? ' - ' + product.scientificName : ''}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMG; }}
                />
                {/* Badges top */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.stock > 0 && product.stock <= 3 && (
                    <span className="bg-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                      ¡ÚLTIMAS {product.stock}!
                    </span>
                  )}
                </div>
                <div className="absolute top-2 right-2 flex items-center gap-1.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
                    className={`p-1.5 rounded-full backdrop-blur transition-all ${
                      favorites.includes(product.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white/80 text-slate-400 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${favorites.includes(product.id) ? 'fill-current' : ''}`} />
                  </button>
                  <span className="bg-white/90 backdrop-blur px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider text-slate-500">
                    {product.category}
                  </span>
                </div>
                {/* Quick add overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                    disabled={product.stock === 0}
                    className="w-full bg-brand-blue text-white py-2 rounded-xl text-sm font-bold hover:bg-brand-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar al carrito
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="px-5 py-4 flex-1 flex flex-col">
                {/* Price first - MercadoLibre style */}
                <span className="text-xl font-bold text-slate-900">
                  ${product.price.toLocaleString('es-CO')}
                </span>

                <h3 className="font-medium text-sm text-slate-700 mt-2 group-hover:text-brand-blue transition-colors line-clamp-2">
                  {product.name}
                  {product.size && <span className="text-slate-400 ml-1">· {product.size}</span>}
                </h3>

                {/* Scientific name */}
                {product.scientificName && (
                  <p className="text-[11px] italic text-slate-400 mt-1">{product.scientificName}</p>
                )}

                {/* Stock indicator */}
                <div className="mt-auto pt-3">
                  {product.stock === 0 ? (
                    <span className="text-xs font-bold text-red-500">Agotado</span>
                  ) : product.stock <= 5 ? (
                    <span className="text-xs text-orange-600">¡Quedan solo {product.stock}!</span>
                  ) : (
                    <span className="text-xs text-green-600">Disponible</span>
                  )}
                </div>

                {isAdmin && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center">
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

        {/* "Ver Catálogo" button on home */}
        {isHomeFeatured && filteredProducts.length > 8 && (
          <div className="flex flex-col items-center" style={{ marginTop: '40px', marginBottom: '60px' }}>
            <button
              onClick={() => { setActiveTab('Peces'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="bg-brand-blue text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-brand-dark transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              Ver Catálogo Completo
              <ChevronRight className="w-5 h-5" />
            </button>
            <p className="text-sm text-slate-400 mt-3">Mostrando 8 de {filteredProducts.length} productos</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-brand-blue hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Anterior
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
              .reduce<(number | string)[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('...');
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                typeof p === 'string' ? (
                  <span key={`dots-${i}`} className="px-2 text-slate-400">...</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className={`w-10 h-10 rounded-xl text-sm font-bold transition-colors ${
                      currentPage === p
                        ? 'bg-brand-blue text-white shadow-lg'
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

            <button
              onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-brand-blue hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Siguiente →
            </button>
          </div>
        )}
        <p className="text-center text-xs text-slate-400 mt-3">
          Mostrando {((currentPage - 1) * PRODUCTS_PER_PAGE) + 1}-{Math.min(currentPage * PRODUCTS_PER_PAGE, filteredProducts.length)} de {filteredProducts.length}
        </p>
      </main>

      {/* ===== PRODUCT DETAIL MODAL ===== */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-10 bg-black/30 backdrop-blur text-white p-2 rounded-full hover:bg-black/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Product Image */}
              <div className="aspect-[4/3] relative bg-slate-100 shrink-0">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent h-20" />
                <span className="absolute bottom-3 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold uppercase text-slate-600">
                  {selectedProduct.category}
                </span>
              </div>

              {/* Product Info */}
              <div className="p-6 overflow-y-auto">
                <span className="text-3xl font-bold text-slate-900">
                  ${selectedProduct.price.toLocaleString('es-CO')}
                </span>

                <h2 className="text-xl font-bold text-slate-800 mt-3">
                  {selectedProduct.name}
                  {selectedProduct.size && (
                    <span className="ml-2 text-base font-normal text-slate-400">{selectedProduct.size}</span>
                  )}
                </h2>

                {selectedProduct.scientificName && (
                  <p className="text-sm italic text-slate-500 mt-1">{selectedProduct.scientificName}</p>
                )}

                <div className="mt-4 flex items-center gap-3">
                  {selectedProduct.stock > 0 ? (
                    <span className="bg-green-50 text-green-700 text-sm font-medium px-3 py-1 rounded-full">
                      ✓ Disponible ({selectedProduct.stock} en stock)
                    </span>
                  ) : (
                    <span className="bg-red-50 text-red-600 text-sm font-medium px-3 py-1 rounded-full">
                      Agotado
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); setIsCartOpen(true); }}
                    disabled={selectedProduct.stock === 0}
                    className="flex-1 bg-brand-blue text-white py-3 rounded-2xl font-bold hover:bg-brand-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Agregar
                  </button>
                  <button
                    onClick={() => toggleFavorite(selectedProduct.id)}
                    className={`py-3 px-4 rounded-2xl font-bold transition-colors flex items-center gap-1.5 text-sm border-2 ${
                      favorites.includes(selectedProduct.id)
                        ? 'bg-red-50 border-red-300 text-red-500'
                        : 'border-slate-200 text-slate-500 hover:border-red-300 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${favorites.includes(selectedProduct.id) ? 'fill-current' : ''}`} />
                  </button>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                      `Hola Entre Peces! Me interesa: ${selectedProduct.name}${selectedProduct.size ? ' (' + selectedProduct.size + ')' : ''} - $${selectedProduct.price.toLocaleString('es-CO')}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 text-white py-3 px-4 rounded-2xl font-bold hover:bg-green-600 transition-colors flex items-center text-sm"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===== PAYMENT GATEWAY MODAL ===== */}
      <AnimatePresence>
        {isPaymentOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsPaymentOpen(false); setSelectedPayment(null); }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-brand-blue to-brand-dark p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Pasarela de Pagos</h2>
                    <p className="text-white/70 text-sm mt-0.5">
                      Total: <span className="font-bold text-white">${cartTotal.toLocaleString('es-CO')}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => { setIsPaymentOpen(false); setSelectedPayment(null); }}
                    className="p-2 hover:bg-white/10 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                {!selectedPayment ? (
                  <>
                    {/* Order Summary */}
                    <div className="bg-slate-50 rounded-xl p-4 mb-5">
                      <h3 className="font-bold text-sm text-slate-700 mb-2">Resumen del pedido</h3>
                      <div className="space-y-1.5 max-h-32 overflow-y-auto">
                        {cart.map(item => (
                          <div key={item.id} className="flex justify-between text-xs text-slate-600">
                            <span className="truncate flex-1">{item.name} x{item.quantity}</span>
                            <span className="font-medium ml-2">${(item.price * item.quantity).toLocaleString('es-CO')}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-slate-200 mt-2 pt-2 flex justify-between font-bold text-sm">
                        <span>Total</span>
                        <span className="text-brand-dark">${cartTotal.toLocaleString('es-CO')}</span>
                      </div>
                      {cartTotal >= FREE_SHIPPING_THRESHOLD && (
                        <p className="text-xs text-green-600 font-medium mt-1">🚚 Envío gratis incluido</p>
                      )}
                    </div>

                    {/* Payment Methods */}
                    <h3 className="font-bold text-sm text-slate-700 mb-3">Selecciona método de pago</h3>
                    <div className="space-y-3">
                      {PAYMENT_METHODS.map(method => (
                        <button
                          key={method.id}
                          onClick={() => {
                            if (!method.available) return;
                            if (method.id === 'bold') {
                              // Bold: redirect to WhatsApp requesting payment link
                              window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                                `💳 *Solicitud de Link de Pago (Bold)*\n\n` +
                                `📋 Pedido:\n` +
                                cart.map(item => `• ${item.name} x${item.quantity} — $${(item.price * item.quantity).toLocaleString('es-CO')}`).join('\n') +
                                `\n\n💰 *Total: $${cartTotal.toLocaleString('es-CO')}*` +
                                (user ? `\n\n👤 ${user.name}\n📱 ${user.phone}` : '') +
                                `\n\nSolicito link de pago por datáfono Bold. Gracias!`
                              )}`, '_blank');
                              return;
                            }
                            setSelectedPayment(method.id);
                          }}
                          disabled={!method.available}
                          className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                            method.available
                              ? 'border-slate-200 hover:border-brand-blue hover:shadow-md cursor-pointer'
                              : 'border-slate-100 opacity-50 cursor-not-allowed'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-xl ${method.color} ${method.textColor} flex items-center justify-center font-bold text-sm shrink-0`}>
                            {method.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="text-left flex-1">
                            <span className="font-bold text-slate-800">{method.name}</span>
                            <p className="text-xs text-slate-500">{method.description}</p>
                          </div>
                          {method.available && (
                            <ChevronRight className="w-5 h-5 text-slate-400" />
                          )}
                          {!method.available && (
                            <span className="text-[10px] font-bold bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full">PRONTO</span>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* WhatsApp option */}
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <a
                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                          `🐟 *Pedido Entre Peces*\n\n` +
                          cart.map(item => `• ${item.name}${item.size ? ' (' + item.size + ')' : ''} x${item.quantity} — $${(item.price * item.quantity).toLocaleString('es-CO')}`).join('\n') +
                          `\n\n💰 *Total: $${cartTotal.toLocaleString('es-CO')}*` +
                          (cartTotal >= FREE_SHIPPING_THRESHOLD ? '\n🚚 Envío gratis' : '') +
                          (user ? `\n\n👤 ${user.name}\n📱 ${user.phone}\n📍 ${user.address}` : '')
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center gap-4 p-4 rounded-2xl bg-green-50 border-2 border-green-200 hover:border-green-400 transition-all"
                      >
                        <div className="w-12 h-12 rounded-xl bg-green-500 text-white flex items-center justify-center shrink-0">
                          <Phone className="w-6 h-6" />
                        </div>
                        <div className="text-left flex-1">
                          <span className="font-bold text-green-800">Pagar por WhatsApp</span>
                          <p className="text-xs text-green-600">Coordina el pago directamente</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-green-400" />
                      </a>
                    </div>
                  </>
                ) : (
                  <>
                    {/* QR Payment View */}
                    {(() => {
                      const method = PAYMENT_METHODS.find(m => m.id === selectedPayment)!;
                      return (
                        <div className="text-center">
                          <button
                            onClick={() => setSelectedPayment(null)}
                            className="flex items-center gap-1 text-sm text-slate-500 hover:text-brand-blue mb-4"
                          >
                            ← Volver a métodos de pago
                          </button>

                          <div className={`inline-block ${method.color} ${method.textColor} px-4 py-2 rounded-xl font-bold text-lg mb-4`}>
                            {method.name}
                          </div>

                          <p className="text-sm text-slate-600 mb-1">
                            Monto a pagar:
                          </p>
                          <p className="text-3xl font-bold text-slate-900 mb-4">
                            ${cartTotal.toLocaleString('es-CO')}
                          </p>

                          {method.qrImage && (
                            <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 inline-block mb-4">
                              <img
                                src={method.qrImage}
                                alt={`QR ${method.name}`}
                                className="w-64 h-64 object-contain mx-auto"
                              />
                              <p className="text-xs text-slate-500 mt-2 font-medium">DAVID RAMIREZ</p>
                            </div>
                          )}

                          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-left mb-4">
                            <p className="text-xs text-amber-800">
                              <span className="font-bold">Instrucciones:</span><br />
                              1. Abre tu app de {method.name}<br />
                              2. Escanea el código QR<br />
                              3. Ingresa el monto exacto: <span className="font-bold">${cartTotal.toLocaleString('es-CO')}</span><br />
                              4. Confirma el pago y envía el comprobante por WhatsApp
                            </p>
                          </div>

                          <a
                            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                              `✅ *Comprobante de Pago*\n\n` +
                              `📋 Pedido:\n` +
                              cart.map(item => `• ${item.name} x${item.quantity}`).join('\n') +
                              `\n\n💰 Total: $${cartTotal.toLocaleString('es-CO')}` +
                              `\n💳 Método: ${method.name}` +
                              (user ? `\n👤 ${user.name}\n📱 ${user.phone}` : '') +
                              `\n\n📸 Adjunto comprobante de pago`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => {
                              setIsPaymentOpen(false);
                              setSelectedPayment(null);
                              setCart([]);
                            }}
                            className="w-full bg-green-500 text-white py-3.5 rounded-2xl font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                          >
                            <Phone className="w-5 h-5" />
                            Enviar comprobante por WhatsApp
                          </a>
                        </div>
                      );
                    })()}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Compatibility Table Modal - inline to avoid import issues */}
      {isCompatOpen && <CompatibilityTable isOpen={isCompatOpen} onClose={() => setIsCompatOpen(false)} />}

      {/* Welcome Popup after Registration */}
      <AnimatePresence>
        {showWelcomePopup && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[80] bg-white rounded-3xl shadow-2xl border border-emerald-200 p-8 max-w-sm w-[90%] text-center"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">¡Bienvenido/a, {user?.name?.split(' ')[0]}!</h3>
            <p className="text-sm text-slate-600 mb-4">
              Gracias por registrarte y confiar en <span className="font-bold text-brand-blue">Entre Peces</span>. Estamos para ayudarte con tu acuario. 🐠
            </p>
            <button
              onClick={() => setShowWelcomePopup(false)}
              className="text-sm text-emerald-600 font-bold hover:underline"
            >
              ¡Empezar a explorar!
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout / Delivery Form Modal */}
      <AnimatePresence>
        {isCheckoutFormOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCheckoutFormOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-800">📦 Datos de Entrega</h2>
                  <button onClick={() => setIsCheckoutFormOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl">
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">Completa los 5 campos para confirmar tu pedido</p>
              </div>

              {orderSubmitted ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">¡Pedido Registrado!</h3>
                  <p className="text-sm text-slate-600 mb-6">Tu pedido fue enviado. Ahora selecciona tu método de pago.</p>
                  <button
                    onClick={() => {
                      setIsCheckoutFormOpen(false);
                      setIsPaymentOpen(true);
                      setSelectedPayment(null);
                    }}
                    className="w-full bg-brand-blue text-white py-3 rounded-2xl font-bold hover:bg-brand-dark transition-colors"
                  >
                    Ir a Pasarela de Pagos →
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setIsSubmittingOrder(true);
                    // Send to Google Sheets
                    try {
                      await fetch(`${API_URL}/api/order`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          ...checkoutForm,
                          productos: cart.map(c => `${c.name} x${c.quantity}`).join(', '),
                          total: cartTotal,
                        }),
                      });
                    } catch {
                      // Silent - order saved via WhatsApp anyway
                    }
                    setIsSubmittingOrder(false);
                    setOrderSubmitted(true);
                  }}
                  className="p-6 space-y-4"
                >
                  {/* Nombre receptor */}
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1 block">Nombre de quien recibe *</label>
                    <input
                      type="text"
                      required
                      value={checkoutForm.nombre}
                      onChange={e => setCheckoutForm(p => ({ ...p, nombre: e.target.value }))}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                      placeholder="Nombre completo"
                    />
                  </div>

                  {/* Celular */}
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1 block">Celular de contacto *</label>
                    <input
                      type="tel"
                      required
                      value={checkoutForm.celular}
                      onChange={e => setCheckoutForm(p => ({ ...p, celular: e.target.value }))}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                      placeholder="3XX XXX XXXX"
                    />
                  </div>

                  {/* Dirección */}
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1 block">Dirección de entrega *</label>
                    <input
                      type="text"
                      required
                      value={checkoutForm.direccion}
                      onChange={e => setCheckoutForm(p => ({ ...p, direccion: e.target.value }))}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                      placeholder="Dirección completa, barrio, ciudad"
                    />
                  </div>

                  {/* Fecha y Hora */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-600 mb-1 block">Fecha de entrega *</label>
                      <input
                        type="date"
                        required
                        value={checkoutForm.fecha}
                        onChange={e => setCheckoutForm(p => ({ ...p, fecha: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 mb-1 block">Hora aprox. *</label>
                      <select
                        required
                        value={checkoutForm.hora}
                        onChange={e => setCheckoutForm(p => ({ ...p, hora: e.target.value }))}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                      >
                        <option value="">Seleccionar</option>
                        <option value="8:00 AM - 10:00 AM">8:00 AM - 10:00 AM</option>
                        <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                        <option value="12:00 PM - 2:00 PM">12:00 PM - 2:00 PM</option>
                        <option value="2:00 PM - 4:00 PM">2:00 PM - 4:00 PM</option>
                        <option value="4:00 PM - 6:00 PM">4:00 PM - 6:00 PM</option>
                      </select>
                    </div>
                  </div>

                  {/* Resumen */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-xs font-bold text-slate-600 mb-2">Resumen del pedido:</p>
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between text-xs text-slate-600">
                        <span>{item.name} x{item.quantity}</span>
                        <span>${(item.price * item.quantity).toLocaleString('es-CO')}</span>
                      </div>
                    ))}
                    <div className="border-t border-slate-200 mt-2 pt-2 flex justify-between font-bold text-sm">
                      <span>Total</span>
                      <span className="text-brand-blue">${cartTotal.toLocaleString('es-CO')}</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-amber-600 bg-amber-50 rounded-lg p-3 border border-amber-200">
                    ⚠️ Recuerda: las entregas se deben solicitar con al menos 12 horas de anticipación.
                  </p>

                  <button
                    type="submit"
                    disabled={isSubmittingOrder}
                    className="w-full bg-brand-blue text-white py-4 rounded-2xl font-bold hover:bg-brand-dark transition-colors disabled:opacity-50"
                  >
                    {isSubmittingOrder ? 'Enviando...' : 'Confirmar Pedido →'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20Entre%20Peces!%20Quiero%20hacer%20un%20pedido`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-green-500 text-white w-14 h-14 rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-110 flex items-center justify-center"
      >
        <Phone className="w-6 h-6" />
      </a>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 text-white mb-4">
              <img
                src="https://i.postimg.cc/Z0zT6rJy/logo-entre-peces.png"
                alt="Entre Peces Logo"
                className="w-10 h-10 object-contain"
                referrerPolicy="no-referrer"
              />
              <h2
                className="text-2xl font-bold select-none"
                onDoubleClick={() => setIsAdmin(!isAdmin)}
                title=""
              >
                Entre Peces
              </h2>
            </div>
            <p className="max-w-sm mb-6">
              El primer marketplace especializado en acuariofilia de agua dulce en Colombia.
              Calidad, variedad y pasión por el acuarismo.
            </p>
            <div className="flex gap-3">
              <a
                href="https://wa.me/573124380879"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-green-600 hover:bg-green-500 flex items-center justify-center transition-colors"
                title="WhatsApp"
              >
                <WhatsAppIcon className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/entre.peces.2025"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center transition-colors"
                title="Facebook"
              >
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/entrepecescol/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 hover:opacity-80 flex items-center justify-center transition-all"
                title="Instagram"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
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
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 mt-12 pt-8 border-t border-slate-800 text-center text-xs">
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
                {/* Free shipping progress */}
                {cart.length > 0 && (
                  <div className="mb-4">
                    {cartTotal >= FREE_SHIPPING_THRESHOLD ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
                        <span className="text-green-700 text-sm font-bold">🚚 ¡Envío gratis aplicado!</span>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs text-slate-500 mb-1">
                          Te faltan <span className="font-bold text-brand-blue">${(FREE_SHIPPING_THRESHOLD - cartTotal).toLocaleString('es-CO')}</span> para envío gratis
                        </p>
                        <div className="w-full bg-slate-200 rounded-full h-1.5">
                          <div
                            className="bg-green-500 h-1.5 rounded-full transition-all"
                            style={{ width: `${Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
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
                      setIsCartOpen(false);
                      // Pre-fill checkout form with user data
                      setCheckoutForm(prev => ({
                        ...prev,
                        nombre: prev.nombre || user.name,
                        celular: prev.celular || user.phone,
                        direccion: prev.direccion || user.address,
                      }));
                      setIsCheckoutFormOpen(true);
                      setOrderSubmitted(false);
                    }
                  }}
                  className={`w-full py-4 rounded-2xl font-bold transition-colors flex items-center justify-center gap-2 ${
                    cart.length === 0
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-brand-blue text-white hover:bg-brand-dark'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5" />
                  {user ? 'Proceder al Pago' : 'Registrarse para Comprar'}
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
