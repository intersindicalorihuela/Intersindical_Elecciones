import React, { useState } from 'react';
import { Candidacy, PollingMesa, CalculationResult } from '../types';
import {
  Layers,
  Building,
  Plus,
  Trash2,
  Table,
  SlidersHorizontal,
  Flame,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

interface MesasScrutinyManagerProps {
  candidacies: Candidacy[];
  mesas: PollingMesa[];
  onUpdateMesas: (mesas: PollingMesa[]) => void;
  onAddMesa: () => void;
  onRemoveMesa: (id: string) => void;
  calculationResult: CalculationResult;
}

export const MesasScrutinyManager: React.FC<MesasScrutinyManagerProps> = ({
  candidacies,
  mesas,
  onUpdateMesas,
  onAddMesa,
  onRemoveMesa,
  calculationResult,
}) => {
  const [viewMode, setViewMode] = useState<'matrix' | 'cards'>('matrix');
  const [activeMesaId, setActiveMesaId] = useState<string>(mesas[0]?.id || '');

  // Actualizar votos de una candidatura en una mesa específica
  const handleVoteChange = (mesaId: string, candidacyId: string, value: number) => {
    const updated = mesas.map((m) => {
      if (m.id !== mesaId) return m;
      return {
        ...m,
        votesByCandidacy: {
          ...m.votesByCandidacy,
          [candidacyId]: Math.max(0, value),
        },
      };
    });
    onUpdateMesas(updated);
  };

  // Actualizar campos de la mesa (censo, blancos, nulos, nombre)
  const handleMesaFieldChange = (
    mesaId: string,
    field: 'name' | 'census' | 'blankVotes' | 'nullVotes' | 'location',
    value: string | number
  ) => {
    const updated = mesas.map((m) => {
      if (m.id !== mesaId) return m;
      return {
        ...m,
        [field]: typeof value === 'number' ? Math.max(0, value) : value,
      };
    });
    onUpdateMesas(updated);
  };

  // Poner a cero los votos de una mesa
  const handleResetMesa = (mesaId: string) => {
    const updated = mesas.map((m) => {
      if (m.id !== mesaId) return m;
      const zeroVotes: Record<string, number> = {};
      candidacies.forEach((c) => {
        zeroVotes[c.id] = 0;
      });
      return {
        ...m,
        votesByCandidacy: zeroVotes,
        blankVotes: 0,
        nullVotes: 0,
      };
    });
    onUpdateMesas(updated);
  };

  const activeMesa = mesas.find((m) => m.id === activeMesaId) || mesas[0];

  return (
    <div className="bg-[#FFFDF9] rounded-xl border border-[#E3D9CF] shadow-xs overflow-hidden">
      {/* Cabecera de la sección */}
      <div className="bg-[#FBEAE4] border-b border-[#F0C4B6] px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Layers className="w-5 h-5 text-[#BB2B09]" />
          <div>
            <h2 className="font-serif font-bold text-sm text-[#1D1B1A] uppercase tracking-wide">
              2. Escrutinio por Mesas Electorales ({mesas.length} Mesas Activas)
            </h2>
            <p className="text-xs text-[#5C544F]">
              Introduce los votos urna a urna de cada mesa electoral del Departamento de Salud
            </p>
          </div>
        </div>

        {/* Selector de modo de vista y añadir mesa */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg bg-[#FFFDF9] p-0.5 border border-[#E3D9CF]">
            <button
              type="button"
              onClick={() => setViewMode('matrix')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold transition ${
                viewMode === 'matrix'
                  ? 'bg-[#BB2B09] text-white shadow-2xs'
                  : 'text-[#5C544F] hover:text-[#1D1B1A]'
              }`}
              title="Ver todas las mesas en formato tabla matriz simultánea"
            >
              <Table className="w-3.5 h-3.5" />
              <span>Vista Matriz</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold transition ${
                viewMode === 'cards'
                  ? 'bg-[#BB2B09] text-white shadow-2xs'
                  : 'text-[#5C544F] hover:text-[#1D1B1A]'
              }`}
              title="Editar mesa a mesa con fichas individuales"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Fichas por Mesa</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onAddMesa}
            disabled={mesas.length >= 7}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#FFFDF9] hover:bg-[#FBEAE4] text-xs font-bold text-[#BB2B09] border border-[#E3D9CF] shadow-2xs disabled:opacity-40 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Añadir Mesa</span>
          </button>
        </div>
      </div>

      {/* VISTA MATRIZ SIMULTÁNEA (Formato Acta Electoral Rápida) */}
      {viewMode === 'matrix' && (
        <div className="p-4 sm:p-5 space-y-4">
          <div className="overflow-x-auto border border-[#E3D9CF] rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F6F2EC] text-[#1D1B1A] font-bold uppercase text-[11px] tracking-wider border-b border-[#E3D9CF]">
                <tr>
                  <th className="py-2.5 px-3 w-10 text-center">Color</th>
                  <th className="py-2.5 px-3 w-28">Siglas</th>
                  <th className="py-2.5 px-3 min-w-[200px]">Candidatura / Sindicato</th>
                  {mesas.map((m) => (
                    <th
                      key={m.id}
                      className="py-2.5 px-2 text-center w-28 bg-[#FFFDF9] border-l border-[#E3D9CF]"
                    >
                      <div className="truncate max-w-[110px]" title={m.name}>
                        {m.name}
                      </div>
                      <div className="text-[10px] font-normal text-[#5C544F]">
                        Censo: {m.census}
                      </div>
                    </th>
                  ))}
                  <th className="py-2.5 px-3 text-right w-24 bg-[#FBEAE4] text-[#8A2007] border-l border-[#F0C4B6] font-black">
                    TOTAL VOTOS
                  </th>
                  <th className="py-2.5 px-3 text-right w-20 bg-[#FBEAE4] text-[#8A2007]">
                    % VÁLIDOS
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#ECE4DB]">
                {candidacies.map((cand) => {
                  const isIntersindical =
                    cand.acronym.toUpperCase().includes('INTERSINDICAL') ||
                    cand.acronym.toUpperCase() === 'IV' ||
                    cand.acronym.toUpperCase() === 'STEPV';

                  const candCalc = calculationResult.candidacies.find((c) => c.id === cand.id);
                  const totalVotes = candCalc?.votes || 0;
                  const pct = candCalc?.percentageOfValid || 0;

                  return (
                    <tr
                      key={cand.id}
                      className={`hover:bg-[#F6F2EC]/60 transition ${
                        isIntersindical ? 'bg-[#FBEAE4]/40' : ''
                      }`}
                    >
                      {/* Color */}
                      <td className="py-2 px-3 text-center">
                        <span
                          className="w-3.5 h-3.5 rounded-full inline-block border border-black/15 shadow-2xs"
                          style={{ backgroundColor: cand.color }}
                        />
                      </td>

                      {/* Siglas */}
                      <td className="py-2 px-3 font-bold text-[#1D1B1A]">
                        <span className="flex items-center gap-1">
                          {cand.acronym}
                          {isIntersindical && (
                            <span className="text-[#BB2B09]">
                              <Flame className="w-3 h-3 inline" />
                            </span>
                          )}
                        </span>
                      </td>

                      {/* Nombre */}
                      <td className="py-2 px-3 text-[#5C544F] font-medium">
                        {cand.name}
                      </td>

                      {/* Input de votos por cada mesa */}
                      {mesas.map((m) => {
                        const val = m.votesByCandidacy[cand.id] ?? 0;
                        return (
                          <td
                            key={m.id}
                            className="py-1.5 px-2 text-center border-l border-[#E3D9CF]"
                          >
                            <input
                              type="number"
                              min="0"
                              value={val === 0 ? '' : val}
                              onChange={(e) =>
                                handleVoteChange(
                                  m.id,
                                  cand.id,
                                  Number(e.target.value) || 0
                                )
                              }
                              placeholder="0"
                              className="w-20 px-2 py-1 text-center font-mono font-bold text-xs border border-[#E3D9CF] rounded focus:ring-2 focus:ring-[#BB2B09] focus:border-[#BB2B09] bg-white text-[#1D1B1A]"
                            />
                          </td>
                        );
                      })}

                      {/* Total Votos Acumulados */}
                      <td className="py-2 px-3 text-right font-mono font-black text-sm text-[#1D1B1A] bg-[#FBEAE4]/60 border-l border-[#F0C4B6]">
                        {totalVotes.toLocaleString('es-ES')}
                      </td>

                      {/* % sobre válidos */}
                      <td className="py-2 px-3 text-right font-mono text-xs bg-[#FBEAE4]/60">
                        <span
                          className={
                            pct >= 5
                              ? 'text-[#2F6B4F] font-bold'
                              : pct > 0
                              ? 'text-[#8A2007]'
                              : 'text-[#5C544F]'
                          }
                        >
                          {pct.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {/* FILA: Votos en Blanco por mesa */}
                <tr className="bg-[#FFFDF9] font-semibold text-[#8A2007]">
                  <td className="py-2 px-3 text-center">
                    <span className="w-3 h-3 rounded-full inline-block bg-[#E3D9CF]" />
                  </td>
                  <td className="py-2 px-3 font-bold">BLANCO</td>
                  <td className="py-2 px-3 italic text-xs text-[#5C544F]">
                    Votos en Blanco (válidos computables por Ley)
                  </td>
                  {mesas.map((m) => (
                    <td
                      key={m.id}
                      className="py-1.5 px-2 text-center border-l border-[#E3D9CF]"
                    >
                      <input
                        type="number"
                        min="0"
                        value={m.blankVotes === 0 ? '' : m.blankVotes}
                        onChange={(e) =>
                          handleMesaFieldChange(
                            m.id,
                            'blankVotes',
                            Number(e.target.value) || 0
                          )
                        }
                        placeholder="0"
                        className="w-20 px-2 py-1 text-center font-mono font-bold text-xs border border-[#F0C4B6] rounded bg-[#FBEAE4]/30 text-[#8A2007] focus:ring-1 focus:ring-[#BB2B09]"
                      />
                    </td>
                  ))}
                  <td className="py-2 px-3 text-right font-mono font-bold text-xs bg-[#FBEAE4] text-[#8A2007] border-l border-[#F0C4B6]">
                    {calculationResult.blankVotes.toLocaleString('es-ES')}
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-xs bg-[#FBEAE4] text-[#8A2007]">
                    {calculationResult.validVotes > 0
                      ? (
                          (calculationResult.blankVotes /
                            calculationResult.validVotes) *
                          100
                        ).toFixed(2)
                      : '0.00'}
                    %
                  </td>
                </tr>

                {/* FILA: TOTAL VOTOS VÁLIDOS */}
                <tr className="bg-[#FBEAE4]/70 font-bold text-[#8A2007] text-[11px] uppercase">
                  <td colSpan={3} className="py-2 px-3">
                    TOTAL VOTOS VÁLIDOS (Candidaturas + Blanco)
                  </td>
                  {calculationResult.mesas.map((m) => (
                    <td
                      key={m.id}
                      className="py-2 px-2 text-center font-mono font-black border-l border-[#E3D9CF]"
                    >
                      {m.validVotes.toLocaleString('es-ES')}
                    </td>
                  ))}
                  <td className="py-2 px-3 text-right font-mono font-black text-[#8A2007] border-l border-[#F0C4B6]">
                    {calculationResult.validVotes.toLocaleString('es-ES')}
                  </td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-[#8A2007]">
                    100.00%
                  </td>
                </tr>

                {/* FILA: Votos Nulos por mesa */}
                <tr className="bg-[#FFFDF9] text-[#7A4136]">
                  <td className="py-2 px-3 text-center">
                    <span className="w-3 h-3 rounded-full inline-block bg-[#F0C4B6]" />
                  </td>
                  <td className="py-2 px-3 font-bold">NULO</td>
                  <td className="py-2 px-3 italic text-xs text-[#5C544F]">
                    Votos Nulos (no válidos, no computan en reparto)
                  </td>
                  {mesas.map((m) => (
                    <td
                      key={m.id}
                      className="py-1.5 px-2 text-center border-l border-[#E3D9CF]"
                    >
                      <input
                        type="number"
                        min="0"
                        value={m.nullVotes === 0 ? '' : m.nullVotes}
                        onChange={(e) =>
                          handleMesaFieldChange(
                            m.id,
                            'nullVotes',
                            Number(e.target.value) || 0
                          )
                        }
                        placeholder="0"
                        className="w-20 px-2 py-1 text-center font-mono font-bold text-xs border border-[#E3D9CF] rounded bg-white text-[#7A4136] focus:ring-1 focus:ring-[#BB2B09]"
                      />
                    </td>
                  ))}
                  <td className="py-2 px-3 text-right font-mono font-bold text-xs bg-[#FBEAE4] text-[#7A4136] border-l border-[#F0C4B6]">
                    {calculationResult.nullVotes.toLocaleString('es-ES')}
                  </td>
                  <td className="py-2 px-3 text-right text-xs bg-[#FBEAE4] text-[#7A4136]">
                    -
                  </td>
                </tr>

                {/* FILA: TOTAL EMITIDOS */}
                <tr className="bg-[#F6F2EC] font-black text-[#1D1B1A] text-xs">
                  <td colSpan={3} className="py-2.5 px-3 uppercase">
                    TOTAL VOTOS EMITIDOS (Urna)
                  </td>
                  {calculationResult.mesas.map((m) => (
                    <td
                      key={m.id}
                      className="py-2.5 px-2 text-center font-mono font-black border-l border-[#E3D9CF]"
                    >
                      {m.totalBallots.toLocaleString('es-ES')}
                    </td>
                  ))}
                  <td className="py-2.5 px-3 text-right font-mono font-black text-sm bg-[#FBEAE4] text-[#BB2B09] border-l border-[#F0C4B6]">
                    {calculationResult.totalBallots.toLocaleString('es-ES')}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-xs bg-[#FBEAE4] text-[#BB2B09]">
                    -
                  </td>
                </tr>

                {/* FILA: CENSO ELECTORAL POR MESA */}
                <tr className="bg-[#FFFDF9] text-xs text-[#5C544F]">
                  <td colSpan={3} className="py-2 px-3 font-semibold">
                    CENSO ELECTORAL (Electores asignados a la mesa)
                  </td>
                  {mesas.map((m) => (
                    <td
                      key={m.id}
                      className="py-1.5 px-2 text-center border-l border-[#E3D9CF]"
                    >
                      <input
                        type="number"
                        min="1"
                        value={m.census === 0 ? '' : m.census}
                        onChange={(e) =>
                          handleMesaFieldChange(
                            m.id,
                            'census',
                            Number(e.target.value) || 0
                          )
                        }
                        placeholder="Censo"
                        className="w-20 px-2 py-1 text-center font-mono font-bold text-xs border border-[#E3D9CF] rounded bg-white text-[#1D1B1A] focus:ring-1 focus:ring-[#BB2B09]"
                        title={`Editar censo de ${m.name}`}
                      />
                    </td>
                  ))}
                  <td className="py-2 px-3 text-right font-mono font-bold text-xs bg-[#FBEAE4] text-[#1D1B1A] border-l border-[#F0C4B6]">
                    {calculationResult.totalCensus.toLocaleString('es-ES')}
                  </td>
                  <td className="py-2 px-3 text-right text-xs bg-[#FBEAE4] text-[#5C544F]">
                    Censo total
                  </td>
                </tr>

                {/* FILA: PARTICIPACIÓN POR MESA */}
                <tr className="bg-[#FFFDF9] text-xs font-bold text-[#2F6B4F]">
                  <td colSpan={3} className="py-2 px-3">
                    % PARTICIPACIÓN ELECTORAL
                  </td>
                  {calculationResult.mesas.map((m) => (
                    <td
                      key={m.id}
                      className="py-2 px-2 text-center font-mono border-l border-[#E3D9CF]"
                    >
                      {m.turnoutPercentage.toFixed(1)}%
                    </td>
                  ))}
                  <td className="py-2 px-3 text-right font-mono font-black bg-[#FBEAE4] text-[#2F6B4F] border-l border-[#F0C4B6]">
                    {calculationResult.turnoutPercentage.toFixed(1)}%
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-xs bg-[#FBEAE4] text-[#2F6B4F]">
                    Global
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VISTA POR FICHAS INDIVIDUALES DE CADA MESA */}
      {viewMode === 'cards' && (
        <div className="p-4 sm:p-5 space-y-4">
          {/* Pestañas de mesas */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-[#ECE4DB] pb-3">
            {mesas.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setActiveMesaId(m.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  activeMesa.id === m.id
                    ? 'bg-[#BB2B09] text-white shadow-2xs'
                    : 'bg-[#F6F2EC] text-[#5C544F] hover:bg-[#E3D9CF]/60 hover:text-[#1D1B1A]'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>{m.name}</span>
              </button>
            ))}
          </div>

          {/* Ficha de la mesa activa */}
          {activeMesa && (
            <div className="space-y-4 bg-[#F6F2EC]/40 p-4 rounded-xl border border-[#E3D9CF]">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#1D1B1A] mb-1">
                    Nombre / Ubicación de la Mesa
                  </label>
                  <input
                    type="text"
                    value={activeMesa.name}
                    onChange={(e) =>
                      handleMesaFieldChange(activeMesa.id, 'name', e.target.value)
                    }
                    placeholder="Ej: Mesa 1 - Hospital Vega Baja"
                    className="w-full px-3 py-1.5 text-xs border border-[#E3D9CF] rounded-lg bg-white font-bold text-[#1D1B1A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1D1B1A] mb-1">
                    Censo de esta Mesa
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={activeMesa.census === 0 ? '' : activeMesa.census}
                    onChange={(e) =>
                      handleMesaFieldChange(
                        activeMesa.id,
                        'census',
                        Number(e.target.value) || 0
                      )
                    }
                    placeholder="Ej: 600"
                    className="w-full px-3 py-1.5 text-xs font-mono font-bold border border-[#E3D9CF] rounded-lg bg-white"
                  />
                </div>

                <div className="flex items-end justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleResetMesa(activeMesa.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold text-[#8A2007] hover:bg-[#FBEAE4] border border-[#F0C4B6] transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Poner a Cero</span>
                  </button>

                  {mesas.length > 2 && (
                    <button
                      type="button"
                      onClick={() => onRemoveMesa(activeMesa.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold text-[#991B1B] hover:bg-rose-50 border border-rose-200 transition"
                      title="Eliminar esta mesa"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Eliminar Mesa</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Votos en Blanco y Votos Nulos en esta mesa */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#ECE4DB]">
                <div className="bg-[#FFFDF9] p-3 rounded-lg border border-[#F0C4B6]">
                  <label className="block text-xs font-bold text-[#8A2007] mb-1">
                    Votos en Blanco (Esta Mesa)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={activeMesa.blankVotes === 0 ? '' : activeMesa.blankVotes}
                    onChange={(e) =>
                      handleMesaFieldChange(
                        activeMesa.id,
                        'blankVotes',
                        Number(e.target.value) || 0
                      )
                    }
                    placeholder="0"
                    className="w-full px-3 py-1.5 text-sm font-mono font-bold border border-[#F0C4B6] rounded bg-white text-[#8A2007]"
                  />
                  <p className="text-[11px] text-[#8A2007] mt-1">
                    Votos válidos que computan para el cociente
                  </p>
                </div>

                <div className="bg-[#FFFDF9] p-3 rounded-lg border border-[#E3D9CF]">
                  <label className="block text-xs font-bold text-[#7A4136] mb-1">
                    Votos Nulos (Esta Mesa)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={activeMesa.nullVotes === 0 ? '' : activeMesa.nullVotes}
                    onChange={(e) =>
                      handleMesaFieldChange(
                        activeMesa.id,
                        'nullVotes',
                        Number(e.target.value) || 0
                      )
                    }
                    placeholder="0"
                    className="w-full px-3 py-1.5 text-sm font-mono font-bold border border-[#E3D9CF] rounded bg-white text-[#7A4136]"
                  />
                  <p className="text-[11px] text-[#5C544F] mt-1">
                    No computan para reparto ni umbral
                  </p>
                </div>
              </div>

              {/* Lista de candidaturas con sus votos en esta mesa */}
              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1D1B1A] mb-2">
                  Votos de Candidaturas en {activeMesa.name}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {candidacies.map((c) => {
                    const votes = activeMesa.votesByCandidacy[c.id] || 0;
                    return (
                      <div
                        key={c.id}
                        className="bg-white p-2.5 rounded-lg border border-[#E3D9CF] flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span
                            className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: c.color }}
                          />
                          <span className="font-bold text-xs text-[#1D1B1A]">
                            {c.acronym}
                          </span>
                        </div>
                        <input
                          type="number"
                          min="0"
                          value={votes === 0 ? '' : votes}
                          onChange={(e) =>
                            handleVoteChange(
                              activeMesa.id,
                              c.id,
                              Number(e.target.value) || 0
                            )
                          }
                          placeholder="0"
                          className="w-20 px-2 py-1 text-right font-mono font-bold text-xs border border-[#E3D9CF] rounded focus:ring-1 focus:ring-[#BB2B09]"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
