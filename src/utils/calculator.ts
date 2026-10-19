/**
 * @license
 * Intersindical Salut Orihuela - Módulo de Cálculo Electoral Sindical por Mesas
 * Sistema proporcional por cociente electoral y mayores restos (Art. 71.2 Estatuto de los Trabajadores)
 */

import { Candidacy, PollingMesa, ElectionConfig, CalculationResult, CandidacyCalculation, MesaSummary } from '../types';

/**
 * Calcula el número legal de representantes según el censo de trabajadores
 * conforme a los artículos 66 y 71 del Estatuto de los Trabajadores y art. 39 EBEP.
 * REGLA: No hay órgano a constituir menor a 50 trabajadores.
 */
export function getRecommendedSeats(census: number): number {
  if (census < 50) return 0; // No se constituye órgano unitario por debajo de 50 trabajadores

  if (census <= 100) return 5;
  if (census <= 250) return 9;
  if (census <= 500) return 13;
  if (census <= 750) return 17;
  if (census <= 1000) return 21;

  // De 1001 en adelante: 21 + 2 por cada 1.000 o fracción, hasta un máximo legal de 75
  const extraThousands = Math.ceil((census - 1000) / 1000);
  const total = 21 + extraThousands * 2;
  return Math.min(total, 75);
}

/**
 * Realiza el escrutinio oficial por mesas electorales y la asignación proporcional
 * de delegados según el Art. 71.2 del Estatuto de los Trabajadores
 */
