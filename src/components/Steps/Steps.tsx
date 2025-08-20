import styles from './Steps.module.css';
import StepCard from './StepCard';
import Image from 'next/image';
const steps = [
  {
    icon: (
      // Ícono personas (SVG inline blanco)
      <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
      </svg>
    ),
    title: 'Paso 1:',
    text: 'Encuentra a tu socio ideal',
  },
 {
    /* <<< acá usamos el PNG >>> */
    icon: (
      <Image
        src="/icono2.png"
        alt=""
        width={129}
        height={129}
        priority
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    ),
    title: 'Paso 2:',
    text: 'Llena el formulario y cuéntanos sobre ti',
  },

  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.96-.69 2.8l1.46 1.46C19.54 14.93 20 13.52 20 12c0-4.42-3.58-8-8-8zm-6.41.59L4.13 6.05C2.66 7.51 2 9.39 2 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3c-3.31 0-6-2.69-6-6 0-1.38.47-2.65 1.26-3.66l-.67-.75z"/>
      </svg>
    ),
    title: 'Paso 3:',
    text: 'Define qué y cuánto deseas canjear',
  },
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
      </svg>
    ),
    title: 'Paso 4:',
    text: 'Enviar y esperar confirmación',
  },
];

export default function Steps() {
  return (
    <section id="funcionamiento" className={styles.section} aria-label="Pasos para canjear">
      <div className={styles.grid}>
        {steps.map((s, i) => (
          <StepCard key={i} icon={s.icon} title={s.title} text={s.text} />
        ))}
      </div>
    </section>
  );
}