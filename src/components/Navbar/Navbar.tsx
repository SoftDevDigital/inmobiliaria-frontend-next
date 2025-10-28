'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Esc + bloquear scroll cuando el menú está abierto
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.frame}>
          {/* Logo */}
          <Link href="/" className={styles.brand} aria-label="Intercanjes - inicio">
  {/* Desktop (igual que ahora) */}
  <Image
    src="/hero-construccion.png"
    alt="Intercanjes"
    width={430}
    height={55}
    priority
    className={`${styles.brandImg} ${styles.brandImgDesktop}`}
  />

  {/* Mobile (nuevo logo) */}
 <Image
    src="/hero-construccion.png"   // <- antes /loguito.jpeg
    alt="Intercanjes"
    width={160}
    height={40}
    priority
    className={`${styles.brandImg} ${styles.brandImgMobile}`}
  />
</Link>

          {/* Menú desktop (centrado) */}
          <nav aria-label="Principal" className={styles.nav}>
            <Link href="#funcionamiento">Funcionamiento</Link>
            <Link href="#alianzas">Alianzas</Link>
            <Link href="#formulario">Canjear</Link>
          </nav>

          {/* Botón hamburguesa (solo mobile) */}
          <button
            type="button"
            className={styles.burger}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-controls="mobile-menu"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              {open ? (
                <>
                  <path d="M6 6 L18 18" />
                  <path d="M18 6 L6 18" />
                </>
              ) : (
                <>
                  <path d="M4 6 H20" />
                  <path d="M4 12 H20" />
                  <path d="M4 18 H20" />
                </>
              )}
            </svg>
          </button>

          {/* Menú mobile (drawer) */}
          <div
            id="mobile-menu"
            className={`${styles.mobile} ${open ? styles.open : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
          >
            {/* scrim clickeable */}
            <button
              type="button"
              className={styles.scrim}
              aria-hidden="true"
              tabIndex={-1}
              onClick={() => setOpen(false)}
            />

            <div className={styles.mobileInner}>
              {/* botón X dentro del panel */}
              <button
                type="button"
                className={styles.close}
                aria-label="Cerrar menú"
                onClick={() => setOpen(false)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 6 L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                  <path d="M18 6 L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                </svg>
              </button>

              <Link href="#funcionamiento" onClick={() => setOpen(false)}>Funcionamiento</Link>
              <Link href="#alianzas"        onClick={() => setOpen(false)}>Alianzas</Link>
              <Link href="#formulario"      onClick={() => setOpen(false)}>Canjear</Link>
            </div>
          </div>
        </div>
      </header>

      {/* separador para compensar la altura del header fijo */}
      <div className={styles.spacer} aria-hidden />
    </>
  );
}