export function calculateMesaElectionResults(
  candidacies: Candidacy[],
  mesas: PollingMesa[],
  config: ElectionConfig
): CalculationResult {
  const targetSeats = Math.max(1, Number(config.seats) || 1);
  const thresholdPercent = Number(config.thresholdPercent) || 5;

  // 1. Resumen por cada mesa electoral
  let totalBlankVotes = 0;
  let totalNullVotes = 0;
  let totalCensus = 0;

  const candidacyTotalVotes: Record<string, number> = {};
  candidacies.forEach((c) => {
    candidacyTotalVotes[c.id] = 0;
  });

  const mesasSummaries: MesaSummary[] = mesas.map((mesa) => {
    const blank = Math.max(0, Number(mesa.blankVotes) || 0);
    const nulls = Math.max(0, Number(mesa.nullVotes) || 0);
    const census = Math.max(0, Number(mesa.census) || 0);

    let mesaCandVotes = 0;
    const votesByCand: Record<string, number> = {};

    candidacies.forEach((c) => {
      const v = Math.max(0, Number(mesa.votesByCandidacy[c.id]) || 0);
      votesByCand[c.id] = v;
      mesaCandVotes += v;
      candidacyTotalVotes[c.id] = (candidacyTotalVotes[c.id] || 0) + v;
    });

    const validVotes = mesaCandVotes + blank;
    const totalBallots = validVotes + nulls;
    const turnoutPercentage = census > 0 ? (totalBallots / census) * 100 : 0;

    totalBlankVotes += blank;
    totalNullVotes += nulls;
    totalCensus += census;

    return {
      id: mesa.id,
      number: mesa.number,
      name: mesa.name,
      census,
      candidaciesVotes: mesaCandVotes,
      blankVotes: blank,
      nullVotes: nulls,
      validVotes,
      totalBallots,
      turnoutPercentage,
      votesByCandidacy: votesByCand,
    };
  });

  // 2. Totales consolidados de todas las mesas
  const candidaciesVotes = candidacies.reduce(
    (sum, c) => sum + (candidacyTotalVotes[c.id] || 0),
    0
  );
  const validVotes = candidaciesVotes + totalBlankVotes;
  const totalBallots = validVotes + totalNullVotes;
  const turnoutPercentage = totalCensus > 0 ? (totalBallots / totalCensus) * 100 : 0;

  // 3. Umbral de exclusión del 5% de los votos válidos
  // Art. 71.2 ET: Votos válidos = candidaturas + votos en blanco
  const thresholdVotesNeeded = (validVotes * thresholdPercent) / 100;

  // 4. Candidaturas preliminares con desglose por mesa
  const preliminaryList = candidacies.map((c) => {
    const votes = candidacyTotalVotes[c.id] || 0;
    const percentageOfValid = validVotes > 0 ? (votes / validVotes) * 100 : 0;
    const percentageOfTurnout = totalBallots > 0 ? (votes / totalBallots) * 100 : 0;
    const passesThreshold = validVotes > 0 && votes >= thresholdVotesNeeded;

    const votesByMesa: Record<string, number> = {};
    mesas.forEach((m) => {
      votesByMesa[m.id] = Math.max(0, Number(m.votesByCandidacy[c.id]) || 0);
    });

    return {
      id: c.id,
      name: c.name,
      acronym: c.acronym,
      color: c.color,
      votes,
      votesByMesa,
      percentageOfValid,
      percentageOfTurnout,
      passesThreshold,
    };
  });

  // 5. Cociente electoral
  let dividendForQuotient = validVotes;
  if (config.quotientFormula === 'threshold_only') {
    dividendForQuotient = preliminaryList
      .filter((c) => c.passesThreshold)
      .reduce((sum, c) => sum + c.votes, 0);
  }

  const quotient = targetSeats > 0 && dividendForQuotient > 0
    ? dividendForQuotient / targetSeats
    : 0;

  // 6. Asignación directa y cálculo de restos
  let totalDirectSeats = 0;

  const withDirectSeats = preliminaryList.map((c) => {
    if (!c.passesThreshold || quotient === 0) {
      return {
        ...c,
        directSeats: 0,
        remainder: c.passesThreshold ? c.votes : 0,
        remainderRank: 999,
        additionalSeat: false,
        totalSeats: 0,
      };
    }

    const directSeats = Math.floor(c.votes / quotient);
    totalDirectSeats += directSeats;
    const remainder = Number((c.votes - directSeats * quotient).toFixed(6));

    return {
      ...c,
      directSeats,
      remainder,
      remainderRank: 0,
      additionalSeat: false,
      totalSeats: directSeats,
    };
  });

  // 7. Puestos restantes a repartir por restos mayores
  const seatsRemaining = Math.max(0, targetSeats - totalDirectSeats);

  const eligibleForRemainders = withDirectSeats
    .filter((c) => c.passesThreshold)
    .sort((a, b) => {
      const diff = b.remainder - a.remainder;
      if (Math.abs(diff) > 0.00001) {
        return diff;
      }
      // Desempate por mayor número de votos totales
      return b.votes - a.votes;
    });

  const additionalSeatMap = new Map<string, boolean>();
  let totalRemainderSeats = 0;
  const tieDetails: string[] = [];
  let hasTieInRemainders = false;

  if (seatsRemaining > 0 && eligibleForRemainders.length > seatsRemaining) {
    const boundaryRemainder = eligibleForRemainders[seatsRemaining - 1].remainder;
    const nextRemainder = eligibleForRemainders[seatsRemaining].remainder;

    if (Math.abs(boundaryRemainder - nextRemainder) < 0.00001) {
      const boundaryVotes = eligibleForRemainders[seatsRemaining - 1].votes;
      const nextVotes = eligibleForRemainders[seatsRemaining].votes;

      if (boundaryVotes === nextVotes) {
        hasTieInRemainders = true;
        tieDetails.push(
          `Empate exacto en resto (${boundaryRemainder.toFixed(2)}) y votos (${boundaryVotes}) entre ${eligibleForRemainders[seatsRemaining - 1].acronym} y ${eligibleForRemainders[seatsRemaining].acronym}. Requiere resolución por sorteo o acuerdo de mesa.`
        );
      }
    }
  }

  for (let i = 0; i < eligibleForRemainders.length; i++) {
    const candidacy = eligibleForRemainders[i];
    candidacy.remainderRank = i + 1;

    if (i < seatsRemaining) {
      additionalSeatMap.set(candidacy.id, true);
      totalRemainderSeats += 1;
    } else {
      additionalSeatMap.set(candidacy.id, false);
    }
  }

  // 8. Lista final consolidada
  const finalCandidacies: CandidacyCalculation[] = withDirectSeats.map((c) => {
    const gotAdditional = additionalSeatMap.get(c.id) || false;
    const totalSeats = c.directSeats + (gotAdditional ? 1 : 0);
    const sortedEntry = eligibleForRemainders.find((e) => e.id === c.id);

    return {
      ...c,
      additionalSeat: gotAdditional,
      totalSeats,
      remainderRank: sortedEntry ? sortedEntry.remainderRank : 999,
    };
  });

  const totalSeatsCovered = totalDirectSeats + totalRemainderSeats;
  const qualifiedCandidacies = finalCandidacies.filter((c) => c.passesThreshold);
  const excludedCandidacies = finalCandidacies.filter((c) => !c.passesThreshold);

  return {
    totalBallots,
    validVotes,
    candidaciesVotes,
    blankVotes: totalBlankVotes,
    nullVotes: totalNullVotes,
    totalCensus,
    turnoutPercentage,
    thresholdPercent,
    thresholdVotesNeeded,
    quotient,
    totalDirectSeats,
    totalRemainderSeats,
    totalSeatsCovered,
    targetSeats,
    seatsRemaining,
    candidacies: finalCandidacies,
    qualifiedCandidacies,
    excludedCandidacies,
    hasTieInRemainders,
    tieDetails,
    mesas: mesasSummaries,
  };
}

/**
 * Colección de sindicatos habituales del sector sanitario de Sanidad GVA
 */
export const DEFAULT_UNIONS: Omit<Candidacy, 'id'>[] = [
  {
    name: 'Intersindical Valenciana / Intersindical Salut',
    acronym: 'INTERSINDICAL',
    color: '#008744',
  },
  {
    name: 'Comisiones Obreras de Sanidad',
    acronym: 'CCOO',
    color: '#dc2626',
  },
  {
    name: 'Sindicato de Enfermería SATSE',
    acronym: 'SATSE',
    color: '#0284c7',
  },
  {
    name: 'Central Sindical Independiente y de Funcionarios',
    acronym: 'CSIF',
    color: '#15803d',
  },
  {
    name: 'Unión General de Trabajadoras y Trabajadores',
    acronym: 'UGT',
    color: '#b91c1c',
  },
  {
    name: 'USAE - Técnicos en Cuidados Auxiliares de Enfermería',
    acronym: 'USAE',
    color: '#9333ea',
  },
  {
    name: 'SIMAP - Sindicato de Médicos de Asistencia Pública',
    acronym: 'SIMAP',
    color: '#d97706',
  },
  {
    name: 'Candidatura Independiente',
    acronym: 'INDEP',
    color: '#64748b',
  },
];
