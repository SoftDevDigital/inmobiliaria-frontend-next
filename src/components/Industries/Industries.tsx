'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './Industries.module.css';

const categories = [
  'Vidrios',
  'Constructoras',
  'Aberturas',
  'Premoldeados',
  'Amoblamientos',
  'Construcción en seco',
  'Electricidad',
  'Terrenos',
];

type LogoItem = { src: string; href?: string; alt?: string; fit?: 'cover' | 'contain' };

const logosByCat: Record<string, LogoItem[]> = {
  Vidrios: [{ src: '/logo bianchi.png',href: 'https://www.bianchiycia.com/' }],

  Constructoras: [
    { src: '/logo1.svg', href: 'https://benuzzi.com/', alt: 'Benuzzi' },
    { src: '/CAM.svg', href: 'https://www.camconstrucciones.com.ar/', alt: 'CAM' },
    { src: '/boscarino.jpeg', alt: 'Boscarino' },
  ],

  Aberturas: [
    { src: '/logo deyvel.png', href: 'https://deyvel.com.ar/', alt: 'Deyvel' },
    { src: '/logo herfasa.png', href: 'https://herfasa.com/', alt: 'Herfasa' },
  ],

  Premoldeados: [{ src: '/LogoNardoni.jpg', href: 'https://premoldeadosnardoni.com.ar/', alt: 'Nardoni' }],
  Amoblamientos: [{ src: '/logo2.svg', href: 'https://presisso.com.ar/', alt: 'Presisso' }],
  'Construcción en seco': [
    { src: '/DISSER.png', alt: 'DISSER', href: 'https://dissersrl.com.ar/', fit: 'contain' },
  ],
  Electricidad: [{ src: '/logo electricidad parana.png',href: 'https://www.instagram.com/electricidadparana/?hl=es-la' }],
  Terrenos: [{ src: '/terrenos.jpg', href: 'https://benuzzi.com/property/estancia-san-jose/'}],
};
const fallbackLogos = ['/logo1.svg', '/logo2.svg', '/logo3.svg'];

const sectionTopOffset = 96;

