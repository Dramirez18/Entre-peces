import { useState } from 'react';
import { X, Info } from 'lucide-react';

// G=Compatible  Y=Precaución  R=Incompatible
type Compat = 'G' | 'Y' | 'R';

const SPECIES = [
  'Escalares', 'Barbos', 'Bettas ♀', 'Cíclidos Afr.', 'Cíclidos Am.',
  'Corydoras', 'Danios', 'Discus', 'Anguilas', 'Goldfish',
  'Gouramis', 'Guppies', 'Koi', 'Lochas', 'Mollies',
  'Oscares', 'Platies', 'Plecos', 'Arco Iris', 'Rasboras',
  'Labeos', 'Espadas', 'Tetras', 'Crustáceos', 'Plantas',
];

const MATRIX: Compat[][] = [
  ['G','Y','R','R','Y','G','Y','Y','Y','R','Y','R','R','G','Y','R','Y','G','Y','Y','Y','Y','Y','Y','G'],
  ['Y','G','R','R','R','G','G','R','Y','Y','Y','Y','Y','G','Y','R','G','G','G','G','R','G','G','Y','G'],
  ['R','R','Y','R','R','G','R','R','R','R','R','R','R','G','R','R','R','G','R','R','R','R','Y','Y','G'],
  ['R','R','R','Y','R','R','R','R','R','R','R','R','R','R','R','R','R','Y','R','R','R','R','R','R','R'],
  ['Y','R','R','R','Y','R','R','R','R','R','R','R','R','Y','R','Y','R','G','R','R','R','R','R','R','Y'],
  ['G','G','G','R','R','G','G','G','G','G','G','G','G','G','G','Y','G','G','G','G','Y','G','G','G','G'],
  ['Y','G','R','R','R','G','G','R','Y','G','Y','G','G','G','G','R','G','G','G','G','Y','G','G','Y','G'],
  ['Y','R','R','R','R','G','R','G','Y','R','R','R','R','G','R','R','R','G','R','Y','R','R','Y','Y','G'],
  ['Y','Y','R','R','R','G','Y','Y','G','Y','Y','R','Y','G','R','R','R','G','Y','R','Y','R','R','R','G'],
  ['R','Y','R','R','R','G','G','R','Y','G','R','R','G','G','Y','R','Y','G','Y','Y','R','Y','R','Y','G'],
  ['Y','Y','R','R','R','G','Y','R','Y','R','Y','Y','R','G','Y','R','Y','G','Y','Y','Y','Y','Y','Y','G'],
  ['R','Y','R','R','R','G','G','R','R','R','Y','G','R','G','G','R','G','G','G','G','R','G','G','G','G'],
  ['R','Y','R','R','R','G','G','R','Y','G','R','R','G','G','Y','R','Y','G','Y','Y','R','Y','R','Y','G'],
  ['G','G','G','R','Y','G','G','G','G','G','G','G','G','G','G','Y','G','G','G','G','G','G','G','G','G'],
  ['Y','Y','R','R','R','G','G','R','R','Y','Y','G','Y','G','G','R','G','G','G','G','Y','G','G','Y','G'],
  ['R','R','R','R','Y','Y','R','R','R','R','R','R','R','Y','R','G','R','Y','R','R','R','R','R','R','R'],
  ['Y','G','R','R','R','G','G','R','R','Y','Y','G','Y','G','G','R','G','G','G','G','Y','G','G','G','G'],
  ['G','G','G','Y','G','G','G','G','G','G','G','G','G','G','G','Y','G','G','G','G','G','G','G','G','G'],
  ['Y','G','R','R','R','G','G','R','Y','Y','Y','G','Y','G','G','R','G','G','G','G','Y','G','G','Y','G'],
  ['Y','G','R','R','R','G','G','Y','R','Y','Y','G','Y','G','G','R','G','G','G','G','R','G','G','Y','G'],
  ['Y','R','R','R','R','Y','Y','R','Y','R','Y','R','R','G','Y','R','Y','G','Y','R','Y','Y','Y','R','G'],
  ['Y','G','R','R','R','G','G','R','R','Y','Y','G','Y','G','G','R','G','G','G','G','Y','G','G','G','G'],
  ['Y','G','Y','R','R','G','G','Y','R','R','Y','G','R','G','G','R','G','G','G','G','Y','G','G','G','G'],
  ['Y','Y','Y','R','R','G','Y','Y','R','Y','Y','G','Y','G','Y','R','G','G','Y','Y','R','G','G','G','G'],
  ['G','G','G','R','Y','G','G','G','G','G','G','G','G','G','G','R','G','G','G','G','G','G','G','G','G'],
];

