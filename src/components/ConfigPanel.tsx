import React from 'react';
import { ElectionConfig } from '../types';
import { getRecommendedSeats } from '../utils/calculator';
import {
  Building2,
  Calendar,
  Award,
  Vote,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Plus,
  Minus,
} from 'lucide-react';

interface ConfigPanelProps {
  config: ElectionConfig;
  onChange: (updated: Partial<ElectionConfig>) => void;
  totalCensus: number;
  mesasCount: number;
  onSetMesasCount: (count: number) => void;
  onAddMesa: () => void;
  onRemoveMesa: () => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  config,
  onChange,
  totalCensus,
  mesasCount,
  onSetMesasCount,
  onAddMesa,
  onRemoveMesa,
}) => {
  const recommended = getRecommendedSeats(totalCensus);
  const isUnder50 = totalCensus > 0 && totalCensus < 50;

  const handleApplyRecommendedSeats = () => {
    if (recommended > 0) {
      onChange({ seats: recommended });
    }
  };

  return (
    <div className="bg-[#FFFDF9] rounded-xl border border-[#E3D9CF] shadow-xs overflow-hidden">
      {/* Cabecera del panel */}
      <div className="bg-[#FBEAE4] border-b border-[#F0C4B6] px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Scale className="w-5 h-5 text-[#BB2B09]" />
          <div>
            <h2 className="font-serif font-bold text-sm text-[#1D1B1A] uppercase tracking-wide">
              1. Convocatoria Electoral y Configuración de Mesas
            </h2>
            <p className="text-xs text-[#5C544F]">
              Departamento de Salud, órgano a constituir (≥50 trabajadores) y mesas electorales
            </p>
          </div>
        </div>

        {/* Control del número de mesas (típicamente entre 2 y 5 mesas por departamento) */}
        <div className="flex items-center gap-2 bg-[#FFFDF9] p-1 rounded-lg border border-[#E3D9CF]">
          <span className="text-xs font-semibold text-[#5C544F] px-2 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-[#BB2B09]" />
            <span>Mesas:</span>
          </span>

          <div className="inline-flex rounded-md shadow-2xs">
            {[2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => onSetMesasCount(num)}
                className={`px-2.5 py-1 text-xs font-bold transition border-r last:border-r-0 border-[#E3D9CF] ${
                  mesasCount === num
                    ? 'bg-[#BB2B09] text-white'
                    : 'bg-[#FFFDF9] text-[#1D1B1A] hover:bg-[#F6F2EC]'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 pl-1">
            <button
              type="button"
              onClick={onAddMesa}
              disabled={mesasCount >= 7}
              className="p-1 rounded bg-[#FFFDF9] hover:bg-[#FBEAE4] text-[#BB2B09] border border-[#E3D9CF] disabled:opacity-40 disabled:cursor-not-allowed transition"
              title="Añadir una mesa electoral"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onRemoveMesa}
              disabled={mesasCount <= 2}
              className="p-1 rounded bg-[#FFFDF9] hover:bg-[#FBEAE4] text-[#8A2007] border border-[#E3D9CF] disabled:opacity-40 disabled:cursor-not-allowed transition"
              title="Eliminar la última mesa electoral (mínimo 2)"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Alerta en caso de censo menor a 50 */}
        {isUnder50 && (
          <div className="bg-[#FEF2F2] border-l-4 border-[#EF4444] p-3 rounded-r-lg flex items-start gap-2.5 text-xs text-[#991B1B]">
            <AlertTriangle className="w-4 h-4 text-[#EF4444] flex-shrink-0 mt-0.5" />
            <div>
              <strong>Aviso legal:</strong> En el ámbito sanitario de la Generalitat Valenciana no se constituyen órganos de representación (Junta de Personal / Comité de Empresa) para censos inferiores a 50 trabajadores. El censo actual ({totalCensus}) debe ser de al menos 50 trabajadores.
            </div>
          </div>
        )}

        {/* Fila 1: Datos de ámbito y órgano */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#1D1B1A] mb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#BB2B09]" />
              Departamento de Salud / Ámbito
            </label>
            <input
              type="text"
              value={config.department}
              onChange={(e) => onChange({ department: e.target.value })}
              placeholder="Ej: Departamento de Salud de Orihuela (Sanitat GVA)"
              className="w-full px-3 py-2 text-xs border border-[#E3D9CF] rounded-lg focus:ring-2 focus:ring-[#BB2B09] focus:border-[#BB2B09] bg-white font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1D1B1A] mb-1">
              Órgano a Constituir (≥ 50 Trabajadores)
            </label>
            <select
              value={config.organType}
              onChange={(e) =>
                onChange({
                  organType: e.target.value as ElectionConfig['organType'],
                })
              }
              className="w-full px-3 py-2 text-xs border border-[#E3D9CF] rounded-lg focus:ring-2 focus:ring-[#BB2B09] focus:border-[#BB2B09] bg-white font-semibold text-[#1D1B1A]"
            >
              <option value="Junta de Personal">
                Junta de Personal (Personal Estatutario y Funcionario · San GVA)
              </option>
              <option value="Comité de Empresa">
                Comité de Empresa (Personal Laboral · San GVA)
              </option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1D1B1A] mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#BB2B09]" />
              Fecha de Votación
            </label>
            <input
              type="date"
              value={config.date}
              onChange={(e) => onChange({ date: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#E3D9CF] rounded-lg focus:ring-2 focus:ring-[#BB2B09] focus:border-[#BB2B09] bg-white font-medium"
            />
          </div>
        </div>

        {/* Fila 2: Centro de referencia, Censo total acumulado y Puestos a cubrir */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#ECE4DB]">
          <div>
            <label className="block text-xs font-bold text-[#1D1B1A] mb-1">
              Centro Principal / Ubicación
            </label>
            <input
              type="text"
              value={config.workCenter}
              onChange={(e) => onChange({ workCenter: e.target.value })}
              placeholder="Ej: Hospital Vega Baja de Orihuela"
              className="w-full px-3 py-2 text-xs border border-[#E3D9CF] rounded-lg focus:ring-2 focus:ring-[#BB2B09] focus:border-[#BB2B09] bg-white font-medium"
            />
          </div>

          {/* Censo Total Acumulado de las mesas */}
          <div className="bg-[#F6F2EC] p-3 rounded-lg border border-[#E3D9CF]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-[#1D1B1A] flex items-center gap-1.5">
                <Vote className="w-3.5 h-3.5 text-[#BB2B09]" />
                Censo Total (Suma de Mesas)
              </span>
              <span className="text-[10px] font-bold text-[#8A2007] bg-[#FBEAE4] px-1.5 py-0.5 rounded">
                {mesasCount} Mesas
              </span>
            </div>
            <div className="text-lg font-mono font-bold text-[#1D1B1A]">
              {totalCensus.toLocaleString('es-ES')} <span className="text-xs font-normal text-[#5C544F]">electores</span>
            </div>
            <p className="text-[11px] text-[#5C544F] mt-0.5">
              Calculado automáticamente sumando el censo de cada mesa electoral
            </p>
          </div>

          {/* Puestos a Cubrir */}
          <div className="bg-[#FBEAE4] p-3 rounded-lg border border-[#F0C4B6]">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-[#8A2007] flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#BB2B09]" />
                Puestos a Cubrir
              </label>
              {recommended > 0 && config.seats !== recommended && (
                <button
                  type="button"
                  onClick={handleApplyRecommendedSeats}
                  className="text-[11px] font-bold text-[#BB2B09] hover:text-[#8A2007] underline"
                >
                  Sugerir: {recommended}
                </button>
              )}
            </div>
            <input
              type="number"
              min="5"
              max="75"
              value={config.seats === 0 ? '' : config.seats}
              onChange={(e) => onChange({ seats: Number(e.target.value) || 5 })}
              className="w-full px-3 py-1.5 text-sm font-bold text-[#8A2007] border border-[#F0C4B6] rounded-lg focus:ring-2 focus:ring-[#BB2B09] bg-white"
            />
            <p className="text-[11px] text-[#8A2007] mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#2F6B4F] flex-shrink-0" />
              <span>
                {recommended > 0
                  ? `Escala legal Art. 66 ET: ${recommended} representantes`
                  : 'Censo mínimo legal para constituir órgano: 50'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
