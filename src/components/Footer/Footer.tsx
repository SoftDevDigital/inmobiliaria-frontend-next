'use client';

import styles from './Footer.module.css';

export default function Footer() {
  const EMAIL = 'intercanjes@gmail.com';
  const PHONE_DISPLAY = '3426400603';
  const PHONE_WHATSAPP = '3426400603';

  const mailHref = `mailto:${EMAIL}?subject=${encodeURIComponent('Consulta de intercambios')}`;
  const waHref = `https://wa.me/${PHONE_WHATSAPP}?text=${encodeURIComponent('Hola, me gustaría hacer una consulta 🙂')}`;

  return (
    <footer className={styles.footer} aria-label="Información de contacto">
      {/* Texto largo solo en mobile */}
      <p className={styles.mobileIntro}>
        En Intercanjes, nos dedicamos al canje de materiales de construcción desde hace 25 años,
        ofreciendo soluciones sostenibles y eficientes para el sector. Nuestra trayectoria nos ha
        permitido convertirnos en un referente, promoviendo la reutilización y el intercambio de
        recursos, con un compromiso firme hacia el medio ambiente y la economía circular. Creemos en
        la construcción de un futuro más consciente, colaborando estrechamente con nuestros clientes
        para que sus proyectos sean un éxito.
      </p>

      <div className={styles.container}>
        {/* Email */}
        <a href={mailHref} className={styles.item}>
          <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 2v.01L12 12 4 6.01V6h16ZM4 18V8.24l7.4 5.55a1 1 0 0 0 1.2 0L20 8.24V18H4Z"
            />
          </svg>
          <span className={styles.label}>{EMAIL}</span>
        </a>

        {/* WhatsApp */}
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.item} ${styles.whatsapp}`}
          aria-label="WhatsApp"
        >
          {/* Icono desde /public/wsp.svg */}
          <img
            src="/wsp.svg"
            alt=""
            aria-hidden="true"
            className={styles.waIcon}
          />
          <span className={styles.label}>{PHONE_DISPLAY}</span>
        </a>
      </div>
    </footer>
  );
}
