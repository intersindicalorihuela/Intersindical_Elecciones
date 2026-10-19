/**
 * @license
 * Intersindical Salut Orihuela - Exportación oficial a Excel (.xlsx) por Mesas Electorales
 */

import * as XLSX from 'xlsx';
import { CalculationResult, ElectionConfig, PollingMesa } from '../types';

export function exportElectionToExcel(
  result: CalculationResult,
  config: ElectionConfig,
  mesas: PollingMesa[]
): void {
  const wb = XLSX.utils.book_new();

  const rows: (string | number)[][] = [
    ['INTERSINDICAL VALENCIANA · INTERSINDICAL SALUT ORIHUELA'],
    ['ACTA OFICIAL DE ESCRUTINIO POR MESAS ELECTORALES Y ATRIBUCIÓN DE REPRESENTANTES'],
    ['Sistema de Cociente Electoral y Mayores Restos (Art. 71.2 Estatuto de los Trabajadores)'],
    [],
    ['DATOS DE LA CONVOCATORIA ELECTORAL'],
    ['Departamento de Salud / Ámbito:', config.department || 'Sanitat GVA'],
    ['Órgano a Constituir (≥ 50 trabajadores):', config.organType],
    ['Centro Principal:', config.workCenter || 'No especificado'],
    ['Fecha de Votación:', config.date || new Date().toISOString().slice(0, 10)],
    ['Censo Total Acumulado (Electores):', result.totalCensus],
    ['Puestos a Cubrir (Representantes):', config.seats],
    ['Número de Mesas Electorales:', mesas.length],
    [],
    ['RESUMEN DE PARTICIPACIÓN POR MESAS ELECTORALES'],
    [
      'Mesa Electoral',
      'Censo',
      'Votos a Candidaturas',
      'Votos en Blanco',
      'TOTAL VOTOS VÁLIDOS',
      'Votos Nulos',
      'TOTAL EMITIDOS',
      '% Participación',
    ],
  ];

  // Filas del resumen de cada mesa
  result.mesas.forEach((m) => {
    rows.push([
      m.name,
      m.census,
      m.candidaciesVotes,
      m.blankVotes,
      m.validVotes,
      m.nullVotes,
      m.totalBallots,
      `${m.turnoutPercentage.toFixed(2)}%`,
    ]);
  });

  // Fila de resumen total
  rows.push([
    'TOTAL DEPARTAMENTO',
    result.totalCensus,
    result.candidaciesVotes,
    result.blankVotes,
    result.validVotes,
    result.nullVotes,
    result.totalBallots,
    `${result.turnoutPercentage.toFixed(2)}%`,
  ]);

  rows.push([]);
  rows.push(['DATOS LEGALES DE REPARTO']);
  rows.push(['Umbral Legal de Exclusión (5% de válidos):', result.thresholdVotesNeeded]);
  rows.push(['Cociente Electoral (Válidos / Puestos):', Number(result.quotient.toFixed(4))]);
  rows.push([]);

  // Cabecera de la tabla de escrutinio detallada
  rows.push(['TABLA OFICIAL DE ESCRUTINIO Y ATRIBUCIÓN DE REPRESENTANTES']);
  const scrutinyHead: (string | number)[] = [
    'Siglas',
    'Candidatura / Sindicato',
    ...mesas.map((m) => m.name),
    'TOTAL VOTOS',
    '% Válidos',
    '¿Supera 5%?',
    'Puestos Directos',
    'Resto',
    'Ranking Resto',
    'Puesto Mayor Resto',
    'TOTAL DELEGADOS',
  ];
  rows.push(scrutinyHead);

  // Filas de candidaturas
  result.candidacies.forEach((c) => {
    rows.push([
      c.acronym,
      c.name,
      ...mesas.map((m) => c.votesByMesa[m.id] || 0),
      c.votes,
      Number(c.percentageOfValid.toFixed(2)),
      c.passesThreshold ? 'SÍ (Accede a reparto)' : 'NO (Excluida <5%)',
      c.directSeats,
      c.passesThreshold ? Number(c.remainder.toFixed(3)) : '-',
      c.passesThreshold ? c.remainderRank : '-',
      c.additionalSeat ? 1 : 0,
      c.totalSeats,
    ]);
  });

  // Fila Blanco
  rows.push([
    'BLANCO',
    'Votos en Blanco (válidos computables por Ley)',
    ...mesas.map((m) => m.blankVotes),
    result.blankVotes,
    Number((result.validVotes > 0 ? (result.blankVotes / result.validVotes) * 100 : 0).toFixed(2)),
    '-',
    '-',
    '-',
    '-',
    '-',
    '-',
  ]);

  // Fila Nulo
  rows.push([
    'NULO',
    'Votos Nulos (no válidos)',
    ...mesas.map((m) => m.nullVotes),
    result.nullVotes,
    '-',
    '-',
    '-',
    '-',
    '-',
    '-',
    '-',
  ]);

  // Fila TOTALES
  rows.push([
    'TOTAL VÁLIDOS',
    'Total Candidaturas + Blanco',
    ...result.mesas.map((m) => m.validVotes),
    result.validVotes,
    100.0,
    '-',
    result.totalDirectSeats,
    '-',
    '-',
    result.totalRemainderSeats,
    result.totalSeatsCovered,
  ]);

  rows.push([]);
  rows.push(['FUNDAMENTACIÓN JURÍDICA:']);
  rows.push(['1. Art. 71.2 del Estatuto de los Trabajadores (RDL 2/2015):']);
  rows.push(['   "No tendrán derecho a la atribución de representantes aquellas listas que no hayan obtenido, como mínimo, el 5 por 100 de los votos válidos emitidos".']);
  rows.push(['   "Se atribuirá a cada lista el número de puestos que le corresponda, de conformidad con el cociente que resulte de dividir el número de votos válidos por el de puestos a cubrir."']);
  rows.push(['   "Si quedasen puestos sobrantes se atribuirán a las listas que tengan un mayor resto de votos."']);
  rows.push(['2. Votos en Blanco: Conforme a doctrina unificada del Tribunal Supremo, integran los votos válidos a efectos del umbral y cociente.']);
  rows.push(['3. Criterio de desempate en restos: Se atribuye a la candidatura que posea mayor número absoluto de votos en la votación general.']);
  rows.push(['4. Censo mínimo: En el ámbito de Sanidad GVA no se constituyen órganos de representación para censos inferiores a 50 trabajadores.']);

  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Ancho de columnas adaptativo
  const cols = [
    { wch: 16 }, // Siglas
    { wch: 42 }, // Nombre
  ];
  mesas.forEach(() => {
    cols.push({ wch: 20 });
  });
  cols.push(
    { wch: 16 }, // Total votos
    { wch: 14 }, // % válidos
    { wch: 22 }, // Umbral
    { wch: 18 }, // Directos
    { wch: 14 }, // Resto
    { wch: 14 }, // Ranking
    { wch: 20 }, // Mayor resto
    { wch: 18 }  // Total delegados
  );
  ws['!cols'] = cols;

  XLSX.utils.book_append_sheet(wb, ws, 'Escrutinio por Mesas');

  const safeFilename = `Escrutinio_Mesas_${config.department ? config.department.replace(/[^a-zA-Z0-9]/g, '_') : 'Elecciones'}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, safeFilename);
}
