import React from 'react';
import { X, BookOpen, Scale, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface LegalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LegalInfoModal: React.FC<LegalInfoModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#FFFDF9] rounded-xl shadow-2xl border border-[#E3D9CF] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col text-[#1D1B1A]">
        {/* Cabecera */}
        <div className="bg-[#1D1B1A] px-6 py-4 text-white flex items-center justify-between border-b border-[#3A3330]">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-[#FF6A45]" />
            <div>
              <h3 className="font-serif font-bold text-base tracking-wide">
                Normativa Legal del Escrutinio Electoral
              </h3>
              <p className="text-xs text-[#E3D9CF]">
                Art. 71.2 del Estatuto de los Trabajadores y Art. 39 del TREBEP
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-[#E3D9CF] hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-[#1D1B1A] leading-relaxed">
          {/* Regla de los 50 trabajadores */}
          <div className="bg-[#FBEAE4] p-4 rounded-lg border border-[#F0C4B6]">
            <h4 className="font-serif font-bold text-[#8A2007] text-sm mb-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#BB2B09]" />
              Ámbito de Sanidad GVA: Censo Mínimo de 50 Trabajadores
            </h4>
            <p className="text-[#5C544F]">
              En los Departamentos de Salud y centros dependientes de la Conselleria de Sanitat (San GVA), los órganos unitarios de representación legal de los trabajadores son la <strong>Junta de Personal</strong> (personal estatutario y funcionario, regulada por el TREBEP art. 39) y el <strong>Comité de Empresa</strong> (personal laboral, regulado por el ET art. 66).
            </p>
            <p className="text-[#8A2007] font-semibold mt-1">
              • No hay órgano a constituir por debajo de 50 trabajadores. El censo mínimo exigido por ley para constituir estos órganos es de 50 trabajadores.
            </p>
          </div>

          {/* Umbral del 5% */}
          <div className="space-y-2">
            <h4 className="font-serif font-bold text-sm text-[#1D1B1A] flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#BB2B09]" />
              1. Umbral Legal de Exclusión (5% de los Votos Válidos)
            </h4>
            <p className="text-[#5C544F]">
              El artículo 71.2.b del Estatuto de los Trabajadores establece taxativamente:
            </p>
            <blockquote className="border-l-4 border-[#BB2B09] pl-3 italic text-[#1D1B1A] bg-[#F6F2EC] py-2 rounded-r">
              "No tendrán derecho a la atribución de representantes en el comité de empresa aquellas listas que no hayan obtenido, como mínimo, el 5 por 100 de los votos válidos emitidos por cada colegio."
            </blockquote>
            <p className="text-[#5C544F]">
              <strong>Cómputo de Votos en Blanco:</strong> Conforme a reiterada doctrina jurisprudencial de la Sala de lo Social del Tribunal Supremo, los votos en blanco forman parte del número total de votos válidos emitidos, integrando la base sobre la que se calcula el umbral del 5% y el cociente electoral.
            </p>
          </div>

          {/* Cociente y Restos */}
          <div className="space-y-2">
            <h4 className="font-serif font-bold text-sm text-[#1D1B1A] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#BB2B09]" />
              2. Asignación Proporcional por Cociente y Mayores Restos
            </h4>
            <p className="text-[#5C544F]">
              A cada lista proclamada que supere el 5% se le asigna el número de representantes resultante de:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#5C544F]">
              <li>
                <strong>Cociente Electoral:</strong> Resulta de dividir el número total de votos válidos por el número de puestos a cubrir.
              </li>
              <li>
                <strong>Puestos Directos:</strong> Tantos representantes como veces esté contenido el cociente de forma entera en los votos de cada lista.
              </li>
              <li>
                <strong>Puestos Sobrantes por Mayores Restos:</strong> Si quedasen puestos vacantes, se atribuyen sucesivamente a las candidaturas que ostenten los mayores restos de votos no consumidos por el cociente.
              </li>
              <li>
                <strong>Criterio de Desempate:</strong> Si concurre empate en el resto de votos, la ley lo resuelve a favor de la lista que tenga mayor número total de votos en la votación global.
              </li>
            </ul>
          </div>

          {/* Escala legal de representantes */}
          <div className="space-y-2">
            <h4 className="font-serif font-bold text-sm text-[#1D1B1A] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2F6B4F]" />
              3. Escala Legal de Representantes (Art. 66 ET y Art. 39 EBEP)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="bg-[#F6F2EC] p-2 rounded border border-[#E3D9CF]">
                <strong>50 a 100 electores:</strong> 5 miembros
              </div>
              <div className="bg-[#F6F2EC] p-2 rounded border border-[#E3D9CF]">
                <strong>101 a 250 electores:</strong> 9 miembros
              </div>
              <div className="bg-[#F6F2EC] p-2 rounded border border-[#E3D9CF]">
                <strong>251 a 500 electores:</strong> 13 miembros
              </div>
              <div className="bg-[#F6F2EC] p-2 rounded border border-[#E3D9CF]">
                <strong>501 a 750 electores:</strong> 17 miembros
              </div>
              <div className="bg-[#F6F2EC] p-2 rounded border border-[#E3D9CF]">
                <strong>751 a 1.000 electores:</strong> 21 miembros
              </div>
              <div className="bg-[#F6F2EC] p-2 rounded border border-[#E3D9CF]">
                <strong>&gt; 1.000 electores:</strong> 21 + 2 por cada 1.000
              </div>
            </div>
          </div>
        </div>

        {/* Pie */}
        <div className="bg-[#F6F2EC] px-6 py-3 border-t border-[#E3D9CF] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[#BB2B09] hover:bg-[#8A2007] text-white text-xs font-bold transition shadow-2xs"
          >
            Entendido y Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
