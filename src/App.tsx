/**
 * @license
 * Intersindical Salut Orihuela - Sistema Oficial de Escrutinio por Mesas Electorales
 * Reparto proporcional por cociente electoral y mayores restos (Art. 71.2 Estatuto de los Trabajadores)
 */

import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { ConfigPanel } from './components/ConfigPanel';
import { MesasScrutinyManager } from './components/MesasScrutinyManager';
import { CandidaciesEditor } from './components/CandidaciesEditor';
import { ResultsDisplay } from './components/ResultsDisplay';
import { LegalInfoModal } from './components/LegalInfoModal';
import { Candidacy, PollingMesa, ElectionConfig, CalculationResult } from './types';
import { calculateMesaElectionResults, getRecommendedSeats } from './utils/calculator';
import { exportElectionToPDF } from './utils/pdfExport';
import { exportElectionToExcel } from './utils/excelExport';

export default function App() {
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);

  // Configuración general de la convocatoria
  const [config, setConfig] = useState<ElectionConfig>({
    title: 'Elecciones a Junta de Personal · Departamento de Salud de Orihuela',
    organType: 'Junta de Personal',
    workCenter: 'Hospital Vega Baja y Centros de Salud',
    department: 'Departamento de Salud de Orihuela (Sanitat GVA)',
    location: 'Orihuela (Alicante)',
    date: new Date().toISOString().slice(0, 10),
    seats: 23,
    thresholdPercent: 5,
    quotientFormula: 'all_valid',
    notes: 'Escrutinio por mesas electorales conforme al Art. 71.2 del Estatuto de los Trabajadores.',
  });

  // Lista de candidaturas proclamadas
  const [candidacies, setCandidacies] = useState<Candidacy[]>([
    {
      id: 'cand-iv',
      name: 'Intersindical Valenciana / Intersindical Salut',
      acronym: 'INTERSINDICAL',
      color: '#008744',
    },
    {
      id: 'cand-ccoo',
      name: 'Comisiones Obreras de Sanidad',
      acronym: 'CCOO',
      color: '#dc2626',
    },
    {
      id: 'cand-satse',
      name: 'Sindicato de Enfermería SATSE',
      acronym: 'SATSE',
      color: '#0284c7',
    },
    {
      id: 'cand-csif',
      name: 'Central Sindical Independiente y de Funcionarios',
      acronym: 'CSIF',
      color: '#15803d',
    },
    {
      id: 'cand-ugt',
      name: 'Unión General de Trabajadoras y Trabajadores',
      acronym: 'UGT',
      color: '#b91c1c',
    },
    {
      id: 'cand-usae',
      name: 'USAE - Técnicos en Cuidados Auxiliares de Enfermería',
      acronym: 'USAE',
      color: '#9333ea',
    },
    {
      id: 'cand-simap',
      name: 'SIMAP - Sindicato de Médicos de Asistencia Pública',
      acronym: 'SIMAP',
      color: '#d97706',
    },
    {
      id: 'cand-indep',
      name: 'Candidatura Independiente',
      acronym: 'INDEP',
      color: '#64748b',
    },
  ]);

  // Lista de mesas electorales del departamento (típicamente entre 2 y 5 mesas)
  const [mesas, setMesas] = useState<PollingMesa[]>([
    {
      id: 'mesa-1',
      number: 1,
      name: 'Mesa 1 - Hospital Vega Baja (Especializada)',
      location: 'Hospital Vega Baja',
      census: 920,
      blankVotes: 8,
      nullVotes: 3,
      votesByCandidacy: {
        'cand-iv': 220,
        'cand-ccoo': 175,
        'cand-satse': 165,
        'cand-csif': 120,
        'cand-ugt': 90,
        'cand-usae': 70,
        'cand-simap': 55,
        'cand-indep': 22,
      },
    },
    {
      id: 'mesa-2',
      number: 2,
      name: 'Mesa 2 - C.S. Orihuela y Atención Primaria Sur',
      location: 'C.S. Orihuela Álvarez de la Sota',
      census: 480,
      blankVotes: 4,
      nullVotes: 2,
      votesByCandidacy: {
        'cand-iv': 115,
        'cand-ccoo': 95,
        'cand-satse': 80,
        'cand-csif': 68,
        'cand-ugt': 52,
        'cand-usae': 30,
        'cand-simap': 24,
        'cand-indep': 14,
      },
    },
    {
      id: 'mesa-3',
      number: 3,
      name: 'Mesa 3 - C.S. Callosa de Segura y Almoradí',
      location: 'C.S. Callosa de Segura',
      census: 420,
      blankVotes: 2,
      nullVotes: 1,
      votesByCandidacy: {
        'cand-iv': 90,
        'cand-ccoo': 80,
        'cand-satse': 65,
        'cand-csif': 57,
        'cand-ugt': 43,
        'cand-usae': 20,
        'cand-simap': 16,
        'cand-indep': 9,
      },
    },
  ]);

  // Cálculo en tiempo real del escrutinio en todas las mesas
  const calculationResult: CalculationResult = useMemo(() => {
    return calculateMesaElectionResults(candidacies, mesas, config);
  }, [candidacies, mesas, config]);

  // Actualizar configuración
  const handleConfigChange = (updated: Partial<ElectionConfig>) => {
    setConfig((prev) => ({ ...prev, ...updated }));
  };

  // Añadir una nueva mesa electoral
  const handleAddMesa = () => {
    const nextNum = mesas.length + 1;
    const newMesa: PollingMesa = {
      id: `mesa-${Date.now()}`,
      number: nextNum,
      name: `Mesa ${nextNum} - Centro de Salud / Zona Básica`,
      census: 300,
      blankVotes: 0,
      nullVotes: 0,
      votesByCandidacy: {},
    };
    setMesas([...mesas, newMesa]);
  };

  // Eliminar última mesa o mesa por id (mínimo 2 mesas)
  const handleRemoveLastMesa = () => {
    if (mesas.length <= 2) return;
    setMesas(mesas.slice(0, mesas.length - 1));
  };

  const handleRemoveMesaById = (id: string) => {
    if (mesas.length <= 2) return;
    setMesas(mesas.filter((m) => m.id !== id));
  };

  // Fijar número exacto de mesas (2 a 5)
  const handleSetMesasCount = (count: number) => {
    const validCount = Math.max(2, Math.min(count, 7));
    if (validCount === mesas.length) return;

    if (validCount > mesas.length) {
      const added: PollingMesa[] = [];
      for (let i = mesas.length + 1; i <= validCount; i++) {
        added.push({
          id: `mesa-${Date.now()}-${i}`,
          number: i,
          name: `Mesa ${i} - Zona de Salud ${i}`,
          census: 300,
          blankVotes: 0,
          nullVotes: 0,
          votesByCandidacy: {},
        });
      }
      setMesas([...mesas, ...added]);
    } else {
      setMesas(mesas.slice(0, validCount));
    }
  };

  // Gestión de candidaturas
  const handleAddCandidacy = (candidacy: Candidacy) => {
    setCandidacies([...candidacies, candidacy]);
  };

  const handleUpdateCandidacy = (
    id: string,
    field: keyof Candidacy,
    value: string
  ) => {
    setCandidacies(
      candidacies.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleRemoveCandidacy = (id: string) => {
    setCandidacies(candidacies.filter((c) => c.id !== id));
  };

  // Cargar plantillas de Departamentos de Salud de Sanidad GVA
  const handleLoadPreset = (presetKey: string) => {
    if (presetKey === 'orihuela_3') {
      setConfig({
        title: 'Elecciones a Junta de Personal · Departamento de Salud de Orihuela',
        organType: 'Junta de Personal',
        workCenter: 'Hospital Vega Baja y Centros de Salud',
        department: 'Departamento de Salud de Orihuela (Sanitat GVA)',
        location: 'Orihuela (Alicante)',
        date: new Date().toISOString().slice(0, 10),
        seats: 23,
        thresholdPercent: 5,
        quotientFormula: 'all_valid',
        notes: 'Escrutinio oficial en 3 mesas electorales conforme al Art. 71.2 ET.',
      });
      setMesas([
        {
          id: 'm1',
          number: 1,
          name: 'Mesa 1 - Hospital Vega Baja (Especializada)',
          census: 920,
          blankVotes: 8,
          nullVotes: 3,
          votesByCandidacy: {
            'cand-iv': 220,
            'cand-ccoo': 175,
            'cand-satse': 165,
            'cand-csif': 120,
            'cand-ugt': 90,
            'cand-usae': 70,
            'cand-simap': 55,
            'cand-indep': 22,
          },
        },
        {
          id: 'm2',
          number: 2,
          name: 'Mesa 2 - C.S. Orihuela y Primaria Sur',
          census: 480,
          blankVotes: 4,
          nullVotes: 2,
          votesByCandidacy: {
            'cand-iv': 115,
            'cand-ccoo': 95,
            'cand-satse': 80,
            'cand-csif': 68,
            'cand-ugt': 52,
            'cand-usae': 30,
            'cand-simap': 24,
            'cand-indep': 14,
          },
        },
        {
          id: 'm3',
          number: 3,
          name: 'Mesa 3 - C.S. Callosa de Segura y Almoradí',
          census: 420,
          blankVotes: 2,
          nullVotes: 1,
          votesByCandidacy: {
            'cand-iv': 90,
            'cand-ccoo': 80,
            'cand-satse': 65,
            'cand-csif': 57,
            'cand-ugt': 43,
            'cand-usae': 20,
            'cand-simap': 16,
            'cand-indep': 9,
          },
        },
      ]);
    } else if (presetKey === 'torrevieja_3') {
      setConfig({
        title: 'Elecciones a Junta de Personal · Departamento de Salud de Torrevieja',
        organType: 'Junta de Personal',
        workCenter: 'Hospital Universitario de Torrevieja',
        department: 'Departamento de Salud de Torrevieja (Sanitat GVA)',
        location: 'Torrevieja (Alicante)',
        date: new Date().toISOString().slice(0, 10),
        seats: 21,
        thresholdPercent: 5,
        quotientFormula: 'all_valid',
        notes: 'Escrutinio oficial en 3 mesas electorales.',
      });
      setMesas([
        {
          id: 'm-torre-1',
          number: 1,
          name: 'Mesa 1 - Hospital Universitario de Torrevieja',
          census: 540,
          blankVotes: 6,
          nullVotes: 2,
          votesByCandidacy: {
            'cand-iv': 140,
            'cand-ccoo': 110,
            'cand-satse': 95,
            'cand-csif': 75,
            'cand-ugt': 50,
            'cand-usae': 35,
            'cand-simap': 25,
            'cand-indep': 10,
          },
        },
        {
          id: 'm-torre-2',
          number: 2,
          name: 'Mesa 2 - C.S. La Loma y C.S. Acequión',
          census: 240,
          blankVotes: 3,
          nullVotes: 1,
          votesByCandidacy: {
            'cand-iv': 65,
            'cand-ccoo': 50,
            'cand-satse': 42,
            'cand-csif': 35,
            'cand-ugt': 20,
            'cand-usae': 15,
            'cand-simap': 12,
            'cand-indep': 5,
          },
        },
        {
          id: 'm-torre-3',
          number: 3,
          name: 'Mesa 3 - C.S. Rojales, Guardamar y Pilar de la Horadada',
          census: 210,
          blankVotes: 2,
          nullVotes: 1,
          votesByCandidacy: {
            'cand-iv': 55,
            'cand-ccoo': 45,
            'cand-satse': 38,
            'cand-csif': 30,
            'cand-ugt': 18,
            'cand-usae': 12,
            'cand-simap': 10,
            'cand-indep': 4,
          },
        },
      ]);
    } else if (presetKey === 'elche_4') {
      setConfig({
        title: 'Elecciones a Junta de Personal · Departamento Elche General',
        organType: 'Junta de Personal',
        workCenter: 'Hospital General Universitario de Elche',
        department: 'Departamento de Salud Elche - General (Sanitat GVA)',
        location: 'Elche (Alicante)',
        date: new Date().toISOString().slice(0, 10),
        seats: 23,
        thresholdPercent: 5,
        quotientFormula: 'all_valid',
        notes: '',
      });
      setMesas([
        {
          id: 'm-elche-1',
          number: 1,
          name: 'Mesa 1 - Hospital General Universitario',
          census: 850,
          blankVotes: 8,
          nullVotes: 3,
          votesByCandidacy: {
            'cand-iv': 210,
            'cand-ccoo': 165,
            'cand-satse': 150,
            'cand-csif': 115,
            'cand-ugt': 85,
            'cand-usae': 60,
            'cand-simap': 45,
            'cand-indep': 18,
          },
        },
        {
          id: 'm-elche-2',
          number: 2,
          name: 'Mesa 2 - C.S. Elche Centro y Raval',
          census: 380,
          blankVotes: 4,
          nullVotes: 2,
          votesByCandidacy: {
            'cand-iv': 95,
            'cand-ccoo': 75,
            'cand-satse': 68,
            'cand-csif': 52,
            'cand-ugt': 38,
            'cand-usae': 25,
            'cand-simap': 18,
            'cand-indep': 8,
          },
        },
        {
          id: 'm-elche-3',
          number: 3,
          name: 'Mesa 3 - C.S. Santa Pola',
          census: 290,
          blankVotes: 3,
          nullVotes: 1,
          votesByCandidacy: {
            'cand-iv': 72,
            'cand-ccoo': 58,
            'cand-satse': 50,
            'cand-csif': 40,
            'cand-ugt': 30,
            'cand-usae': 20,
            'cand-simap': 14,
            'cand-indep': 6,
          },
        },
        {
          id: 'm-elche-4',
          number: 4,
          name: 'Mesa 4 - C.S. Crevillent',
          census: 260,
          blankVotes: 2,
          nullVotes: 1,
          votesByCandidacy: {
            'cand-iv': 65,
            'cand-ccoo': 52,
            'cand-satse': 45,
            'cand-csif': 35,
            'cand-ugt': 25,
            'cand-usae': 18,
            'cand-simap': 12,
            'cand-indep': 5,
          },
        },
      ]);
    } else if (presetKey === 'alcoi_2') {
      setConfig({
        title: 'Elecciones a Junta de Personal · Departamento de Salud de Alcoi',
        organType: 'Junta de Personal',
        workCenter: 'Hospital Virgen de los Lirios de Alcoi',
        department: 'Departamento de Salud de Alcoi (Sanitat GVA)',
        location: 'Alcoi (Alicante)',
        date: new Date().toISOString().slice(0, 10),
        seats: 17,
        thresholdPercent: 5,
        quotientFormula: 'all_valid',
        notes: '',
      });
      setMesas([
        {
          id: 'm-alcoi-1',
          number: 1,
          name: 'Mesa 1 - Hospital Virgen de los Lirios',
          census: 450,
          blankVotes: 5,
          nullVotes: 2,
          votesByCandidacy: {
            'cand-iv': 120,
            'cand-ccoo': 85,
            'cand-satse': 78,
            'cand-csif': 55,
            'cand-ugt': 40,
            'cand-usae': 25,
            'cand-simap': 20,
            'cand-indep': 8,
          },
        },
        {
          id: 'm-alcoi-2',
          number: 2,
          name: 'Mesa 2 - Centros de Salud Comarcales',
          census: 270,
          blankVotes: 3,
          nullVotes: 1,
          votesByCandidacy: {
            'cand-iv': 70,
            'cand-ccoo': 50,
            'cand-satse': 45,
            'cand-csif': 35,
            'cand-ugt': 25,
            'cand-usae': 16,
            'cand-simap': 12,
            'cand-indep': 5,
          },
        },
      ]);
    } else if (presetKey === 'alicante_5') {
      setConfig({
        title: "Elecciones a Junta de Personal · Dpto. Sant Joan d'Alacant",
        organType: 'Junta de Personal',
        workCenter: 'Hospital Universitario San Juan de Alicante',
        department: "Departamento de Salud Alacant - Sant Joan (Sanitat GVA)",
        location: 'Sant Joan / Alacant',
        date: new Date().toISOString().slice(0, 10),
        seats: 23,
        thresholdPercent: 5,
        quotientFormula: 'all_valid',
        notes: '',
      });
      setMesas([
        {
          id: 'm-sj-1',
          number: 1,
          name: 'Mesa 1 - Hospital Universitario Sant Joan',
          census: 750,
          blankVotes: 7,
          nullVotes: 3,
          votesByCandidacy: {
            'cand-iv': 180,
            'cand-ccoo': 140,
            'cand-satse': 130,
            'cand-csif': 95,
            'cand-ugt': 75,
            'cand-usae': 50,
            'cand-simap': 40,
            'cand-indep': 15,
          },
        },
        {
          id: 'm-sj-2',
          number: 2,
          name: 'Mesa 2 - C.S. San Juan y Muchamiel',
          census: 320,
          blankVotes: 3,
          nullVotes: 1,
          votesByCandidacy: {
            'cand-iv': 80,
            'cand-ccoo': 60,
            'cand-satse': 55,
            'cand-csif': 42,
            'cand-ugt': 32,
            'cand-usae': 22,
            'cand-simap': 18,
            'cand-indep': 7,
          },
        },
        {
          id: 'm-sj-3',
          number: 3,
          name: 'Mesa 3 - C.S. San Vicente I y II',
          census: 350,
          blankVotes: 3,
          nullVotes: 1,
          votesByCandidacy: {
            'cand-iv': 85,
            'cand-ccoo': 65,
            'cand-satse': 60,
            'cand-csif': 45,
            'cand-ugt': 35,
            'cand-usae': 24,
            'cand-simap': 20,
            'cand-indep': 8,
          },
        },
        {
          id: 'm-sj-4',
          number: 4,
          name: 'Mesa 4 - C.S. El Campello',
          census: 240,
          blankVotes: 2,
          nullVotes: 1,
          votesByCandidacy: {
            'cand-iv': 60,
            'cand-ccoo': 45,
            'cand-satse': 40,
            'cand-csif': 32,
            'cand-ugt': 24,
            'cand-usae': 16,
            'cand-simap': 14,
            'cand-indep': 5,
          },
        },
        {
          id: 'm-sj-5',
          number: 5,
          name: 'Mesa 5 - C.S. Jijona y Montaña',
          census: 180,
          blankVotes: 2,
          nullVotes: 1,
          votesByCandidacy: {
            'cand-iv': 45,
            'cand-ccoo': 35,
            'cand-satse': 30,
            'cand-csif': 24,
            'cand-ugt': 18,
            'cand-usae': 12,
            'cand-simap': 10,
            'cand-indep': 4,
          },
        },
      ]);
    }
  };

  // Reiniciar escrutinio a ceros manteniendo las mesas
  const handleReset = () => {
    const zeroMesas = mesas.map((m) => {
      const zeroVotes: Record<string, number> = {};
      candidacies.forEach((c) => {
        zeroVotes[c.id] = 0;
      });
      return {
        ...m,
        blankVotes: 0,
        nullVotes: 0,
        votesByCandidacy: zeroVotes,
      };
    });
    setMesas(zeroMesas);
  };

  return (
    <div className="min-h-screen bg-[#F6F2EC] text-[#1D1B1A] flex flex-col selection:bg-[#BB2B09] selection:text-white">
      {/* Cabecera institucional Intersindical Salut */}
      <Header
        onExportPDF={() => exportElectionToPDF(calculationResult, config, mesas)}
        onExportExcel={() => exportElectionToExcel(calculationResult, config, mesas)}
        onOpenLegalModal={() => setIsLegalModalOpen(true)}
        onLoadPreset={handleLoadPreset}
        onReset={handleReset}
      />

      {/* Contenedor Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1 w-full">
        {/* 1. Panel de Convocatoria Electoral y Configuración de Mesas */}
        <ConfigPanel
          config={config}
          onChange={handleConfigChange}
          totalCensus={calculationResult.totalCensus}
          mesasCount={mesas.length}
          onSetMesasCount={handleSetMesasCount}
          onAddMesa={handleAddMesa}
          onRemoveMesa={handleRemoveLastMesa}
        />

        {/* 2. Escrutinio por Mesas Electorales (Matriz rápida y Fichas) */}
        <MesasScrutinyManager
          candidacies={candidacies}
          mesas={mesas}
          onUpdateMesas={setMesas}
          onAddMesa={handleAddMesa}
          onRemoveMesa={handleRemoveMesaById}
          calculationResult={calculationResult}
        />

        {/* 3. Gestión de Candidaturas Proclamadas */}
        <CandidaciesEditor
          candidacies={candidacies}
          onAddCandidacy={handleAddCandidacy}
          onUpdateCandidacy={handleUpdateCandidacy}
          onRemoveCandidacy={handleRemoveCandidacy}
        />

        {/* 4. Resultados Oficiales: Recuento por Mesas Electorales y Atribución */}
        <ResultsDisplay
          result={calculationResult}
          config={config}
          mesas={mesas}
        />
      </main>

      {/* Pie de página institucional */}
      <footer className="bg-[#1D1B1A] text-[#E3D9CF] py-6 border-t border-[#3A3330] mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-serif font-bold text-white text-sm">
              Intersindical Salut · Orihuela
            </span>
            <span className="text-[#5C544F]">|</span>
            <span>Secció Sindical Departament de Salut d'Orihuela · Sanitat GVA</span>
          </div>

          <div className="text-[#5C544F] text-center sm:text-right">
            Escrutinio oficial conforme al Art. 71.2 del Estatuto de los Trabajadores y Art. 39 TREBEP
          </div>
        </div>
      </footer>

      {/* Modal de Normativa Legal */}
      <LegalInfoModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
      />
    </div>
  );
}
