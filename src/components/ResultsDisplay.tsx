import React, { useState } from 'react';
import { CalculationResult, ElectionConfig, PollingMesa } from '../types';
import {
  Award,
  Vote,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  PieChart,
  ListOrdered,
  ChevronDown,
  ChevronUp,
  Percent,
  Calculator,
  Flame,
  Building,
  BarChart3,
} from 'lucide-react';

interface ResultsDisplayProps {
  result: CalculationResult;
  config: ElectionConfig;
  mesas: PollingMesa[];
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  result,
  config,
  mesas,
}) => {
  const [showMathDetails, setShowMathDetails] = useState(false);
  const [showChart, setShowChart] = useState(true);

  // Determinar la candidatura ganadora en cada mesa
  const winningByMesa: Record<string, { acronym: string; votes: number; color: string }> = {};
  mesas.forEach((mesa) => {
    let topVotes = -1;
    let winner = { acronym: '-', votes: 0, color: '#5C544F' };
    result.candidacies.forEach((c) => {
      const v = c.votesByMesa[mesa.id] || 0;
      if (v > topVotes) {
        topVotes = v;
        winner = { acronym: c.acronym, votes: v, color: c.color };
      }
    });
    winningByMesa[mesa.id] = winner;
  });

  return (
    <div className="space-y-5">
      {/* 1. Indicadores Principales (KPI Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Votos Válidos */}
        <div className="bg-[#FFFDF9] p-3.5 rounded-xl border border-[#E3D9CF] shadow-2xs">
          <div className="flex items-center justify-between text-[#5C544F] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Votos Válidos
            </span>
            <Vote className="w-4 h-4 text-[#2F6B4F]" />
          </div>
          <div className="text-xl font-mono font-extrabold text-[#1D1B1A]">
            {result.validVotes.toLocaleString('es-ES')}
          </div>
          <div className="text-[11px] text-[#5C544F] mt-0.5">
            Base oficial de reparto
          </div>
        </div>

        {/* Umbral 5% */}
        <div className="bg-[#FBEAE4] p-3.5 rounded-xl border border-[#F0C4B6] shadow-2xs">
          <div className="flex items-center justify-between text-[#8A2007] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Umbral 5%
            </span>
            <Percent className="w-4 h-4 text-[#BB2B09]" />
          </div>
          <div className="text-xl font-mono font-extrabold text-[#8A2007]">
            {result.thresholdVotesNeeded.toFixed(2)}
          </div>
          <div className="text-[11px] text-[#8A2007] font-medium mt-0.5">
            Mínimo para entrar a reparto
          </div>
        </div>

        {/* Cociente Electoral */}
        <div className="bg-[#FFFDF9] p-3.5 rounded-xl border border-[#E3D9CF] shadow-2xs">
          <div className="flex items-center justify-between text-[#5C544F] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Cociente
            </span>
            <Calculator className="w-4 h-4 text-[#BB2B09]" />
          </div>
          <div className="text-xl font-mono font-extrabold text-[#1D1B1A]">
            {result.quotient.toFixed(4)}
          </div>
          <div className="text-[11px] text-[#5C544F] font-medium mt-0.5">
            {result.validVotes} / {result.targetSeats} puestos
          </div>
        </div>

        {/* Delegados Asignados (Tarjeta oscura de alto contraste como en la imagen) */}
        <div className="bg-[#1D1B1A] p-3.5 rounded-xl text-white shadow-2xs border border-[#3A3330]">
          <div className="flex items-center justify-between text-[#E3D9CF] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF6A45]">
              Representantes
            </span>
            <Award className="w-4 h-4 text-[#FF6A45]" />
          </div>
          <div className="text-xl font-mono font-black text-white">
            {result.totalSeatsCovered} / {result.targetSeats}
          </div>
          <div className="text-[11px] text-[#E3D9CF] mt-0.5">
            {result.totalDirectSeats} directos + {result.totalRemainderSeats} restos
          </div>
        </div>

        {/* Participación Global */}
        <div className="bg-[#FFFDF9] p-3.5 rounded-xl border border-[#E3D9CF] shadow-2xs">
          <div className="flex items-center justify-between text-[#5C544F] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Participación
            </span>
            <TrendingUp className="w-4 h-4 text-[#2F6B4F]" />
          </div>
          <div className="text-xl font-mono font-extrabold text-[#1D1B1A]">
            {result.turnoutPercentage.toFixed(1)}%
          </div>
          <div className="text-[11px] text-[#5C544F] mt-0.5">
            {result.totalBallots.toLocaleString('es-ES')} votos en {mesas.length} mesas
          </div>
        </div>

        {/* Votos Blanco / Nulo */}
        <div className="bg-[#FFFDF9] p-3.5 rounded-xl border border-[#E3D9CF] shadow-2xs">
          <div className="flex items-center justify-between text-[#5C544F] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Blanco / Nulo
            </span>
            <Vote className="w-4 h-4 text-[#7A4136]" />
          </div>
          <div className="text-xs font-bold text-[#1D1B1A] mt-1">
            Blanco: <span className="font-mono text-[#8A2007]">{result.blankVotes}</span>
          </div>
          <div className="text-xs text-[#7A4136] font-semibold">
            Nulo: <span className="font-mono">{result.nullVotes}</span>
          </div>
        </div>
      </div>

      {/* Alerta de Empate en restos si existiera */}
      {result.hasTieInRemainders && (
        <div className="bg-[#FEF2F2] border-l-4 border-[#EF4444] p-4 rounded-r-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#EF4444] flex-shrink-0 mt-0.5" />
          <div className="text-xs text-[#991B1B]">
            <strong className="block font-bold mb-1">
              Atención: Situación de Empate en la Adjudicación por Mayores Restos
            </strong>
            {result.tieDetails.map((detail, idx) => (
              <p key={idx}>{detail}</p>
            ))}
          </div>
        </div>
      )}

      {/* 2. TABLA OFICIAL DE ESCRUTINIO FINAL POR MESAS ELECTORALES Y ATRIBUCIÓN DE REPRESENTANTES */}
      <div className="bg-[#FFFDF9] rounded-xl border border-[#E3D9CF] shadow-xs overflow-hidden">
        <div className="bg-[#1D1B1A] px-5 py-3.5 text-white flex flex-wrap items-center justify-between gap-3 border-b border-[#3A3330]">
          <div className="flex items-center gap-2.5">
            <ListOrdered className="w-5 h-5 text-[#FF6A45]" />
            <div>
              <h2 className="font-serif font-bold text-sm tracking-wide uppercase text-white">
                3. Acta Oficial de Escrutinio por Mesas Electorales y Atribución
              </h2>
              <p className="text-xs text-[#E3D9CF]">
                Recuento urna a urna en las {mesas.length} mesas electorales · Cociente: {result.quotient.toFixed(4)} ({result.validVotes} votos válidos ÷ {result.targetSeats} puestos)
              </p>
            </div>
          </div>

          <div className="text-right text-xs">
            <span className="text-[#E3D9CF]">Censo General: </span>
            <span className="font-mono font-bold text-white">
              {result.totalCensus.toLocaleString('es-ES')}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F6F2EC] text-[#1D1B1A] font-bold uppercase text-[11px] tracking-wider border-b border-[#E3D9CF]">
              <tr>
                <th className="py-3 px-3 w-10 text-center">Color</th>
                <th className="py-3 px-3 w-28">Siglas</th>
                <th className="py-3 px-3 min-w-[190px]">Candidatura / Sindicato</th>

                {/* Columnas de cada mesa electoral */}
                {mesas.map((m) => (
                  <th
                    key={m.id}
                    className="py-3 px-2 text-center w-24 bg-[#FFFDF9] border-l border-[#E3D9CF]"
                  >
                    <div className="truncate max-w-[95px]" title={m.name}>
                      {m.name}
                    </div>
                    <div className="text-[10px] font-normal text-[#5C544F]">
                      Censo: {m.census}
                    </div>
                  </th>
                ))}

                {/* Totales y asignación */}
                <th className="py-3 px-3 w-24 text-right bg-[#FBEAE4] text-[#8A2007] border-l border-[#F0C4B6] font-black">
                  TOTAL VOTOS
                </th>
                <th className="py-3 px-3 w-20 text-right bg-[#FBEAE4] text-[#8A2007]">
                  % VÁLIDOS
                </th>
                <th className="py-3 px-3 w-28 text-center border-l border-[#E3D9CF]">
                  Umbral (≥5%)
                </th>
                <th className="py-3 px-2 w-20 text-center bg-[#F6F2EC]">
                  Directos
                </th>
                <th className="py-3 px-2 w-20 text-right font-mono">
                  Resto
                </th>
                <th className="py-3 px-2 w-24 text-center bg-[#FBEAE4]/60">
                  Mayor Resto
                </th>
                <th className="py-3 px-3 w-28 text-center bg-[#1D1B1A] text-white font-black text-xs">
                  TOTAL DELEGADOS
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#ECE4DB]">
              {result.candidacies.map((c) => {
                const isExcluded = !c.passesThreshold;
                const isIntersindical =
                  c.acronym.toUpperCase().includes('INTERSINDICAL') ||
                  c.acronym.toUpperCase() === 'IV' ||
                  c.acronym.toUpperCase() === 'STEPV';

                return (
                  <tr
                    key={c.id}
                    className={`hover:bg-[#F6F2EC]/60 transition ${
                      isExcluded ? 'bg-[#F6F2EC]/40 opacity-70' : ''
                    } ${isIntersindical ? 'bg-[#FBEAE4]/40' : ''}`}
                  >
                    {/* Color */}
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className="w-4 h-4 rounded-full inline-block border border-black/15 shadow-2xs"
                        style={{ backgroundColor: c.color }}
                      />
                    </td>

                    {/* Siglas */}
                    <td className="py-2.5 px-3 font-bold text-[#1D1B1A]">
                      <div className="flex items-center gap-1.5">
                        <span>{c.acronym}</span>
                        {isIntersindical && (
                          <span
                            className="text-[#BB2B09]"
                            title="Intersindical Salut"
                          >
                            <Flame className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Nombre */}
                    <td className="py-2.5 px-3 font-medium text-[#5C544F]">
                      {c.name}
                    </td>

                    {/* Votos en cada mesa electoral */}
                    {mesas.map((m) => {
                      const v = c.votesByMesa[m.id] || 0;
                      const isWinner =
                        winningByMesa[m.id]?.acronym === c.acronym && v > 0;
                      return (
                        <td
                          key={m.id}
                          className={`py-2.5 px-2 text-center font-mono border-l border-[#E3D9CF] ${
                            isWinner ? 'font-black text-[#BB2B09] bg-[#FBEAE4]/30' : 'text-[#1D1B1A]'
                          }`}
                        >
                          {v.toLocaleString('es-ES')}
                        </td>
                      );
                    })}

                    {/* TOTAL VOTOS */}
                    <td className="py-2.5 px-3 text-right font-mono font-black text-sm text-[#1D1B1A] bg-[#FBEAE4]/60 border-l border-[#F0C4B6]">
                      {c.votes.toLocaleString('es-ES')}
                    </td>

                    {/* % Válidos */}
                    <td className="py-2.5 px-3 text-right font-mono text-xs bg-[#FBEAE4]/60">
                      <span
                        className={
                          c.passesThreshold
                            ? 'text-[#2F6B4F] font-bold'
                            : 'text-[#8A2007]'
                        }
                      >
                        {c.percentageOfValid.toFixed(2)}%
                      </span>
                    </td>

                    {/* Estado del Umbral del 5% */}
                    <td className="py-2.5 px-3 text-center border-l border-[#E3D9CF]">
                      {c.passesThreshold ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-[#E7F3ED] text-[#2F6B4F] border border-[#2F6B4F]/30">
                          <CheckCircle2 className="w-3 h-3 text-[#2F6B4F]" />
                          <span>Supera 5%</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-[#FEF2F2] text-[#991B1B] border border-rose-200">
                          <XCircle className="w-3 h-3 text-[#991B1B]" />
                          <span>Excluida</span>
                        </span>
                      )}
                    </td>

                    {/* Puestos Directos por Cociente */}
                    <td className="py-2.5 px-2 text-center font-mono font-bold text-[#1D1B1A] bg-[#F6F2EC]">
                      {isExcluded ? '-' : c.directSeats}
                    </td>

                    {/* Resto */}
                    <td className="py-2.5 px-2 text-right font-mono text-[#5C544F]">
                      {isExcluded ? '-' : c.remainder.toFixed(3)}
                    </td>

                    {/* Puesto por Mayor Resto */}
                    <td className="py-2.5 px-2 text-center bg-[#FBEAE4]/40 font-bold">
                      {c.additionalSeat ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#FBEAE4] text-[#8A2007] text-[11px] font-black border border-[#F0C4B6]">
                          +1 (Resto #{c.remainderRank})
                        </span>
                      ) : isExcluded ? (
                        '-'
                      ) : (
                        <span className="text-[#5C544F]/60 text-[11px]">
                          0 (#{c.remainderRank})
                        </span>
                      )}
                    </td>

                    {/* TOTAL REPRESENTANTES / DELEGADOS */}
                    <td className="py-2.5 px-3 text-center bg-[#F6F2EC] border-l border-[#E3D9CF]">
                      <span
                        className={`inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded font-black text-sm text-white shadow-2xs ${
                          isIntersindical
                            ? 'bg-[#BB2B09]'
                            : c.totalSeats > 0
                            ? 'bg-[#2F6B4F]'
                            : 'bg-[#5C544F]'
                        }`}
                      >
                        {c.totalSeats}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {/* Fila de Votos en Blanco */}
              <tr className="bg-[#FFFDF9] text-[#8A2007] font-semibold text-xs">
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
                    className="py-2 px-2 text-center font-mono border-l border-[#E3D9CF]"
                  >
                    {m.blankVotes.toLocaleString('es-ES')}
                  </td>
                ))}
                <td className="py-2 px-3 text-right font-mono font-bold bg-[#FBEAE4] border-l border-[#F0C4B6]">
                  {result.blankVotes.toLocaleString('es-ES')}
                </td>
                <td className="py-2 px-3 text-right font-mono bg-[#FBEAE4]">
                  {result.validVotes > 0
                    ? ((result.blankVotes / result.validVotes) * 100).toFixed(2)
                    : '0.00'}
                  %
                </td>
                <td className="py-2 px-3 text-center text-[10px] text-[#5C544F] border-l border-[#E3D9CF]">
                  No asignable
                </td>
                <td className="py-2 px-2 text-center bg-[#F6F2EC]">-</td>
                <td className="py-2 px-2 text-right font-mono">-</td>
                <td className="py-2 px-2 text-center bg-[#FBEAE4]/40">-</td>
                <td className="py-2 px-3 text-center bg-[#F6F2EC] border-l border-[#E3D9CF] font-bold">-</td>
              </tr>

              {/* Fila de Votos Nulos */}
              <tr className="bg-[#FFFDF9] text-[#7A4136] text-xs">
                <td className="py-2 px-3 text-center">
                  <span className="w-3 h-3 rounded-full inline-block bg-[#F0C4B6]" />
                </td>
                <td className="py-2 px-3 font-bold">NULO</td>
                <td className="py-2 px-3 italic text-xs text-[#5C544F]">
                  Votos Nulos (no válidos)
                </td>
                {mesas.map((m) => (
                  <td
                    key={m.id}
                    className="py-2 px-2 text-center font-mono border-l border-[#E3D9CF]"
                  >
                    {m.nullVotes.toLocaleString('es-ES')}
                  </td>
                ))}
                <td className="py-2 px-3 text-right font-mono font-bold bg-[#FBEAE4] border-l border-[#F0C4B6]">
                  {result.nullVotes.toLocaleString('es-ES')}
                </td>
                <td className="py-2 px-3 text-right text-xs bg-[#FBEAE4]">-</td>
                <td className="py-2 px-3 text-center text-[10px] text-[#5C544F] border-l border-[#E3D9CF]">
                  No computable
                </td>
                <td className="py-2 px-2 text-center bg-[#F6F2EC]">-</td>
                <td className="py-2 px-2 text-right font-mono">-</td>
                <td className="py-2 px-2 text-center bg-[#FBEAE4]/40">-</td>
                <td className="py-2 px-3 text-center bg-[#F6F2EC] border-l border-[#E3D9CF] font-bold">-</td>
              </tr>

              {/* Fila de Totales de Escrutinio */}
              <tr className="bg-[#1D1B1A] text-white font-bold text-xs">
                <td colSpan={3} className="py-3 px-3 uppercase tracking-wider text-[#FF6A45]">
                  TOTALES ESCRUTINIO Y ATRIBUCIÓN
                </td>

                {mesas.map((m) => {
                  const mSummary = result.mesas.find((ms) => ms.id === m.id);
                  return (
                    <td
                      key={m.id}
                      className="py-3 px-2 text-center font-mono text-[#E3D9CF] border-l border-[#3A3330]"
                    >
                      {mSummary?.validVotes.toLocaleString('es-ES')} válidos
                    </td>
                  );
                })}

                <td className="py-3 px-3 text-right font-mono text-[#FF6A45] text-sm border-l border-[#3A3330]">
                  {result.validVotes.toLocaleString('es-ES')}
                </td>
                <td className="py-3 px-3 text-right font-mono text-[#2F6B4F] bg-[#1D1B1A]">
                  100.00%
                </td>
                <td className="py-3 px-3 text-center text-xs text-[#E3D9CF] border-l border-[#3A3330]">
                  {result.qualifiedCandidacies.length} aptas
                </td>
                <td className="py-3 px-2 text-center font-mono text-[#FF6A45] bg-[#2A2422]">
                  {result.totalDirectSeats} dir.
                </td>
                <td className="py-3 px-2 text-right text-[#E3D9CF]">-</td>
                <td className="py-3 px-2 text-center font-mono text-[#FF6A45] bg-[#2A2422]">
                  {result.totalRemainderSeats} rest.
                </td>
                <td className="py-3 px-3 text-center bg-[#BB2B09] text-white font-black text-base border-l border-[#3A3330]">
                  {result.totalSeatsCovered}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Composición Visual del Órgano (Hemiciclo / Cuadrícula de Representantes) */}
      <div className="bg-[#FFFDF9] rounded-xl border border-[#E3D9CF] shadow-xs p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-serif font-bold text-sm text-[#1D1B1A] flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#BB2B09]" />
              Composición Visual de la {config.organType} ({result.totalSeatsCovered} Representantes)
            </h3>
            <p className="text-xs text-[#5C544F]">
              Atribución gráfica de escaños por color distintivo de cada candidatura sindical
            </p>
          </div>

          {/* Resumen de escaños por sindicato */}
          <div className="flex flex-wrap items-center gap-2">
            {result.qualifiedCandidacies
              .filter((c) => c.totalSeats > 0)
              .map((c) => (
                <div
                  key={c.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold border"
                  style={{
                    backgroundColor: `${c.color}15`,
                    borderColor: `${c.color}40`,
                    color: c.color,
                  }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: c.color }}
                  />
                  <span>
                    {c.acronym}: {c.totalSeats}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Cuadrícula de escaños */}
        <div className="bg-[#F6F2EC] p-5 rounded-xl border border-[#E3D9CF]">
          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-4xl mx-auto">
            {result.qualifiedCandidacies
              .flatMap((c) =>
                Array.from({ length: c.totalSeats }).map((_, seatIdx) => ({
                  ...c,
                  seatIdx,
                }))
              )
              .map((seat, idx) => (
                <div
                  key={`${seat.id}-${seat.seatIdx}`}
                  className="group relative flex flex-col items-center justify-center w-12 h-14 rounded shadow-2xs border border-black/10 transition-transform hover:scale-110 cursor-pointer"
                  style={{ backgroundColor: seat.color }}
                  title={`${seat.acronym} - Representante #${seat.seatIdx + 1} (${seat.name})`}
                >
                  <Award className="w-4 h-4 text-white/90 drop-shadow-2xs" />
                  <span className="text-[10px] font-black text-white leading-tight mt-0.5 tracking-tight px-1 truncate max-w-full">
                    {seat.acronym}
                  </span>
                  <span className="text-[8px] font-semibold text-white/80">
                    #{idx + 1}
                  </span>

                  {/* Tooltip flotante */}
                  <div className="absolute bottom-full mb-1 hidden group-hover:block bg-[#1D1B1A] text-white text-[11px] rounded px-2 py-1 whitespace-nowrap z-30 shadow-lg">
                    {seat.name} ({seat.acronym})
                  </div>
                </div>
              ))}

            {result.totalSeatsCovered === 0 && (
              <div className="text-[#5C544F] text-xs py-4 italic">
                Introduce los votos de las mesas para ver la atribución de delegados
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Comparativa Gráfica de Votos por Mesa */}
      <div className="bg-[#FFFDF9] rounded-xl border border-[#E3D9CF] shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => setShowChart(!showChart)}
          className="w-full px-5 py-3.5 bg-[#F6F2EC] hover:bg-[#ECE4DB] text-left flex items-center justify-between text-xs font-bold text-[#1D1B1A] transition"
        >
          <span className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#BB2B09]" />
            <span>Comparativa de Votos por Mesas Electorales del Departamento</span>
          </span>
          {showChart ? (
            <ChevronUp className="w-4 h-4 text-[#5C544F]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#5C544F]" />
          )}
        </button>

        {showChart && (
          <div className="p-5 border-t border-[#E3D9CF] space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mesas.map((mesa) => {
                const mesaSummary = result.mesas.find((ms) => ms.id === mesa.id);
                return (
                  <div
                    key={mesa.id}
                    className="bg-white p-3.5 rounded-lg border border-[#E3D9CF] shadow-2xs"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-serif font-bold text-xs text-[#1D1B1A] flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-[#BB2B09]" />
                        {mesa.name}
                      </span>
                      <span className="text-[10px] font-bold text-[#2F6B4F]">
                        {mesaSummary?.turnoutPercentage.toFixed(1)}% part.
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {result.candidacies.map((c) => {
                        const votes = c.votesByMesa[mesa.id] || 0;
                        const maxVotesInMesa = Math.max(
                          1,
                          ...result.candidacies.map((cand) => cand.votesByMesa[mesa.id] || 0)
                        );
                        const widthPct = (votes / maxVotesInMesa) * 100;

                        return (
                          <div key={c.id} className="text-xs">
                            <div className="flex items-center justify-between text-[11px] mb-0.5">
                              <span className="font-semibold text-[#1D1B1A]">
                                {c.acronym}
                              </span>
                              <span className="font-mono text-[#5C544F]">
                                {votes} votos
                              </span>
                            </div>
                            <div className="w-full bg-[#F6F2EC] h-2 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${widthPct}%`,
                                  backgroundColor: c.color,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 5. Auditoría y Justificación Matemática Paso a Paso (Art. 71.2 ET) */}
      <div className="bg-[#FFFDF9] rounded-xl border border-[#E3D9CF] shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => setShowMathDetails(!showMathDetails)}
          className="w-full px-5 py-3.5 bg-[#F6F2EC] hover:bg-[#ECE4DB] text-left flex items-center justify-between text-xs font-bold text-[#1D1B1A] transition"
        >
          <span className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-[#BB2B09]" />
            <span>Auditoría y Justificación Matemática Paso a Paso (Art. 71.2 ET)</span>
          </span>
          {showMathDetails ? (
            <ChevronUp className="w-4 h-4 text-[#5C544F]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#5C544F]" />
          )}
        </button>

        {showMathDetails && (
          <div className="p-5 space-y-4 text-xs text-[#1D1B1A] bg-[#FFFDF9] border-t border-[#E3D9CF]">
            {/* Paso 1 */}
            <div className="bg-[#F6F2EC] p-3.5 rounded-lg border border-[#E3D9CF]">
              <h4 className="font-bold text-[#8A2007] text-xs mb-1">
                Paso 1: Votos Válidos Totales y Umbral Legal de Exclusión (5%)
              </h4>
              <p className="text-[#5C544F] mb-2 leading-relaxed">
                Los votos válidos resultan de sumar los votos a candidaturas en todas las mesas ({result.candidaciesVotes}) más los votos en blanco ({result.blankVotes}), dando un total consolidado de{' '}
                <strong className="text-[#1D1B1A]">{result.validVotes} votos válidos</strong>.
                Los votos nulos ({result.nullVotes}) se excluyen de la base legal de reparto.
              </p>
              <div className="font-mono bg-white p-2 rounded border border-[#E3D9CF] text-[#8A2007]">
                Umbral 5% = {result.validVotes} votos válidos × 0.05 = {result.thresholdVotesNeeded.toFixed(2)} votos.
              </div>
              <p className="text-[11px] text-[#5C544F] mt-1">
                Toda candidatura con menos de {result.thresholdVotesNeeded.toFixed(2)} votos queda excluida del reparto.
              </p>
            </div>

            {/* Paso 2 */}
            <div className="bg-[#F6F2EC] p-3.5 rounded-lg border border-[#E3D9CF]">
              <h4 className="font-bold text-[#8A2007] text-xs mb-1">
                Paso 2: Cálculo del Cociente Electoral
              </h4>
              <p className="text-[#5C544F] mb-2 leading-relaxed">
                Conforme al Art. 71.2.b del Estatuto de los Trabajadores, el cociente resulta de dividir el número total de votos válidos por el de puestos a cubrir ({result.targetSeats}):
              </p>
              <div className="font-mono bg-white p-2 rounded border border-[#E3D9CF] text-[#8A2007]">
                Cociente Electoral = {result.validVotes} ÷ {result.targetSeats} = {result.quotient.toFixed(4)}
              </div>
            </div>

            {/* Paso 3 */}
            <div className="bg-[#F6F2EC] p-3.5 rounded-lg border border-[#E3D9CF]">
              <h4 className="font-bold text-[#8A2007] text-xs mb-1">
                Paso 3: Asignación Directa y Cálculo de Restos
              </h4>
              <p className="text-[#5C544F] mb-2 leading-relaxed">
                A cada lista apta se le asignan tantos representantes como veces contenga el cociente entero en sus votos:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-[#5C544F]">
                {result.qualifiedCandidacies.map((c) => (
                  <li key={c.id}>
                    <strong className="text-[#1D1B1A]">{c.acronym}</strong>: {c.votes} votos ÷ {result.quotient.toFixed(4)} = {(c.votes / (result.quotient || 1)).toFixed(4)} →{' '}
                    <span className="font-bold text-[#2F6B4F]">{c.directSeats} delegados directos</span> (Resto: {c.remainder.toFixed(3)})
                  </li>
                ))}
              </ul>
              <div className="mt-2 text-[#5C544F]">
                Puestos directos cubiertos: <strong className="text-[#1D1B1A]">{result.totalDirectSeats}</strong>. Puestos sobrantes a repartir por restos:{' '}
                <strong className="text-[#8A2007]">{result.seatsRemaining}</strong>.
              </div>
            </div>

            {/* Paso 4 */}
            <div className="bg-[#F6F2EC] p-3.5 rounded-lg border border-[#E3D9CF]">
              <h4 className="font-bold text-[#8A2007] text-xs mb-1">
                Paso 4: Adjudicación de Puestos Sobrantes por Mayores Restos
              </h4>
              <p className="text-[#5C544F] mb-2 leading-relaxed">
                Se ordenan las candidaturas aptas de mayor a menor resto. Los {result.seatsRemaining} puestos sobrantes se adjudican sucesivamente a las candidaturas con mayores restos:
              </p>
              <div className="space-y-1">
                {result.qualifiedCandidacies
                  .sort((a, b) => b.remainder - a.remainder)
                  .map((c, i) => (
                    <div
                      key={c.id}
                      className={`flex items-center justify-between px-3 py-1.5 rounded ${
                        c.additionalSeat
                          ? 'bg-[#FBEAE4] text-[#8A2007] font-bold border border-[#F0C4B6]'
                          : 'bg-white text-[#5C544F]'
                      }`}
                    >
                      <span>
                        #{i + 1} {c.acronym} (Resto: {c.remainder.toFixed(3)} | Votos: {c.votes})
                      </span>
                      <span>
                        {c.additionalSeat
                          ? '+1 Delegado por mayor resto'
                          : 'Sin delegado por resto'}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