const DOT = {
  G: { bg: 'bg-green-500', ring: 'ring-green-200', label: 'Compatible', sym: '✓' },
  Y: { bg: 'bg-yellow-400', ring: 'ring-yellow-200', label: 'Precaución', sym: '~' },
  R: { bg: 'bg-red-500', ring: 'ring-red-200', label: 'Incompatible', sym: '✗' },
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CompatibilityTable({ isOpen, onClose }: Props) {
  const [hovered, setHovered] = useState<{ row: number; col: number } | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex flex-col">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative mt-4 mx-2 md:mt-8 md:mx-auto md:mb-8 w-auto md:max-w-5xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[92vh] md:max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Tabla de Compatibilidad</h2>
            <p className="text-xs text-slate-500">Peces de agua dulce · Toca una celda para ver detalles</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 px-5 py-3 border-b bg-slate-50 shrink-0 text-xs flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-full bg-green-500" />
            <span className="text-slate-600 font-medium">Compatible</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-full bg-yellow-400" />
            <span className="text-slate-600 font-medium">Precaución</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-full bg-red-500" />
            <span className="text-slate-600 font-medium">Incompatible</span>
          </div>
        </div>

        {/* Hover info bar */}
        <div className="px-5 py-2 border-b shrink-0 flex items-center gap-2 min-h-[36px]">
          {hovered ? (
            <>
              <Info className="w-4 h-4 text-brand-blue shrink-0" />
              <p className="text-xs text-slate-700">
                <span className="font-bold">{SPECIES[hovered.row]}</span>
                {' + '}
                <span className="font-bold">{SPECIES[hovered.col]}</span>
                {': '}
                <span className={`font-bold ${
                  MATRIX[hovered.row][hovered.col] === 'G' ? 'text-green-600' :
                  MATRIX[hovered.row][hovered.col] === 'Y' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {DOT[MATRIX[hovered.row][hovered.col]].label}
                </span>
              </p>
            </>
          ) : (
            <p className="text-[10px] text-slate-400 italic">Selecciona una celda para ver la compatibilidad</p>
          )}
        </div>

        {/* Scrollable Table */}
        <div className="flex-1 overflow-auto p-2">
          <table className="border-collapse min-w-max">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-white p-1 min-w-[80px]" />
                {SPECIES.map((sp, i) => (
                  <th key={i} className="p-0.5 text-center h-16">
                    <div className="text-[7px] md:text-[9px] font-bold text-slate-500 -rotate-45 origin-bottom-left translate-x-2 whitespace-nowrap">
                      {sp}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SPECIES.map((sp, row) => (
                <tr key={row} className={row % 2 === 0 ? 'bg-slate-50/50' : ''}>
                  <td className="sticky left-0 z-10 bg-white pr-2 py-0.5">
                    <span className="text-[8px] md:text-[10px] font-bold text-slate-700 whitespace-nowrap block text-right">
                      {sp}
                    </span>
                  </td>
                  {MATRIX[row].map((val, col) => {
                    const d = DOT[val];
                    const isH = hovered?.row === row && hovered?.col === col;
                    const isDiag = row === col;
                    return (
                      <td
                        key={col}
                        className="p-0.5 text-center"
                        onMouseEnter={() => setHovered({ row, col })}
                        onMouseLeave={() => setHovered(null)}
                        onClick={() => setHovered({ row, col })}
                      >
                        <div
                          className={`w-4 h-4 md:w-[22px] md:h-[22px] rounded-full mx-auto flex items-center justify-center cursor-pointer transition-transform ${d.bg} ${
                            isH ? 'ring-2 ' + d.ring + ' scale-150' : ''
                          } ${isDiag ? 'opacity-30' : ''}`}
                        >
                          <span className="text-white text-[6px] md:text-[8px] font-bold leading-none">
                            {d.sym}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3 border-t bg-slate-50 text-center shrink-0">
          <p className="text-[10px] text-slate-400">
            Fuente: Tabla de compatibilidad de acuariofilia · Los resultados pueden variar según el temperamento individual.
          </p>
        </div>
      </div>
    </div>
  );
}
