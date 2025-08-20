'use client';

import styles from './Footer.module.css';

export default function Footer() {
  // 🔧 Cambiá estos valores si hace falta
  const EMAIL = 'intercanjes@benuzzi.com';
  const PHONE_DISPLAY = '342 5265789';
  const PHONE_WHATSAPP = '543425265789'; // incluir código de país (ej: 54 para AR)
  const ADDRESS_LABEL = 'General López 3754';
  const ADDRESS_QUERY = 'General López 3754, Santa Fe, Argentina';

  const mailHref = `mailto:${EMAIL}?subject=${encodeURIComponent('Consulta de intercambios')}`;
  const waHref = `https://wa.me/${PHONE_WHATSAPP}?text=${encodeURIComponent('Hola, me gustaría hacer una consulta 🙂')}`;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS_QUERY)}`;

  return (
    <footer className={styles.footer} aria-label="Información de contacto">
      <div className={styles.container}>
        {/* Email */}
        <a href={mailHref} className={styles.item}>
          <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 2v.01L12 12 4 6.01V6h16ZM4 18V8.24l7.4 5.55a1 1 0 0 0 1.2 0L20 8.24V18H4Z"/>
          </svg>
          <span className={styles.label}>{EMAIL}</span>
        </a>

        {/* WhatsApp */}
      {/* WhatsApp */}
<a
  href={waHref}
  target="_blank"
  rel="noopener noreferrer"
  className={`${styles.item} ${styles.whatsapp}`}
  aria-label="WhatsApp"
>
  <svg className={styles.waIcon} viewBox="0 0 32 32" aria-hidden="true">
    {/* Globo: círculo + “piquito” */}
    <circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" strokeWidth="2.2"/>
    <path d="M8.2 24.6 L6.8 29 L11.3 27.7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>

    {/* Auricular (blanco) – se ve nítido sobre el fondo negro */}
    <path
      className={styles.waPhone}
      d="M19.11 17.07c-.27-.14-1.6-.79-1.85-.88-.25-.1-.43-.14-.62.14-.18.27-.71.88-.87 1.06-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.17-1.35-.8-.71-1.34-1.6-1.5-1.87-.16-.27-.02-.41.12-.55.12-.12.27-.32.39-.48.13-.16.18-.27.27-.46.09-.18.05-.34-.02-.48-.07-.14-.62-1.48-.85-2.03-.22-.54-.46-.46-.62-.46h-.53c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3s.98 2.66 1.11 2.85c.14.18 1.92 2.94 4.65 4.12.65.28 1.15.45 1.54.58.65.21 1.25.18 1.72.11.53-.08 1.6-.65 1.83-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.52-.32z"
    />
  </svg>
  <span className={styles.label}>{PHONE_DISPLAY}</span>
</a>

        {/* Dirección */}
        <a href={mapsHref} target="_blank" rel="noopener noreferrer" className={styles.item}>
          <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"/>
          </svg>
          <span className={styles.label}>{ADDRESS_LABEL}</span>
        </a>
      </div>
    </footer>
  );
}
