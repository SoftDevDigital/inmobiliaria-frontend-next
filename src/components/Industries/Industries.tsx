'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './Industries.module.css';

const categories = [
  'Piscinas',
  'Vidrios',
  'Constructora',
  'Aberturas',
  'Premoldeados',
  'Amoblamientos',
  'Construcción en seco',
  'Electricidad',
];

const logosByCat: Record<string, string[]> = {
  Piscinas: ['/logo1.svg', '/logo2.svg', '/logo3.svg'],
  Vidrios: ['/logo1.svg', '/logo2.svg', '/logo3.svg'],
  Constructora: ['/logo1.svg', '/logo2.svg', '/logo3.svg'],
  Aberturas: ['/logo1.svg', '/logo2.svg', '/logo3.svg'],
  Premoldeados: ['/logo1.svg', '/logo2.svg', '/logo3.svg'],
  Amoblamientos: ['/logo1.svg', '/logo2.svg', '/logo3.svg'],
  'Construcción en seco': ['/logo1.svg', '/logo2.svg', '/logo3.svg'],
  Electricidad: ['/logo1.svg', '/logo2.svg', '/logo3.svg'],
};
const fallbackLogos = ['/logo1.svg', '/logo2.svg', '/logo3.svg'];

export default function Industries() {
  const [activeCat, setActiveCat] = useState(2);   // arranca en “Constructora”
  const [idx, setIdx] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // ----- ventana de tabs -----
  const WINDOW = 5; // debe ser impar: 3, 5, 7...
  const visibleIdxs = useMemo(() => {
    const n = categories.length;
    const size = Math.min(WINDOW % 2 ? WINDOW : WINDOW - 1, n);
    const half = Math.floor(size / 2);
    const out: number[] = [];
    for (let off = -half; off <= half; off++) {
      out.push((activeCat + off + n) % n);
    }
    return out;
  }, [activeCat]);

  // logos según rubro
  const logos = useMemo(
    () => logosByCat[categories[activeCat]] ?? fallbackLogos,
    [activeCat]
  );

  useEffect(() => { setIdx(0); }, [activeCat]);

  // Carrusel de logos
  const prev = () => setIdx(i => (i - 1 + logos.length) % logos.length);
  const next = () => setIdx(i => (i + 1) % logos.length);

  // Flechas de categoría
  const prevCat = () => setActiveCat(c => (c - 1 + categories.length) % categories.length);
  const nextCat = () => setActiveCat(c => (c + 1) % categories.length);

  const posOf = (i: number) => (i - idx + logos.length) % logos.length;

  // cerrar menú con ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const selectCategory = (i: number) => {
    setActiveCat(i);
    setMenuOpen(false);
  };

  const menuId = 'cat-menu';

  const n = categories.length;
const prevIdx = (activeCat - 1 + n) % n;
const nextIdx = (activeCat + 1) % n;

  return (
    <section id="alianzas" className={styles.section} aria-labelledby="industries-title" lang="es">
      <div className={styles.head}>
        <button
          className={styles.menuBtn}
          aria-label="Abrir menú de categorías"
          aria-haspopup="menu"
          aria-controls={menuId}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(o => !o)}
        >
          <svg viewBox="0 0 48 48" width="43" height="43" fill="currentColor" aria-hidden>
            <rect x="8" y="12" width="32" height="4" rx="2" />
            <rect x="8" y="22" width="32" height="4" rx="2" />
            <rect x="8" y="32" width="32" height="4" rx="2" />
          </svg>
        </button>

        {/* >>> usa SOLO los índices visibles <<< */}
        {/* >>> HEADER DE RUBROS: flechas fijas + activo centrado <<< */}
<nav className={styles.tabs} aria-label="Rubros">
  <button
    type="button"
    className={styles.chevBtn}
    onClick={prevCat}
    aria-label="Categoría anterior"
  >
    <svg className={styles.chevL} viewBox="0 0 48 48" width="46" height="47" aria-hidden>
      <path d="M30 8 14 24l16 16" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </button>

  {/* Carril central de ancho fijo: [chip izq] [activo] [chip der] */}
  <div className={styles.track}>
    <button
      type="button"
      className={styles.sideBtn}
      onClick={() => selectCategory(prevIdx)}
      aria-label={`Ir a ${categories[prevIdx]}`}
      title={categories[prevIdx]}
    >
      {categories[prevIdx]}
    </button>

    <button
      type="button"
      className={styles.tabBtn}
      aria-current="true"
      onClick={() => setMenuOpen(true)}
      title="Ver todas las categorías"
    >
      <span className={styles.tabLabel}>{categories[activeCat]}</span>
    </button>

    <button
      type="button"
      className={styles.sideBtn}
      onClick={() => selectCategory(nextIdx)}
      aria-label={`Ir a ${categories[nextIdx]}`}
      title={categories[nextIdx]}
    >
      {categories[nextIdx]}
    </button>
  </div>

  <button
    type="button"
    className={styles.chevBtn}
    onClick={nextCat}
    aria-label="Categoría siguiente"
  >
    <svg className={styles.chevR} viewBox="0 0 48 48" width="46" height="47" aria-hidden>
      <path d="M18 8 34 24 18 40" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </button>
</nav>
      </div>

      {/* overlay + panel categorías (sin cambios) */}
      <div className={styles.menuOverlay} data-open={menuOpen} onClick={() => setMenuOpen(false)} aria-hidden />
      <div id={menuId} className={styles.menuPanel} data-open={menuOpen} role="menu" aria-label="Elegir categoría">
        {categories.map((c, i) => (
          <button
            key={`m-${c}`}
            role="menuitem"
            type="button"
            className={`${styles.menuItem} ${i === activeCat ? styles.menuItemActive : ''}`}
            onClick={() => selectCategory(i)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* SLIDER */}
      <div className={styles.sliderWrap}>
        <button className={`${styles.arrow} ${styles.left}`} onClick={prev} aria-label="Anterior">
          <svg viewBox="0 0 48 48" width="59" height="59" aria-hidden>
            <path d="M30 8 14 24l16 16" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className={styles.stage} role="region" aria-label={`Logos de ${categories[activeCat]}`}>
          {logos.map((src, i) => {
            const pos = posOf(i);
            return (
              <div
                key={`${src}-${i}`}
                className={`${styles.card} ${pos === 0 ? styles.center : pos === 1 ? styles.cardRight : styles.leftCard}`}
              >
                <img src={src} alt="" className={styles.logoImg} />
              </div>
            );
          })}
        </div>

        <button className={`${styles.arrow} ${styles.right}`} onClick={next} aria-label="Siguiente">
          <svg viewBox="0 0 48 48" width="59" height="59" aria-hidden>
            <path d="M18 8 34 24 18 40" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  );
}
