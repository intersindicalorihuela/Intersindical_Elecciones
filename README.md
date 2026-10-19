# Escrutinio Electoral Sindical · Intersindical Salut Orihuela

Aplicación web oficial para el escrutinio por mesas electorales y asignación de representantes de los trabajadores (Juntas de Personal y Comités de Empresa en el ámbito de Sanidad GVA) mediante el **sistema de proporcionalidad por cociente electoral y mayores restos**, con aplicación estricta del **umbral de exclusión del 5% de los votos válidos**, conforme al artículo 71.2 del Estatuto de los Trabajadores y el artículo 39 del TREBEP.

Repositorio: [https://github.com/intersindicalorihuela/EleccionesSanGVA](https://github.com/intersindicalorihuela/EleccionesSanGVA)

---

## 📌 Fundamentación Jurídica y Algoritmo de Cálculo

La aplicación implementa fielmente los preceptos establecidos en el **artículo 71.2 del Estatuto de los Trabajadores** (Real Decreto Legislativo 2/2015), la **Ley Orgánica 11/1985 de Libertad Sindical (LOLS)** y la doctrina unificada de la Sala de lo Social del Tribunal Supremo:

1. **Censo Mínimo Legal**: En el ámbito de Sanidad GVA no se constituyen órganos de representación para censos inferiores a 50 trabajadores. Los órganos unitarios son la Junta de Personal (personal estatutario/funcionario) y el Comité de Empresa (personal laboral).
2. **Escrutinio por Mesas Electorales**: Permite registrar y desglosar urna a urna los resultados de entre 2 y 5 mesas electorales según el Departamento de Salud.
3. **Votos Válidos**: Suma de votos a candidaturas en todas las mesas + votos en blanco. *(Los votos en blanco son legalmente válidos e integran la base de cálculo del umbral y cociente; los votos nulos quedan excluidos).*
4. **Umbral Legal de Exclusión (5%)**:
   $$\text{Umbral} = \text{Votos Válidos Totales} \times 0.05$$
   Aquellas candidaturas que no alcancen como mínimo el 5% de los votos válidos quedan excluidas de la asignación de representantes.
5. **Cociente Electoral**:
   $$\text{Cociente} = \frac{\text{Votos Válidos Totales}}{\text{Puestos a Cubrir}}$$
6. **Asignación Directa y Mayores Restos**: Se asignan puestos directos por división entera entre cociente y votos. Los puestos sobrantes se adjudican a las listas con mayor resto de votos no consumidos.
7. **Exportación Oficial**: Actas formales en PDF listas para diligenciar con firmas de Presidente/a, Secretario/a e Interventores, y hojas de cálculo Excel (.xlsx).
