'use client';

import Image from 'next/image';
import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import styles from './ExchangeForms.module.css';
import { submitContactForm } from '@/lib/api';

type Tab = 'canjea' | 'forma';

export default function ExchangeForms() {
  const [tab, setTab] = useState<Tab>('canjea');

  // extras opcionales para los botones de "canjea"
  const fileRef = useRef<HTMLInputElement>(null);
  const [fotos, setFotos] = useState<File[]>([]);
  const [coords, setCoords] = useState('');
  const [locLoading, setLocLoading] = useState(false);

  const handlePhoto = () => fileRef.current?.click();
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Convertir FileList a Array y agregar a las fotos existentes
      const newFiles = Array.from(files);
      // Validar que no exceda 10 fotos en total
      const totalFotos = fotos.length + newFiles.length;
      if (totalFotos > 10) {
        alert(`Puedes subir máximo 10 fotos. Ya tienes ${fotos.length} y estás intentando agregar ${newFiles.length}.`);
        return;
      }
      setFotos(prev => [...prev, ...newFiles]);
    }
  };

  const removeFoto = (index: number) => {
    setFotos(prev => prev.filter((_, i) => i !== index));
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
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
      const empresa = formData.get('empresa') as string;
      if (empresa) {
        Object.assign(datos, { empresa });
      }
      if (coords) {
        Object.assign(datos, { ubicacion: coords });
      }
      // Agregar fotos si hay
      if (fotos.length > 0) {
        Object.assign(datos, { fotos });
      }
    }
    
    try {
      setIsSubmitting(true);
      console.log('📤 Formulario enviado:', { ...datos, fotos: fotos.length > 0 ? `${fotos.length} archivo(s)` : 'ninguna' });
      
      const result = await submitContactForm(datos);
      
      const mensajeExito = fotos.length > 0 
        ? `¡Enviado exitosamente! (Tipo: ${tipoFormulario === 'canjea' ? 'CANJEA' : 'FORMÁ PARTE'}, ${fotos.length} foto(s) enviada(s))`
        : `¡Enviado exitosamente! (Tipo: ${tipoFormulario === 'canjea' ? 'CANJEA' : 'FORMÁ PARTE'})`;
      alert(mensajeExito);
      
      // Limpiar el formulario después del envío exitoso
      form.reset();
      setCoords('');
      setFotos([]);
      if (fileRef.current) {
        fileRef.current.value = '';
      }
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      alert('Hubo un error al enviar el formulario. Por favor, intentá nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
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
  useEffect(() => { measure(); }, [tab, coords, fotos]);

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
                    <span aria-hidden>📷</span> {fotos.length > 0 ? `Agregar más (${fotos.length})` : 'Agrega fotos'}
                  </button>
                  <input
                    ref={fileRef}
                    className={styles.hiddenInput}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    multiple
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
                {(coords || fotos.length > 0) && (
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
                    {coords && fotos.length > 0 && ' · '}
                    {fotos.length > 0 && (
                      <span>
                        {fotos.length} foto{fotos.length > 1 ? 's' : ''} seleccionada{fotos.length > 1 ? 's' : ''}
                        {fotos.length > 0 && ':'}
                        {fotos.map((foto, idx) => (
                          <span key={idx} style={{ marginLeft: '8px', fontSize: '0.9em' }}>
                            {foto.name}
                            {idx < fotos.length - 1 && ', '}
                          </span>
                        ))}
                      </span>
                    )}
                  </p>
                )}
                {fotos.length > 0 && (
                  <div style={{ marginBottom: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {fotos.map((foto, idx) => (
                      <span 
                        key={idx} 
                        style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '6px',
                          padding: '4px 8px',
                          background: '#1f2937',
                          borderRadius: '4px',
                          fontSize: '0.85em',
                          color: '#e5e7eb'
                        }}
                      >
                        {foto.name}
                        <button
                          type="button"
                          onClick={() => removeFoto(idx)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            padding: '0',
                            marginLeft: '4px',
                            fontSize: '1.2em'
                          }}
                          aria-label={`Eliminar ${foto.name}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <button className={styles.submit} type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Enviando...' : 'Enviar'}
                </button>
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
                <button className={styles.submit} type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Enviando...' : 'Enviar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
