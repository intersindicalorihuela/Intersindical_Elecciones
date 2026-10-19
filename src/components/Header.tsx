import React, { useState } from 'react';
import { IntersindicalLogo } from './IntersindicalLogo';
import {
  FileSpreadsheet,
  FileText,
  BookOpen,
  RotateCcw,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

interface HeaderProps {
  onExportPDF: () => void;
  onExportExcel: () => void;
  onOpenLegalModal: () => void;
  onLoadPreset: (presetKey: string) => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onExportPDF,
  onExportExcel,
  onOpenLegalModal,
  onLoadPreset,
  onReset,
}) => {
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);

  const currentDateFormatted = new Date().toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <header className="bg-[#F6F2EC] border-b border-[#E3D9CF] text-[#1D1B1A]">
      {/* 1. Barra de acento superior de 6px roja idéntica a la identidad visual */}
      <div className="h-1.5 w-full bg-[#BB2B09]" />

      {/* 2. Cabecera principal con logo, títulos y sello */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          {/* Identidad y Título */}
          <div className="flex items-start gap-4 sm:gap-5">
            <IntersindicalLogo size="lg" />

            <div>
              <div className="brand-eyebrow mb-2">
                <b>INTERSINDICAL SALUT</b> · <span className="normal-case font-semibold">Orihuela</span>
              </div>
              <h1 className="font-serif font-semibold text-2xl sm:text-3xl text-[#1D1B1A] leading-tight">
                Elecciones Sindicales
                <span className="block text-[#BB2B09]">Sanidad GVA</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#5C544F] mt-1 max-w-xl leading-relaxed">
                Escrutinio oficial y reparto de representantes por mesas electorales conforme al
                Art. 71.2 del Estatuto de los Trabajadores (cociente y restos mayores con umbral legal del 5%).
              </p>
            </div>
          </div>

          {/* Sello oficial con fecha */}
          <div className="flex flex-col items-start md:items-end gap-3 flex-shrink-0">
            <div className="stamp select-none shadow-2xs">
              ▣ Datos actualizados a: {currentDateFormatted}
            </div>

            {/* Botones de acción rápida */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Selector de plantillas de Departamentos de Salud */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsPresetsOpen(!isPresetsOpen)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#FFFDF9] hover:bg-white text-xs font-semibold text-[#1D1B1A] border border-[#E3D9CF] shadow-2xs transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#BB2B09]" />
                  <span>Plantillas Dptos. Salud</span>
                  <ChevronDown className="w-3 h-3 text-[#5C544F]" />
                </button>

                {isPresetsOpen && (
                  <div
                    className="absolute right-0 mt-1.5 w-72 bg-[#FFFDF9] rounded-lg shadow-xl border border-[#E3D9CF] py-1 text-[#1D1B1A] z-50 text-xs"
                    onMouseLeave={() => setIsPresetsOpen(false)}
                  >
                    <div className="px-3 py-1.5 font-bold uppercase text-[10px] text-[#8A2007] tracking-wider border-b border-[#ECE4DB]">
                      Cargar Departamento de Salud
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onLoadPreset('orihuela_3');
                        setIsPresetsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-[#FBEAE4] transition flex flex-col"
                    >
                      <span className="font-bold text-[#1D1B1A]">Dpto. Orihuela (3 Mesas · 23 Puestos)</span>
                      <span className="text-[11px] text-[#5C544F]">
                        H. Vega Baja, C.S. Orihuela, C.S. Callosa/Almoradí
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onLoadPreset('torrevieja_3');
                        setIsPresetsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-[#FBEAE4] transition flex flex-col border-t border-[#ECE4DB]"
                    >
                      <span className="font-bold text-[#1D1B1A]">Dpto. Torrevieja (3 Mesas · 21 Puestos)</span>
                      <span className="text-[11px] text-[#5C544F]">
                        H. Universitario Torrevieja y Atención Primaria
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onLoadPreset('elche_4');
                        setIsPresetsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-[#FBEAE4] transition flex flex-col border-t border-[#ECE4DB]"
                    >
                      <span className="font-bold text-[#1D1B1A]">Dpto. Elche General (4 Mesas · 23 Puestos)</span>
                      <span className="text-[11px] text-[#5C544F]">
                        H. General, Elche Centro, Santa Pola y Crevillent
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onLoadPreset('alcoi_2');
                        setIsPresetsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-[#FBEAE4] transition flex flex-col border-t border-[#ECE4DB]"
                    >
                      <span className="font-bold text-[#1D1B1A]">Dpto. Alcoi (2 Mesas · 17 Puestos)</span>
                      <span className="text-[11px] text-[#5C544F]">
                        Hospital Virgen de los Lirios y Centros de Salud
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onLoadPreset('alicante_5');
                        setIsPresetsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-[#FBEAE4] transition flex flex-col border-t border-[#ECE4DB]"
                    >
                      <span className="font-bold text-[#1D1B1A]">Dpto. Sant Joan d'Alacant (5 Mesas · 23 Puestos)</span>
                      <span className="text-[11px] text-[#5C544F]">
                        Hospital Universitario y Zonas Básicas de Salud
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* Botón Normativa Legal */}
              <button
                type="button"
                onClick={onOpenLegalModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#FFFDF9] hover:bg-white text-xs font-semibold text-[#1D1B1A] border border-[#E3D9CF] shadow-2xs transition"
                title="Normativa legal Art. 71.2 ET y umbral 5%"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#2F6B4F]" />
                <span className="hidden sm:inline">Normativa Legal</span>
              </button>

              {/* Botón Exportar PDF */}
              <button
                type="button"
                onClick={onExportPDF}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#BB2B09] hover:bg-[#8A2007] active:bg-[#721B06] text-white text-xs font-bold shadow-2xs transition"
                title="Exportar Acta Oficial de Escrutinio por Mesas en PDF"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Exportar PDF</span>
              </button>

              {/* Botón Exportar Excel */}
              <button
                type="button"
                onClick={onExportExcel}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#2F6B4F] hover:bg-[#23533D] active:bg-[#1A3E2D] text-white text-xs font-bold shadow-2xs transition"
                title="Descargar Hoja de Cálculo Excel (.xlsx)"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Exportar Excel</span>
              </button>

              {/* Botón Reiniciar */}
              <button
                type="button"
                onClick={onReset}
                className="p-1.5 rounded bg-[#FFFDF9] hover:bg-white text-[#5C544F] hover:text-[#BB2B09] border border-[#E3D9CF] transition"
                title="Reiniciar datos de las mesas"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
