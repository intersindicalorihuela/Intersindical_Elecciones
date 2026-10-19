import React, { useState } from 'react';
import { Candidacy } from '../types';
import { DEFAULT_UNIONS } from '../utils/calculator';
import {
  Plus,
  Trash2,
  Users2,
  Sparkles,
  Flame,
  Check,
} from 'lucide-react';

interface CandidaciesEditorProps {
  candidacies: Candidacy[];
  onAddCandidacy: (candidacy: Candidacy) => void;
  onUpdateCandidacy: (id: string, field: keyof Candidacy, value: string) => void;
  onRemoveCandidacy: (id: string) => void;
}

export const CandidaciesEditor: React.FC<CandidaciesEditorProps> = ({
  candidacies,
  onAddCandidacy,
  onUpdateCandidacy,
  onRemoveCandidacy,
}) => {
  const [customAcronym, setCustomAcronym] = useState('');
  const [customName, setCustomName] = useState('');
  const [customColor, setCustomColor] = useState('#2F6B4F');

  // Añadir sindicato habitual con un solo clic
  const handleAddDefaultUnion = (preset: (typeof DEFAULT_UNIONS)[0]) => {
    if (candidacies.some((c) => c.acronym.toUpperCase() === preset.acronym.toUpperCase())) {
      return;
    }

    const newCandidacy: Candidacy = {
      id: `cand-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: preset.name,
      acronym: preset.acronym,
      color: preset.color,
    };

    onAddCandidacy(newCandidacy);
  };

  // Añadir candidatura personalizada
  const handleAddCustom = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customAcronym.trim()) return;

    const newCandidacy: Candidacy = {
      id: `cand-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: customName.trim() || customAcronym.trim().toUpperCase(),
      acronym: customAcronym.trim().toUpperCase(),
      color: customColor,
    };

    onAddCandidacy(newCandidacy);
    setCustomAcronym('');
    setCustomName('');
  };

  return (
    <div className="bg-[#FFFDF9] rounded-xl border border-[#E3D9CF] shadow-xs overflow-hidden">
      {/* Cabecera */}
      <div className="bg-[#FBEAE4] border-b border-[#F0C4B6] px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Users2 className="w-5 h-5 text-[#BB2B09]" />
          <div>
            <h2 className="font-serif font-bold text-sm text-[#1D1B1A] uppercase tracking-wide">
              Candidaturas Proclamadas en el Departamento
            </h2>
            <p className="text-xs text-[#5C544F]">
              Listas electorales proclamadas que concurren a las urnas
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-[#5C544F]">Listas en escrutinio: </span>
          <span className="text-sm font-bold text-[#BB2B09]">
            {candidacies.length} candidaturas
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Sindicatos habituales de Sanidad GVA */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#1D1B1A] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#BB2B09]" />
              Añadir sindicato de Sanidad GVA con un clic:
            </span>
            <span className="text-[11px] text-[#5C544F]">
              Mesa Sectorial de Sanitat
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {DEFAULT_UNIONS.map((u) => {
              const isAdded = candidacies.some(
                (c) => c.acronym.toUpperCase() === u.acronym.toUpperCase()
              );
              return (
                <button
                  key={u.acronym}
                  type="button"
                  onClick={() => handleAddDefaultUnion(u)}
                  disabled={isAdded}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition border ${
                    isAdded
                      ? 'bg-[#F6F2EC] text-[#5C544F]/50 border-[#E3D9CF] cursor-not-allowed opacity-50'
                      : 'bg-white hover:bg-[#FBEAE4] text-[#1D1B1A] border-[#E3D9CF] shadow-2xs hover:border-[#BB2B09]'
                  }`}
                  title={u.name}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: u.color }}
                  />
                  <span>{u.acronym}</span>
                  {isAdded ? (
                    <Check className="w-3 h-3 text-[#5C544F]" />
                  ) : (
                    <Plus className="w-3 h-3 text-[#BB2B09]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tabla / Lista de candidaturas activas */}
        <div className="overflow-x-auto border border-[#E3D9CF] rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F6F2EC] text-[#1D1B1A] uppercase font-bold text-[11px] tracking-wider border-b border-[#E3D9CF]">
              <tr>
                <th className="py-2.5 px-3 w-12 text-center">Color</th>
                <th className="py-2.5 px-3 w-32">Siglas</th>
                <th className="py-2.5 px-3">Denominación Oficial de la Candidatura</th>
                <th className="py-2.5 px-3 w-16 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECE4DB]">
              {candidacies.map((c) => {
                const isIntersindical =
                  c.acronym.toUpperCase().includes('INTERSINDICAL') ||
                  c.acronym.toUpperCase() === 'IV' ||
                  c.acronym.toUpperCase() === 'STEPV';

                return (
                  <tr
                    key={c.id}
                    className={`hover:bg-[#F6F2EC]/60 transition ${
                      isIntersindical ? 'bg-[#FBEAE4]/40' : ''
                    }`}
                  >
                    {/* Selector de color */}
                    <td className="py-2 px-3 text-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="color"
                          value={c.color}
                          onChange={(e) =>
                            onUpdateCandidacy(c.id, 'color', e.target.value)
                          }
                          className="sr-only"
                        />
                        <span
                          className="w-5 h-5 rounded-full border border-black/15 shadow-2xs block cursor-pointer transition hover:scale-110"
                          style={{ backgroundColor: c.color }}
                          title="Cambiar color distintivo"
                        />
                      </label>
                    </td>

                    {/* Siglas */}
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={c.acronym}
                        onChange={(e) =>
                          onUpdateCandidacy(c.id, 'acronym', e.target.value.toUpperCase())
                        }
                        className="w-full px-2 py-1 font-bold text-xs border border-[#E3D9CF] rounded focus:ring-1 focus:ring-[#BB2B09] uppercase bg-white text-[#1D1B1A]"
                      />
                    </td>

                    {/* Nombre */}
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-1.5">
                        {isIntersindical && (
                          <span
                            className="p-0.5 rounded text-[#BB2B09]"
                            title="Intersindical Salut"
                          >
                            <Flame className="w-3.5 h-3.5" />
                          </span>
                        )}
                        <input
                          type="text"
                          value={c.name}
                          onChange={(e) =>
                            onUpdateCandidacy(c.id, 'name', e.target.value)
                          }
                          className="w-full px-2 py-1 text-xs border border-[#E3D9CF] rounded focus:ring-1 focus:ring-[#BB2B09] bg-white text-[#1D1B1A]"
                        />
                      </div>
                    </td>

                    {/* Eliminar */}
                    <td className="py-2 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => onRemoveCandidacy(c.id)}
                        className="p-1 text-[#5C544F] hover:text-[#BB2B09] transition rounded hover:bg-[#FBEAE4]"
                        title="Eliminar candidatura del escrutinio"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Añadir candidatura personalizada */}
        <form
          onSubmit={handleAddCustom}
          className="flex flex-wrap items-center gap-2 bg-[#F6F2EC] p-2.5 rounded-lg border border-[#E3D9CF] text-xs"
        >
          <span className="font-bold text-[#1D1B1A] flex items-center gap-1">
            <Plus className="w-3.5 h-3.5 text-[#BB2B09]" />
            Nueva Candidatura:
          </span>
          <input
            type="text"
            value={customAcronym}
            onChange={(e) => setCustomAcronym(e.target.value.toUpperCase())}
            placeholder="Siglas (ej: CANDIDATURA)"
            className="w-36 px-2 py-1.5 border border-[#E3D9CF] rounded font-bold uppercase focus:ring-1 focus:ring-[#BB2B09] bg-white text-[#1D1B1A]"
          />
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Denominación completa (opcional)"
            className="flex-1 min-w-[200px] px-2 py-1.5 border border-[#E3D9CF] rounded focus:ring-1 focus:ring-[#BB2B09] bg-white text-[#1D1B1A]"
          />
          <input
            type="color"
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            className="w-8 h-8 rounded border border-[#E3D9CF] cursor-pointer p-0.5 bg-white"
            title="Elegir color distintivo"
          />
          <button
            type="submit"
            disabled={!customAcronym.trim()}
            className="px-3.5 py-1.5 rounded bg-[#BB2B09] hover:bg-[#8A2007] disabled:opacity-40 text-white font-bold transition shadow-2xs"
          >
            Añadir Lista
          </button>
        </form>
      </div>
    </div>
  );
};
