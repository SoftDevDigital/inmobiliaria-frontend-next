import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.backdrop} />
      <div className={styles.content}>
        <h1 id="hero-title" className={styles.title}>
          Construyendo conexiones,
          <br />
          intercambiando soluciones
        </h1>
        <p className={styles.subtitle}>
          En Intercanjes, nos dedicamos al canje de materiales de construcción desde hace 25 años,
          ofreciendo soluciones sostenibles y eficientes para el sector. Nuestra trayectoria nos ha
          permitido convertirnos en un referente, promoviendo la reutilización y el intercambio de
          recursos, con un compromiso firme hacia el medio ambiente y la economía circular. Creemos
          en la construcción de un futuro más consciente, colaborando estrechamente con nuestros
          clientes para que sus proyectos sean un éxito.
        </p>
      </div>
    </section>
  );
}
