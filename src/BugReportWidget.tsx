import { useState, useEffect, useRef } from 'react';
import { Bug, X, Camera, MousePointer2, Send, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import html2canvas from 'html2canvas';
import { supabase } from './lib/supabase';
import type { User } from './types';

interface Props {
  user: User | null;
  activeTab: string;
}

type WidgetState = 'collapsed' | 'menu' | 'inspecting' | 'form';

interface ElementData {
  tag: string;
  classes: string;
  id: string;
  text: string;
  rect: { x: number; y: number; width: number; height: number };
}

export default function BugReportWidget({ user, activeTab }: Props) {
  const [state, setState] = useState<WidgetState>('collapsed');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [elementData, setElementData] = useState<ElementData | null>(null);
  const [highlightRect, setHighlightRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // ESC to cancel inspector mode
  useEffect(() => {
    if (state !== 'inspecting') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') reset();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [state]);

  // Only render for admins (after all hooks)
  if (!user || user.role !== 'admin') return null;

  const reset = () => {
    setState('collapsed');
    setScreenshot(null);
    setElementData(null);
    setHighlightRect(null);
    setForm({ title: '', description: '', priority: 'medium' });
    setSaved(false);
  };

  const captureScreenshot = async (): Promise<string | null> => {
    try {
      // html2canvas doesn't support oklch() colors (Tailwind CSS 4)
      // We capture what we can and ignore color parse errors
      const canvas = await html2canvas(document.body, {
        useCORS: true,
        allowTaint: true,
        scale: 0.5,
        logging: false,
        ignoreElements: (el) => el.id === 'bug-report-widget',
        onclone: (clonedDoc) => {
          // Remove oklch colors that html2canvas can't parse
          const style = clonedDoc.createElement('style');
          style.textContent = '*, *::before, *::after { color: inherit !important; }';
          clonedDoc.head.appendChild(style);
        },
      });
      return canvas.toDataURL('image/jpeg', 0.6);
    } catch (err) {
      console.warn('Screenshot failed (oklch colors not supported by html2canvas):', err);
      // Return null — the bug report works without screenshot
      return null;
    }
  };

  const handleOverlayMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const overlay = e.currentTarget;
    // Temporarily disable overlay to find element underneath
    overlay.style.pointerEvents = 'none';
    const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
    overlay.style.pointerEvents = 'auto';

    if (el && !el.closest('#bug-report-widget')) {
      const rect = el.getBoundingClientRect();
      setHighlightRect({
        top: rect.top - 2,
        left: rect.left - 2,
        width: rect.width + 4,
        height: rect.height + 4,
      });
    } else {
      setHighlightRect(null);
    }
  };

  const handleOverlayClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    const overlay = e.currentTarget;
    // Find element underneath
    overlay.style.pointerEvents = 'none';
    const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
    overlay.style.pointerEvents = 'auto';

    if (!el) return;

    // Capture element data
    const rect = el.getBoundingClientRect();
    const data: ElementData = {
      tag: el.tagName.toLowerCase(),
      classes: (typeof el.className === 'string' ? el.className : '').slice(0, 300),
      id: el.id || '',
      text: (el.innerText || '').slice(0, 200),
      rect: { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height) },
    };
    setElementData(data);
    setHighlightRect(null);
    setState('form');

    // Capture screenshot after overlay is gone
    await new Promise(r => setTimeout(r, 150));
    const img = await captureScreenshot();
    setScreenshot(img);
  };

  const startQuickScreenshot = async () => {
    setState('form');
    await new Promise(r => setTimeout(r, 150));
    const img = await captureScreenshot();
    setScreenshot(img);
  };

  const handleSubmit = async () => {
    if (!supabase || !form.title.trim()) return;
    setSaving(true);

    try {
      // Limit screenshot size — base64 can be huge and exceed Supabase limits
      let screenshotToSave = screenshot;
      if (screenshotToSave && screenshotToSave.length > 500_000) {
        console.warn(`[BugReport] Screenshot too large (${(screenshotToSave.length / 1024).toFixed(0)}KB), skipping`);
        screenshotToSave = null;
      }

      const { error } = await supabase.from('BugReport').insert({
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        status: 'open',
        reportedBy: user!.email,
        page: activeTab || 'Inicio',
        screenshot: screenshotToSave || null,
        elementInfo: elementData ? JSON.stringify(elementData) : null,
        viewport: JSON.stringify({ width: window.innerWidth, height: window.innerHeight }),
        userAgent: navigator.userAgent,
      });

      if (error) {
        console.error('[BugReport] Insert error:', error.message, error.details, error.hint, error.code);
        alert(`Error al guardar bug: ${error.message}`);
        setSaving(false);
        return;
      }

      console.log('[BugReport] Saved successfully');
      setSaving(false);
      setSaved(true);
      setTimeout(reset, 1500);
    } catch (e) {
      console.error('[BugReport] Unexpected error:', e);
      alert('Error inesperado al guardar el bug report');
      setSaving(false);
    }
  };

  return (
    <div id="bug-report-widget">
      {/* ══ INSPECTOR MODE: Full-screen overlay ══ */}
      {state === 'inspecting' && (
        <>
          {/* Transparent overlay that captures ALL clicks */}
          <div
            className="fixed inset-0 z-[99997] cursor-crosshair"
            onMouseMove={handleOverlayMouseMove}
            onClick={handleOverlayClick}
          />

          {/* Highlight box (pointer-events: none so it doesn't interfere) */}
          {highlightRect && (
            <div
              style={{
                position: 'fixed',
                top: highlightRect.top,
                left: highlightRect.left,
                width: highlightRect.width,
                height: highlightRect.height,
                border: '2px dashed #ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                borderRadius: 4,
                pointerEvents: 'none',
                zIndex: 99998,
                transition: 'all 0.1s ease-out',
              }}
            />
          )}

          {/* Info bar at top */}
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[99999] bg-red-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-medium">
            <MousePointer2 className="w-4 h-4 animate-pulse" />
            Click en el elemento con el bug &middot; <span className="opacity-70">ESC para cancelar</span>
          </div>
        </>
      )}

      {/* ══ FLOATING BUTTON ══ */}
      <AnimatePresence>
        {state === 'collapsed' && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setState('menu')}
            className="fixed bottom-24 right-6 z-[85] bg-red-500 text-white w-14 h-14 rounded-full shadow-lg hover:bg-red-600 transition-all hover:scale-110 flex items-center justify-center"
            title="Reportar Bug"
          >
            <Bug className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ══ MENU POPUP ══ */}
      <AnimatePresence>
        {state === 'menu' && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={reset}
              className="fixed inset-0 z-[84]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="fixed bottom-24 right-6 z-[85] bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 w-56"
            >
              <button
                onClick={() => setState('inspecting')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                  <MousePointer2 className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Seleccionar elemento</p>
                  <p className="text-[10px] text-slate-400">Click en el bug visual</p>
                </div>
              </button>
              <button
                onClick={startQuickScreenshot}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-amber-50 transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                  <Camera className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Screenshot rapido</p>
                  <p className="text-[10px] text-slate-400">Captura toda la pagina</p>
                </div>
              </button>
              <div className="h-px bg-slate-100 my-1" />
              <button
                onClick={reset}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left"
              >
                <X className="w-4 h-4 text-slate-400 ml-2.5" />
                <span className="text-xs text-slate-400">Cancelar</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ══ REPORT FORM ══ */}
      <AnimatePresence>
        {state === 'form' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed bottom-6 right-6 z-[85] w-[380px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-5 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 text-white">
                <Bug className="w-5 h-5" />
                <h3 className="font-bold text-sm">Reportar Bug</h3>
              </div>
              <button onClick={reset} className="text-white/70 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Screenshot preview */}
              {screenshot ? (
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                  <img src={screenshot} alt="Screenshot" className="w-full h-auto" />
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                  <Camera className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">Capturando screenshot...</p>
                </div>
              )}

              {/* Element info */}
              {elementData && (
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Elemento seleccionado</p>
                  <p className="text-xs font-mono text-slate-600">
                    &lt;{elementData.tag}{elementData.id ? ` id="${elementData.id}"` : ''}&gt;
                  </p>
                  {elementData.text && (
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{elementData.text}</p>
                  )}
                  <p className="text-[10px] text-slate-400 mt-1">
                    {elementData.rect.width}x{elementData.rect.height}px @ ({elementData.rect.x}, {elementData.rect.y})
                  </p>
                </div>
              )}

              {/* Form fields */}
              <input
                type="text"
                placeholder="Titulo del bug *"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
                autoFocus
              />
              <textarea
                placeholder="Describe el bug..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none resize-none"
              />
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-red-500 outline-none"
              >
                <option value="low">Prioridad: Baja</option>
                <option value="medium">Prioridad: Media</option>
                <option value="high">Prioridad: Alta</option>
                <option value="critical">Prioridad: Critica</option>
              </select>

              {/* Context info */}
              <div className="flex gap-2 text-[10px] text-slate-400">
                <span className="bg-slate-100 px-2 py-1 rounded">Pagina: {activeTab || 'Inicio'}</span>
                <span className="bg-slate-100 px-2 py-1 rounded">{window.innerWidth}x{window.innerHeight}</span>
              </div>
            </div>

            {/* Submit */}
            <div className="p-4 border-t border-slate-100 shrink-0">
              {saved ? (
                <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold text-sm py-3">
                  <CheckCircle2 className="w-5 h-5" />
                  Bug reportado!
                </div>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!form.title.trim() || saving}
                  className="w-full bg-red-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? 'Enviando...' : <><Send className="w-4 h-4" /> Enviar Bug Report</>}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
