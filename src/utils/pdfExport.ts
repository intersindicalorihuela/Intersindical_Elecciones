/**
 * @license
 * Intersindical Salut Orihuela - Exportación oficial a PDF de Acta de Escrutinio por Mesas
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CalculationResult, ElectionConfig, PollingMesa } from '../types';

export function exportElectionToPDF(
  result: CalculationResult,
  config: ElectionConfig,
  mesas: PollingMesa[]
): void {
  const doc = new jsPDF({
    orientation: 'landscape', // Horizontal para albergar cómodamente las columnas de mesas
    unit: 'mm',
    format: 'a4',
  });

  const primaryRed: [number, number, number] = [187, 43, 9];      // #BB2B09
  const darkRed: [number, number, number] = [138, 32, 7];        // #8A2007
  const forestGreen: [number, number, number] = [47, 107, 79];    // #2F6B4F
  const textDark: [number, number, number] = [29, 27, 26];       // #1D1B1A
  const textMuted: [number, number, number] = [92, 84, 79];      // #5C544F

  const pageWidth = doc.internal.pageSize.getWidth();

  // 1. Cabecera Institucional Intersindical Salut
  doc.setFillColor(...primaryRed);
  doc.rect(0, 0, pageWidth, 22, 'F');

  // Franja dorada de la señera
  doc.setFillColor(245, 158, 11);
  doc.rect(0, 22, pageWidth, 2, 'F');

  // Textos de cabecera
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('INTERSINDICAL SALUT · SECCIÓ SINDICAL DEPARTAMENT DE SALUT ORIHUELA', 14, 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('ACTA OFICIAL DE ESCRUTINIO POR MESAS ELECTORALES Y ATRIBUCIÓN DE REPRESENTANTES SINDICALES', 14, 15);
  doc.setFontSize(7.5);
  doc.text('Sistema de Cociente Electoral y Mayores Restos · Art. 71.2 del Estatuto de los Trabajadores y Art. 39 EBEP', 14, 19.5);

  const exportDate = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  doc.text(`Generado: ${exportDate}`, pageWidth - 14, 15, { align: 'right' });

  let yPos = 29;

  // 2. Ficha de Convocatoria Electoral
  doc.setFillColor(246, 242, 236);
  doc.setDrawColor(227, 217, 207);
  doc.roundedRect(14, yPos, pageWidth - 28, 18, 1.5, 1.5, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkRed);
  doc.text('Departamento de Salud:', 18, yPos + 5);
  doc.text('Órgano a Constituir:', 18, yPos + 10);
  doc.text('Centro de Referencia:', 18, yPos + 15);

  doc.text('Fecha Votación:', 110, yPos + 5);
  doc.text('Censo Total Acumulado:', 110, yPos + 10);
  doc.text('Mesas Electorales:', 110, yPos + 15);

  doc.text('Puestos a Cubrir:', 200, yPos + 5);
  doc.text('Votos Válidos Totales:', 200, yPos + 10);
  doc.text('Cociente Electoral:', 200, yPos + 15);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textDark);
  doc.text(config.department || 'Departamento de Salud de Orihuela', 55, yPos + 5);
  doc.text(config.organType, 55, yPos + 10);
  doc.text(config.workCenter || 'Hospital Vega Baja', 55, yPos + 15);

  doc.text(config.date || 'Sin fecha', 150, yPos + 5);
  doc.text(`${result.totalCensus.toLocaleString('es-ES')} electores/as`, 150, yPos + 10);
  doc.text(`${mesas.length} mesas constituidas`, 150, yPos + 15);

  doc.setFont('helvetica', 'bold');
  doc.text(`${config.seats} representantes`, 238, yPos + 5);
  doc.text(`${result.validVotes.toLocaleString('es-ES')} votos`, 238, yPos + 10);
  doc.text(`${result.quotient.toFixed(4)}`, 238, yPos + 15);

  yPos += 23;

  // 3. Tabla Principal de Escrutinio por Mesas y Asignación
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...darkRed);
  doc.text('RECUENTO GENERAL POR MESAS ELECTORALES Y ATRIBUCIÓN DE REPRESENTANTES SINDICALES', 14, yPos);

  yPos += 3;

  // Construir columnas dinámicas para las mesas
  const tableHead = [
    [
      'Siglas',
      'Candidatura / Sindicato',
      ...mesas.map((m) => `${m.name.length > 20 ? m.name.substring(0, 18) + '...' : m.name}`),
      'TOTAL VOTOS',
      '% VÁLIDOS',
      'UMBRAL (≥5%)',
      'DIRECTOS',
      'RESTO',
      'MAYOR RESTO',
      'DELEGADOS',
    ],
  ];

  const tableBody = result.candidacies.map((c) => {
    return [
      c.acronym,
      c.name,
      ...mesas.map((m) => (c.votesByMesa[m.id] || 0).toLocaleString('es-ES')),
      c.votes.toLocaleString('es-ES'),
      `${c.percentageOfValid.toFixed(2)}%`,
      c.passesThreshold ? 'SUPERA 5%' : 'EXCLUIDA',
      c.passesThreshold ? c.directSeats.toString() : '-',
      c.passesThreshold ? c.remainder.toFixed(3) : '-',
      c.additionalSeat ? `+1 (#${c.remainderRank})` : '-',
      c.totalSeats.toString(),
    ];
  });

  // Fila Votos en Blanco
  tableBody.push([
    'BLANCO',
    'Votos en Blanco (válidos computables por Ley)',
    ...mesas.map((m) => m.blankVotes.toLocaleString('es-ES')),
    result.blankVotes.toLocaleString('es-ES'),
    `${result.validVotes > 0 ? ((result.blankVotes / result.validVotes) * 100).toFixed(2) : 0}%`,
    '-',
    '-',
    '-',
    '-',
    '-',
  ]);

  // Fila Votos Nulos
  tableBody.push([
    'NULO',
    'Votos Nulos (no válidos, no computan en reparto)',
    ...mesas.map((m) => m.nullVotes.toLocaleString('es-ES')),
    result.nullVotes.toLocaleString('es-ES'),
    '-',
    '-',
    '-',
    '-',
    '-',
    '-',
  ]);

  // Fila TOTALES
  tableBody.push([
    'TOTAL VÁLIDOS',
    'Base Legal de Reparto (Candidaturas + Blanco)',
    ...result.mesas.map((m) => m.validVotes.toLocaleString('es-ES')),
    result.validVotes.toLocaleString('es-ES'),
    '100.00%',
    `${result.qualifiedCandidacies.length} aptas`,
    result.totalDirectSeats.toString(),
    '-',
    result.totalRemainderSeats.toString(),
    result.totalSeatsCovered.toString(),
  ]);

  // Fila TOTAL EMITIDOS
  tableBody.push([
    'TOTAL EMITIDOS',
    'Votos Totales en Urna (Válidos + Nulos)',
    ...result.mesas.map((m) => m.totalBallots.toLocaleString('es-ES')),
    result.totalBallots.toLocaleString('es-ES'),
    `${result.turnoutPercentage.toFixed(1)}% part.`,
    '-',
    '-',
    '-',
    '-',
    '-',
  ]);

  // Fila CENSO
  tableBody.push([
    'CENSO MESA',
    'Electores Censados por Mesa',
    ...mesas.map((m) => m.census.toLocaleString('es-ES')),
    result.totalCensus.toLocaleString('es-ES'),
    '100%',
    '-',
    '-',
    '-',
    '-',
    '-',
  ]);

  autoTable(doc, {
    startY: yPos,
    head: tableHead,
    body: tableBody,
    theme: 'grid',
    headStyles: {
      fillColor: darkRed,
      textColor: [255, 255, 255],
      fontSize: 7,
      fontStyle: 'bold',
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 6.8,
      textColor: textDark,
    },
    didParseCell: (data) => {
      // Filas de totales destacadas
      if (
        data.row.index >= tableBody.length - 3
      ) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [246, 242, 236];
      }
      // Fila de TOTAL VÁLIDOS
      if (data.row.index === tableBody.length - 3) {
        data.cell.styles.fillColor = [251, 234, 228];
        data.cell.styles.textColor = darkRed;
      }
      // Columna de delegados
      if (data.column.index === data.table.columns.length - 1 && data.row.index < result.candidacies.length) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.textColor = primaryRed;
        data.cell.styles.fontSize = 7.5;
        data.cell.styles.halign = 'center';
      }
    },
    margin: { left: 14, right: 14 },
  });

  // @ts-ignore
  yPos = doc.lastAutoTable.finalY + 6;

  // Si queda poco espacio, añadir página
  if (yPos > 165) {
    doc.addPage();
    yPos = 16;
  }

  // 4. Fundamentación Jurídica
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...darkRed);
  doc.text('FUNDAMENTACIÓN JURÍDICA (ART. 71.2 ET Y ART. 39 EBEP):', 14, yPos);
  yPos += 3.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(...textMuted);
  const legalNotes = [
    '1. Votos Válidos: Conforme al Art. 71.2 del Estatuto de los Trabajadores y doctrina jurisprudencial unificada del Tribunal Supremo, integran los votos válidos tanto los votos a candidaturas como los votos en blanco.',
    '2. Umbral de Exclusión del 5%: No tienen derecho a la atribución de representantes aquellas listas que no alcancen, como mínimo, el 5 por 100 de los votos válidos computados.',
    '3. Atribución por Cociente y Restos: Se atribuye a cada lista el número de puestos que le corresponda según el cociente (votos válidos ÷ puestos a cubrir). Los puestos sobrantes se adjudican a las listas con mayor resto de votos.',
    '4. Censo mínimo: No se constituyen órganos de representación (Junta de Personal / Comité de Empresa) para censos de trabajadores inferiores a 50.',
  ];
  legalNotes.forEach((n) => {
    doc.text(n, 14, yPos);
    yPos += 3;
  });

  yPos += 4;

  // 5. Diligencia de Firmas de las Mesas
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...textDark);
  doc.text('DILIGENCIA DE CONFORMIDAD Y FIRMAS DE LAS MESAS ELECTORALES:', 14, yPos);
  yPos += 3.5;

  const boxWidth = (pageWidth - 28 - 9) / 4;
  const boxHeight = 18;
  const signers = [
    'Presidente/a Mesa Central',
    'Secretario/a Mesa Central',
    'Interventor/a Intersindical Salut',
    'Interventores Sindicales',
  ];

  signers.forEach((s, idx) => {
    const x = 14 + idx * (boxWidth + 3);
    doc.setDrawColor(200, 190, 180);
    doc.rect(x, yPos, boxWidth, boxHeight);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...textMuted);
    doc.text(s, x + boxWidth / 2, yPos + 3.5, { align: 'center' });
    doc.text('Firma y DNI:', x + 2, yPos + boxHeight - 2);
  });

  // Numeración de páginas
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(6.5);
    doc.setTextColor(150, 140, 130);
    doc.text(
      `Intersindical Salut Orihuela | Acta Oficial de Escrutinio por Mesas Electorales | Página ${i} de ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 4,
      { align: 'center' }
    );
  }

  const safeFilename = `Acta_Escrutinio_Mesas_${config.department ? config.department.replace(/[^a-zA-Z0-9]/g, '_') : 'Elecciones'}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(safeFilename);
}
