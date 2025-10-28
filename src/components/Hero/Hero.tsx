'use client';

import { useCallback, type MouseEvent } from 'react';
import styles from './Hero.module.css';

export default function Hero() {
  const goToSteps = useCallback((e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById('funcionamiento');
    if (!target) return;

    const header = document.querySelector('header') as HTMLElement | null;
    const headerH = header?.offsetHeight ?? 0;
    const y = target.getBoundingClientRect().top + window.scrollY - headerH - 8;

    window.scrollTo({ top: y, behavior: 'smooth' });
  }, []);

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.backdrop} />
      <div className={styles.content}>
        <h1 id="hero-title" className={styles.title}>
          Construyendo conexiones, intercambiando soluciones
        </h1>

        {/* Este párrafo sigue igual: se oculta en mobile con CSS */}
        <p className={styles.subtitle}>
          En Intercanjes, nos dedicamos al canje de materiales de construcción desde hace 25 años,
          ofreciendo soluciones sostenibles y eficientes para el sector. Nuestra trayectoria nos ha
          permitido convertirnos en un referente, promoviendo la reutilización y el intercambio de
          recursos, con un compromiso firme hacia el medio ambiente y la economía circular. Creemos
          en la construcción de un futuro más consciente, colaborando estrechamente con nuestros
          clientes para que sus proyectos sean un éxito.
        </p>
      </div>

      {/* Flecha para bajar al siguiente bloque */}
      <a
        href="#funcionamiento"
        onClick={goToSteps}
        className={styles.down}
        aria-label="Bajar al siguiente contenido"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M6 9l6 6 6-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </section>
  );
}

