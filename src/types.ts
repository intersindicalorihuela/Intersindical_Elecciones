/**
 * @license
 * Intersindical Salut Orihuela - Sistema de Escrutinio Electoral por Mesas
 * Proporcionalidad por cociente electoral y mayores restos (Art. 71.2 Estatuto de los Trabajadores)
 */

export interface Candidacy {
  id: string;
  name: string;
  acronym: string;
  color: string;
}

export interface PollingMesa {
  id: string;
  number: number;
  name: string; // Ej: "Mesa 1 - Hospital Vega Baja (Especializada)"
  location?: string;
  census: number; // Censo de electores de esta mesa
  votesByCandidacy: Record<string, number>; // candidaturaId -> votos
  blankVotes: number; // Votos en blanco en esta mesa
  nullVotes: number; // Votos nulos en esta mesa
}

export interface ElectionConfig {
  title: string;
  organType: 'Junta de Personal' | 'Comité de Empresa'; // Solo >= 50 trabajadores
  workCenter: string;
  department: string;
  location: string;
  date: string;
  seats: number;
  thresholdPercent: number; // 5% por defecto legal
  quotientFormula: 'all_valid' | 'threshold_only';
  notes: string;
}

export interface CandidacyCalculation {
  id: string;
  name: string;
  acronym: string;
  votes: number; // Total votos consolidados en todas las mesas
  votesByMesa: Record<string, number>; // Desglose mesa a mesa
  percentageOfValid: number;
  percentageOfTurnout: number;
  passesThreshold: boolean;
  directSeats: number;
  remainder: number;
  remainderRank: number;
  additionalSeat: boolean;
  totalSeats: number;
  color: string;
}

export interface MesaSummary {
  id: string;
  number: number;
  name: string;
  census: number;
  candidaciesVotes: number;
  blankVotes: number;
  nullVotes: number;
  validVotes: number;
  totalBallots: number;
  turnoutPercentage: number;
  votesByCandidacy: Record<string, number>;
}

export interface CalculationResult {
  totalBallots: number; // Total votos emitidos en todas las mesas
  validVotes: number;   // Total votos válidos = candidaturas + blancos
  candidaciesVotes: number;
  blankVotes: number;
  nullVotes: number;
  totalCensus: number;
  turnoutPercentage: number;
  thresholdPercent: number;
  thresholdVotesNeeded: number; // Mínimo de votos válidos para superar el 5%
  quotient: number;
  totalDirectSeats: number;
  totalRemainderSeats: number;
  totalSeatsCovered: number;
  targetSeats: number;
  seatsRemaining: number;
  candidacies: CandidacyCalculation[];
  qualifiedCandidacies: CandidacyCalculation[];
  excludedCandidacies: CandidacyCalculation[];
  hasTieInRemainders: boolean;
  tieDetails: string[];
  mesas: MesaSummary[];
}
