import React, { useState, useEffect } from 'react';
import { User as UserIcon, Mail, Phone, MapPin, Save, CheckCircle2, ArrowLeft, LogOut, Edit3 } from 'lucide-react';
import { motion } from 'motion/react';
import { User } from './types';

interface UserProfilePageProps {
  user: User | null;
  onSave: (user: User) => void;
  onLogout: () => void;
  onBack: () => void;
  onLogin: () => void;
}

export default function UserProfilePage({ user, onSave, onLogout, onBack, onLogin }: UserProfilePageProps) {
  const [form, setForm] = useState<User>({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    role: user?.role || 'user',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role || 'user',
      });
    }
  }, [user]);

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    onSave(form);
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (!user) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10"
        >
          <div className="w-20 h-20 rounded-full bg-brand-blue/10 flex items-center justify-center mx-auto mb-6">
            <UserIcon className="w-10 h-10 text-brand-blue" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Inicia sesión</h2>
          <p className="text-slate-500 text-sm mb-8">
            Necesitas una cuenta para ver y editar tu perfil.
          </p>
          <button
            onClick={onLogin}
            className="bg-gradient-to-r from-brand-blue to-cyan-600 text-white px-8 py-3.5 rounded-2xl font-bold hover:shadow-lg hover:shadow-brand-blue/25 transition-all"
          >
            Iniciar sesión / Registrarse
          </button>
          <button
            onClick={onBack}
            className="block mx-auto mt-4 text-sm text-slate-400 hover:text-slate-600 transition-colors"
          >
            ← Volver al inicio
          </button>
        </motion.div>
      </div>
    );
  }

  const fields = [
    { key: 'name' as const, label: 'Nombre completo', icon: UserIcon, type: 'text', placeholder: 'Tu nombre' },
    { key: 'email' as const, label: 'Correo electrónico', icon: Mail, type: 'email', placeholder: 'tu@correo.com' },
    { key: 'phone' as const, label: 'Celular', icon: Phone, type: 'tel', placeholder: '3001234567' },
    { key: 'address' as const, label: 'Dirección de envío', icon: MapPin, type: 'text', placeholder: 'Calle 123 #45-67, Bogotá' },
  ];

  return (
    <div className="max-w-2xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Mi Perfil</h1>
            <p className="text-sm text-slate-500">Gestiona tu información personal</p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Avatar header */}
          <div className="bg-gradient-to-r from-brand-blue to-cyan-600 p-8 text-white text-center relative">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-3 ring-4 ring-white/30">
              <span className="text-3xl font-bold">{user.name.charAt(0).toUpperCase()}</span>
            </div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-white/70 text-sm">{user.email}</p>
          </div>

          {/* Fields */}
          <div className="p-6 md:p-8 space-y-5">
            {saved && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium"
              >
                <CheckCircle2 className="w-5 h-5" />
                Cambios guardados exitosamente
              </motion.div>
            )}

            {fields.map((field) => {
              const Icon = field.icon;
              return (
                <div key={field.key}>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                    {field.label}
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type={field.type}
                        value={form[field.key]}
                        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                        placeholder={field.placeholder}
                        className="w-full bg-slate-50 px-4 py-3.5 pl-11 rounded-xl border border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-sm"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                      <Icon className="w-5 h-5 text-brand-blue shrink-0" />
                      <span className="text-sm font-medium text-slate-800">
                        {user[field.key] || <span className="text-slate-400 italic">Sin definir</span>}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Action buttons */}
            <div className="pt-4 flex flex-col gap-3">
              {isEditing ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => { setIsEditing(false); setForm({ name: user.name, email: user.email, phone: user.phone, address: user.address }); }}
                    className="flex-1 py-3.5 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-brand-blue to-cyan-600 text-white py-3.5 rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-brand-blue/25 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    Guardar cambios
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-blue to-cyan-600 text-white py-3.5 rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-brand-blue/25 transition-all"
                >
                  <Edit3 className="w-4 h-4" />
                  Editar perfil
                </button>
              )}

              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 py-3 text-red-500 text-sm font-medium hover:bg-red-50 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
