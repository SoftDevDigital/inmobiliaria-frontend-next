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
  const [locLoading, setLocLoading] = useState(false);

  const handlePhoto = () => fileRef.current?.click();
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoName(e.target.files?.[0]?.name ?? '');
  };

  // ✅ Geolocalización con permisos + timeout + fallback manual
  const locate = async () => {
    if (!('geolocation' in navigator)) {
      alert('Tu navegador no soporta geolocalización');
      return;
    }
    try {
      setLocLoading(true);

      // Aviso: geolocalización solo funciona en HTTPS o localhost.
      // Intentamos chequear permisos si el navegador lo soporta.
   
      const hasPerms = typeof navigator.permissions?.query === 'function';
     
      const perm: PermissionStatus | null = hasPerms ? await navigator.permissions.query({ name: 'geolocation' as PermissionName }) : null;

      if (perm && perm.state === 'denied') {
        alert('El permiso de ubicación está bloqueado. Habilitalo en los ajustes del navegador y reintentá.');
        setLocLoading(false);
        return;
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      });

      setCoords(`${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}`);
    } catch (_) {
      alert('No pudimos obtener tu ubicación. Podés escribirla manualmente en el campo de ubicación.');
    } finally {
      setLocLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Obtener el formulario que disparó el evento
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    
    // Identificar el tipo de formulario basándose en qué tab está activo
    const tipoFormulario = tab; // 'canjea' | 'forma'
    
    // Extraer los datos del formulario
    const datos = {
      tipo: tipoFormulario, // ⬅️ AQUÍ SE DIFERENCIA: 'canjea' o 'forma'
      nombre: formData.get('nombre') as string,
      mail: formData.get('mail') as string,
      telefono: formData.get('telefono') as string,
      mensaje: formData.get('mensaje') as string,
    };
    
    // Datos adicionales solo para "Canjea"
    if (tipoFormulario === 'canjea') {
      Object.assign(datos, {
        empresa: formData.get('empresa') as string,
        ubicacion: coords,
        foto: photoName,
      });
    }
    
    console.log('📤 Formulario enviado:', datos);
    // TODO: Aquí iría la llamada a tu API/backend
    // await fetch('/api/contacto', { method: 'POST', body: JSON.stringify(datos) });
    
    alert(`¡Enviado! (Tipo: ${tipoFormulario === 'canjea' ? 'CANJEA' : 'FORMÁ PARTE'})`);
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

  const mapsHref = coords ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coords)}` : '';

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
                <input type="text" name="nombre" required />
              </label>

              <div className={styles.row}>
                <label className={styles.stretch}>
                  Nombre de la empresa
                  <input type="text" name="empresa" />
                </label>

                <div className={styles.actions}>
                  <button type="button" onClick={locate} className={styles.actionBtn} disabled={locLoading}>
                    <span aria-hidden>📍</span> {locLoading ? 'Buscando...' : 'Colocar ubicación'}
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

              {/* ⬇️ NUEVO: campo manual para ubicación (también muestra la auto) */}
              <label>
                Ubicación (auto o manual)
                <input
                  type="text"
                  placeholder="Ej: -31.4201, -64.1888 o 'Santa Fe, Argentina'"
                  value={coords}
                  onChange={(e) => setCoords(e.target.value)}
                />
              </label>

              <label>
                Mail
                <input type="email" name="mail" required />
              </label>

              <label>
                Teléfono
                <input type="tel" name="telefono" required />
              </label>

              <label className={styles.full}>
                Contanos un poco más
                {/* fijamos una altura mínima para evitar micro saltos */}
                <textarea rows={8} name="mensaje" className={styles.textarea} />
              </label>

              <div className={styles.footer}>
                {(coords || photoName) && (
                  <p className={styles.meta}>
                    {coords && (
                      <>
                        Ubicación: {coords}{' '}
                        {mapsHref && (
                          <>
                            · <a href={mapsHref} target="_blank" rel="noopener noreferrer">Ver en Maps</a>
                          </>
                        )}
                      </>
                    )}
                    {coords && photoName && ' · '}
                    {photoName && `Foto: ${photoName}`}
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
                <input type="text" name="nombre" required />
              </label>

              <label>
                Mail
                <input type="email" name="mail" required />
              </label>

              <label>
                Teléfono
                <input type="tel" name="telefono" required />
              </label>

              <label className={styles.full}>
                Contanos un poco más
                <textarea rows={8} name="mensaje" className={styles.textarea} />
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
