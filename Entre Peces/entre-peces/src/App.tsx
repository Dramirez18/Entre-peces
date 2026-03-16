import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  Search, 
  User as UserIcon, 
  Menu, 
  X, 
  ChevronRight, 
  Plus, 
  Minus, 
  Trash2,
  Fish,
  Leaf,
  Settings,
  Waves,
  Phone,
  Mail,
  MapPin,
  Thermometer,
  Filter,
  Utensils,
  Droplets,
  Mountain,
  Gauge,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCTS } from './constants';
import { Product, CartItem, Category, User } from './types';

export default function App() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS.map(p => ({ ...p, active: true })));
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
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="bg-brand-blue text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => setActiveTab('Inicio')}
          >
            <img 
              src="https://i.postimg.cc/Z0zT6rJy/logo-entre-peces.png" 
              alt="Entre Peces Logo" 
              className="w-10 h-10 object-contain"
              referrerPolicy="no-referrer"
            />
            <h1 className="text-2xl font-bold tracking-tighter">Entre Peces</h1>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
              <input 
                type="text" 
                placeholder="Buscar peces, plantas..." 
                className="w-full bg-white/10 border border-white/20 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:bg-white/20 transition-all placeholder:text-white/60"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsUserModalOpen(true)}
              className="flex items-center gap-2 hover:bg-white/10 p-2 rounded-full transition-colors"
            >
              <UserIcon className="w-6 h-6" />
              <span className="hidden sm:inline text-sm font-medium">
                {user ? user.name : 'Ingresar'}
              </span>
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ShoppingBag className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-brand-blue">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="bg-brand-dark overflow-x-auto scrollbar-hide">
          <div className="max-w-7xl mx-auto px-4 flex">
            {['Inicio', 'Peces', 'Plantas', 'Camarones', 'Plantados', 'Termostatos', 'Filtros', 'Alimentos', 'Acondicionadores', 'Gravilla', 'Medidores', 'Lamparas'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
                  activeTab === tab 
                    ? 'border-white text-white' 
                    : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </nav>
      </header>

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
            <div className="relative z-10 px-12 max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                Tu pasión por el agua, <br />
                <span className="text-cyan-300">en un solo lugar.</span>
              </h2>
              <p className="text-white/80 text-lg mb-8">
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

        {/* Categories Grid (Only on Home) */}
        {activeTab === 'Inicio' && !searchQuery && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
            {[
              { name: 'Peces', icon: Fish, color: 'bg-blue-500' },
              { name: 'Plantas', icon: Leaf, color: 'bg-green-500' },
              { name: 'Camarones', icon: Waves, color: 'bg-red-400' },
              { name: 'Plantados', icon: Leaf, color: 'bg-emerald-600' },
              { name: 'Termostatos', icon: Thermometer, color: 'bg-orange-500' },
              { name: 'Filtros', icon: Filter, color: 'bg-indigo-500' },
              { name: 'Alimentos', icon: Utensils, color: 'bg-yellow-500' },
              { name: 'Acondicionadores', icon: Droplets, color: 'bg-cyan-500' },
              { name: 'Gravilla', icon: Mountain, color: 'bg-stone-500' },
              { name: 'Medidores', icon: Gauge, color: 'bg-rose-500' },
              { name: 'Lamparas', icon: Lightbulb, color: 'bg-amber-400' },
            ].map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveTab(cat.name as any)}
                className="group p-4 rounded-2xl bg-white border border-slate-200 hover:border-brand-blue hover:shadow-xl transition-all text-left"
              >
                <div className={`${cat.color} w-10 h-10 rounded-xl flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>
                  <cat.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm">{cat.name}</h3>
                <p className="text-slate-500 text-[10px]">Explorar catálogo</p>
              </button>
            ))}
          </div>
        )}

        {/* Product Grid */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            {activeTab === 'Inicio' ? 'Productos Destacados' : activeTab}
          </h2>
          <span className="text-slate-500 text-sm">{filteredProducts.length} productos encontrados</span>
        </div>

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
                {product.scientificName && (
                  <p className="text-xs italic text-slate-500 mb-2">{product.scientificName}</p>
                )}
                <p className="text-sm text-slate-600 line-clamp-2 mb-4 h-10">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-lg font-bold text-brand-dark">
                    ${product.price.toLocaleString('es-CO')}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500">
                      Stock: {product.stock}
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
                Admin Mode
              </button>
            </div>
            <p className="max-w-sm mb-6">
              El primer marketplace especializado en acuariofilia de agua dulce en Colombia. 
              Calidad, variedad y pasión por el acuarismo.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:text-brand-blue cursor-pointer">
                <Phone className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:text-brand-blue cursor-pointer">
                <Mail className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:text-brand-blue cursor-pointer">
                <MapPin className="w-5 h-5" />
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Categorías</h4>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('Peces')}>Peces</li>
              <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('Plantas')}>Plantas</li>
              <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('Camarones')}>Camarones</li>
              <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('Plantados')}>Plantados</li>
              <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('Termostatos')}>Termostatos</li>
              <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('Filtros')}>Filtros</li>
              <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('Alimentos')}>Alimentos</li>
              <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('Acondicionadores')}>Acondicionadores</li>
              <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('Gravilla')}>Gravilla</li>
              <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('Medidores')}>Medidores</li>
              <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('Lamparas')}>Lámparas</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Información</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">Sobre Nosotros</li>
              <li className="hover:text-white cursor-pointer">Envíos Nacionales</li>
              <li className="hover:text-white cursor-pointer">Términos y Condiciones</li>
              <li className="hover:text-white cursor-pointer">Privacidad</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-xs">
          © {new Date().getFullYear()} Entre Peces Colombia. Todos los derechos reservados.
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
                    } else {
                      alert('¡Gracias por tu compra! En breve te contactaremos.');
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

      {/* User Registration Modal */}
      <AnimatePresence>
        {isUserModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUserModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="bg-brand-blue p-8 text-white text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <UserIcon className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold">
                  {user ? 'Tu Perfil' : 'Únete a Entre Peces'}
                </h2>
                <p className="text-white/80 text-sm mt-2">
                  {user 
                    ? 'Gestiona tu información de envío' 
                    : 'Regístrate para realizar pedidos y recibir ofertas exclusivas'}
                </p>
              </div>

              <div className="p-8">
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                      <CheckCircle2 className="text-green-500 w-5 h-5" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase font-bold">Nombre</p>
                        <p className="font-medium">{user.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                      <Mail className="text-brand-blue w-5 h-5" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase font-bold">Correo</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                      <Phone className="text-brand-blue w-5 h-5" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase font-bold">Celular</p>
                        <p className="font-medium">{user.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                      <MapPin className="text-brand-blue w-5 h-5" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase font-bold">Dirección</p>
                        <p className="font-medium">{user.address}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setUser(null)}
                      className="w-full mt-6 text-slate-500 text-sm font-medium hover:text-red-500 transition-colors"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Nombre Completo</label>
                      <input 
                        required
                        type="text" 
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                        placeholder="Ej. Juan Pérez"
                        value={registrationForm.name}
                        onChange={e => setRegistrationForm({...registrationForm, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Correo Electrónico</label>
                      <input 
                        required
                        type="email" 
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                        placeholder="juan@ejemplo.com"
                        value={registrationForm.email}
                        onChange={e => setRegistrationForm({...registrationForm, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Celular</label>
                      <input 
                        required
                        type="tel" 
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                        placeholder="300 123 4567"
                        value={registrationForm.phone}
                        onChange={e => setRegistrationForm({...registrationForm, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Dirección de Envío</label>
                      <input 
                        required
                        type="text" 
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                        placeholder="Calle 123 #45-67, Ciudad"
                        value={registrationForm.address}
                        onChange={e => setRegistrationForm({...registrationForm, address: e.target.value})}
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full bg-brand-blue text-white py-4 rounded-2xl font-bold hover:bg-brand-dark transition-colors mt-6"
                    >
                      Registrarme Ahora
                    </button>
                  </form>
                )}
                <button 
                  onClick={() => setIsUserModalOpen(false)}
                  className="w-full mt-4 text-slate-400 text-sm hover:text-slate-600 transition-colors"
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
