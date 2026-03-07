import styles from './styles.module.scss';

const BackgroundRays = () => {
  return (
    <div className={styles.rayContainer}>
      {/* Morphing gradient blobs (Optimized count) */}
      <div className={`${styles.blob} ${styles.blob1}`}></div>
      <div className={`${styles.blob} ${styles.blob2}`}></div>
      <div className={`${styles.blob} ${styles.blob3}`}></div>

      {/* Subtle grid overlay */}
      <div className={styles.gridOverlay}></div>

      {/* Floating particles */}
      <div className={styles.particlesContainer}>
        <div className={`${styles.particle} ${styles.p1}`}></div>
        <div className={`${styles.particle} ${styles.p2}`}></div>
        <div className={`${styles.particle} ${styles.p3}`}></div>
        <div className={`${styles.particle} ${styles.p4}`}></div>
        <div className={`${styles.particle} ${styles.p5}`}></div>
        <div className={`${styles.particle} ${styles.p6}`}></div>
        <div className={`${styles.particle} ${styles.p7}`}></div>
        <div className={`${styles.particle} ${styles.p8}`}></div>
      </div>

      {/* Edge vignette */}
      <div className={styles.vignette}></div>
    </div>
  );
};

export default BackgroundRays;