export default function Industries() {
  // 🔹 Ordenar alfabéticamente sin modificar el array original
  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' })),
    []
  );

  const [activeCat, setActiveCat] = useState(0); // empieza en la primera ordenada
  const [idx, setIdx] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const savedYRef = useRef(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const WINDOW = 5;
  const visibleIdxs = useMemo(() => {
    const n = sortedCategories.length;
    const size = Math.min(WINDOW % 2 ? WINDOW : WINDOW - 1, n);
    const half = Math.floor(size / 2);
    const out: number[] = [];
    for (let off = -half; off <= half; off++) out.push((activeCat + off + n) % n);
    return out;
  }, [activeCat, sortedCategories]);

  /* ====== NUEVO: logos reales + fallback y flag para flechas ====== */
  const realLogos = useMemo(
    () => logosByCat[sortedCategories[activeCat]] ?? [],
    [activeCat, sortedCategories]
  );

  const logos = useMemo(
    () =>
      realLogos.length
        ? realLogos
        : fallbackLogos.map((src) => ({ src } as LogoItem)),
    [realLogos]
  );

  const showArrows = realLogos.length > 1;
  /* ================================================================ */

  useEffect(() => {
    setIdx(0);
  }, [activeCat]);

  const prev = () => setIdx((i) => (i - 1 + logos.length) % logos.length);
  const next = () => setIdx((i) => (i + 1) % logos.length);

  const prevCat = () =>
    setActiveCat((c) => (c - 1 + sortedCategories.length) % sortedCategories.length);
  const nextCat = () => setActiveCat((c) => (c + 1) % sortedCategories.length);

  const posOf = (i: number) => (i - idx + logos.length) % logos.length;

  useEffect(() => {
    const root = document.documentElement;
    if (menuOpen) {
      savedYRef.current = window.scrollY;
      const scrollbarComp = window.innerWidth - root.clientWidth;
      if (scrollbarComp > 0) root.style.paddingRight = `${scrollbarComp}px`;
      root.style.overflow = 'hidden';
    } else {
      root.style.overflow = '';
      root.style.paddingRight = '';
    }
    return () => {
      const r = document.documentElement;
      r.style.overflow = '';
      r.style.paddingRight = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const selectCategory = (i: number) => {
    setActiveCat(i);
    setMenuOpen(false);
    requestAnimationFrame(() => {
      const sec = sectionRef.current;
      const fallbackY = savedYRef.current || window.scrollY;
      const targetY = sec
        ? sec.getBoundingClientRect().top + window.scrollY - sectionTopOffset
        : fallbackY;

      window.scrollTo({ top: targetY, behavior: 'smooth' });
      stageRef.current?.focus({ preventScroll: true });
    });
  };

  const menuId = 'cat-menu';
  const n = sortedCategories.length;
  const prevIdx = (activeCat - 1 + n) % n;
  const nextIdx = (activeCat + 1) % n;

  return (
    <section
      ref={sectionRef}
      id="alianzas"
      className={`${styles.section} ${styles.compact}`}
      aria-labelledby="industries-title"
      lang="es"
    >
      <div className={styles.head}>
        {/* HAMBURGUESA PARA DESKTOP */}
        <button
          className={`${styles.menuBtn} ${styles.desktopOnly}`}
          aria-label="Abrir menú de categorías"
          aria-haspopup="menu"
          aria-controls={menuId}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <svg viewBox="0 0 48 48" width="43" height="43" fill="currentColor" aria-hidden>
            <rect x="8" y="12" width="32" height="4" rx="2" />
            <rect x="8" y="22" width="32" height="4" rx="2" />
            <rect x="8" y="32" width="32" height="4" rx="2" />
          </svg>
        </button>

        {/* Barra mobile */}
        <div className={styles.mobileHeading}>
          <button
            className={`${styles.menuBtn} ${styles.mobileOnly}`}
            aria-label="Abrir menú de categorías"
            aria-haspopup="menu"
            aria-controls={menuId}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <svg viewBox="0 0 48 48" width="43" height="43" fill="currentColor" aria-hidden>
              <rect x="8" y="12" width="32" height="4" rx="2" />
              <rect x="8" y="22" width="32" height="4" rx="2" />
              <rect x="8" y="32" width="32" height="4" rx="2" />
            </svg>
          </button>
          <h2 id="industries-title" className={styles.sectionTitle}>
            Alianzas
          </h2>
        </div>

        {/* HEADER DE RUBROS */}
        <nav className={styles.tabs} aria-label="Rubros">
          <button type="button" className={styles.chevBtn} onClick={prevCat} aria-label="Categoría anterior">
            <svg className={styles.chevL} viewBox="0 0 48 48" width="100%" height="100%" aria-hidden>
              <path
                d="M30 8 14 24l16 16"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            type="button"
            className={styles.tabBtn}
            aria-current="true"
            onClick={() => setMenuOpen(true)}
            title="Ver todas las categorías"
          >
            <span className={styles.tabLabel}>{sortedCategories[activeCat]}</span>
          </button>

          <button type="button" className={styles.chevBtn} onClick={nextCat} aria-label="Categoría siguiente">
            <svg className={styles.chevR} viewBox="0 0 48 48" width="100%" height="100%" aria-hidden>
              <path
                d="M18 8 34 24 18 40"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </nav>
      </div>

      {/* overlay + panel categorías */}
      <div
        className={styles.menuOverlay}
        data-open={menuOpen}
        onClick={() => setMenuOpen(false)}
        aria-hidden
      />
      <div
        id={menuId}
        className={styles.menuPanel}
        data-open={menuOpen}
        role="menu"
        aria-label="Elegir categoría"
      >
        {sortedCategories.map((c, i) => (
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
        {showArrows && (
          <button className={`${styles.arrow} ${styles.left}`} onClick={prev} aria-label="Anterior">
            <svg viewBox="0 0 48 48" width="59" height="59" aria-hidden>
              <path
                d="M30 8 14 24l16 16"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        <div
          ref={stageRef}
          className={styles.stage}
          role="region"
          aria-label={`Logos de ${sortedCategories[activeCat]}`}
          tabIndex={-1}
        >
          {logos.map((item, i) => {
            const pos = posOf(i);
            const CardInner = (
              <img
                src={item.src}
                alt={item.alt ?? ''}
                className={`${styles.logoImg} ${
                  item.fit === 'contain' ? styles.logoContain : ''
                }`}
              />
            );

            const cardClass = `${styles.card} ${
              pos === 0 ? styles.center : pos === 1 ? styles.cardRight : styles.leftCard
            }`;

            return item.href ? (
              <a
                key={`${item.src}-${i}`}
                className={cardClass}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.alt ? `Abrir ${item.alt}` : 'Abrir enlace'}
                title={item.alt ?? item.href}
              >
                {CardInner}
              </a>
            ) : (
              <div key={`${item.src}-${i}`} className={cardClass}>
                {CardInner}
              </div>
            );
          })}
        </div>

        {showArrows && (
          <button className={`${styles.arrow} ${styles.right}`} onClick={next} aria-label="Siguiente">
            <svg viewBox="0 0 48 48" width="59" height="59" aria-hidden>
              <path
                d="M18 8 34 24 18 40"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
}
