'use client';

import Image from 'next/image';
import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import styles from './ExchangeForms.module.css';

type Tab = 'canjea' | 'forma';

export default function ExchangeForms() {
  const [tab, setTab] = useState<Tab>('canjea');

  // extras opcionales para los botones de “canjea”
  const fileRef = useRef<HTMLInputElement>(null);
  const [photoName, setPhotoName] = useState('');
  const [coords, setCoords] = useState('');

  const handlePhoto = () => fileRef.current?.click();
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoName(e.target.files?.[0]?.name ?? '');
  };
  const locate = () => {
    if (!('geolocation' in navigator)) return alert('Tu navegador no soporta geolocalización');
    navigator.geolocation.getCurrentPosition(
      p => setCoords(`${p.coords.latitude.toFixed(5)}, ${p.coords.longitude.toFixed(5)}`),
      () => alert('No pudimos obtener tu ubicación')
    );
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('¡Enviado!');
  };

  // ---------- altura constante ----------
  const wrapRef = useRef<HTMLDivElement>(null);
  const canjeaRef = useRef<HTMLFormElement>(null);
  const formaRef  = useRef<HTMLFormElement>(null);
  const [wrapH, setWrapH] = useState<number>(0);

  const measure = () => {
    const h1 = canjeaRef.current?.scrollHeight ?? 0;
    const h2 = formaRef.current?.scrollHeight ?? 0;
    const max = Math.max(h1, h2);
    if (max && max !== wrapH) setWrapH(max);
  };

  useLayoutEffect(() => {
    measure();
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // si cambian datos que pueden alterar la altura, re-medir
  useEffect(() => { measure(); }, [tab, coords, photoName]); 

  return (
    <section className={styles.section} id="formulario">
      <div className={styles.card}>
        {/* Lado izquierdo con la imagen (se oculta en mobile) */}
        <div className={styles.media} aria-hidden>
          <Image
            src="/formulario.png"
            alt=""
            fill
            priority
            sizes="(max-width: 980px) 0px, 50vw"
            className={styles.bg}
          />
          <Image
            src="/logoC.png"
            alt="Logo IC"
            width={360}
            height={360}
            className={styles.brand}
            priority
          />
        </div>

        {/* Lado derecho: tabs + formularios */}
        <div className={styles.formWrap}>
          <div role="tablist" aria-label="Tipo de formulario" className={styles.tabs}>
            <button
              role="tab"
              aria-selected={tab === 'canjea'}
              className={`${styles.tab} ${tab === 'canjea' ? styles.active : ''}`}
              onClick={() => setTab('canjea')}
              type="button"
            >
              CANJEA
            </button>
            <button
              role="tab"
              aria-selected={tab === 'forma'}
              className={`${styles.tab} ${tab === 'forma' ? styles.active : ''}`}
              onClick={() => setTab('forma')}
              type="button"
            >
              FORMÁ PARTE
            </button>
          </div>

          {/* Viewport de formularios con altura fija al máximo */}
          <div
            ref={wrapRef}
            className={styles.forms}
            style={{ height: wrapH ? `${wrapH}px` : undefined }}
          >
            {/* Form CANJEA */}
            <form
              ref={canjeaRef}
              className={`${styles.form} ${styles.panel} ${tab === 'canjea' ? styles.show : styles.hidden}`}
              onSubmit={onSubmit}
            >
              <label>
                Nombre y apellido
                <input type="text" required />
              </label>

              <div className={styles.row}>
                <label className={styles.stretch}>
                  Nombre de la empresa
                  <input type="text" />
                </label>

                <div className={styles.actions}>
                  <button type="button" onClick={locate} className={styles.actionBtn}>
                    <span aria-hidden>📍</span> Colocar ubicación
                  </button>
                  <button type="button" onClick={handlePhoto} className={styles.actionBtn}>
                    <span aria-hidden>📷</span> Agrega una foto
                  </button>
                  <input
                    ref={fileRef}
                    className={styles.hiddenInput}
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                  />
                </div>
              </div>

              <label>
                Mail
                <input type="email" required />
              </label>

              <label>
                Teléfono
                <input type="tel" required />
              </label>

              <label className={styles.full}>
                Contanos un poco más
                {/* fijamos una altura mínima para evitar micro saltos */}
                <textarea rows={8} className={styles.textarea} />
              </label>

              <div className={styles.footer}>
                {(coords || photoName) && (
                  <p className={styles.meta}>
                    {coords && `Ubicación: ${coords}`} {coords && photoName && '·'} {photoName && `Foto: ${photoName}`}
                  </p>
                )}
                <button className={styles.submit} type="submit">Enviar</button>
              </div>
            </form>

            {/* Form FORMÁ PARTE */}
            <form
              ref={formaRef}
              className={`${styles.form} ${styles.panel} ${tab === 'forma' ? styles.show : styles.hidden}`}
              onSubmit={onSubmit}
            >
              <label>
                Nombre y apellido
                <input type="text" required />
              </label>

              <label>
                Mail
                <input type="email" required />
              </label>

              <label>
                Teléfono
                <input type="tel" required />
              </label>

              <label className={styles.full}>
                Contanos un poco más
                <textarea rows={8} className={styles.textarea} />
              </label>

              <div className={styles.footer}>
                <button className={styles.submit} type="submit">Enviar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
