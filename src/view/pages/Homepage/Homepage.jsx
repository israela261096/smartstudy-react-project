import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import styles from './Homepage.module.css';

function Homepage() {
  return (
    <>
      <Navbar />
      <div className={styles.homepage}>
        <div className={styles.mainContent}>
          <h1>עמוד הבית</h1>
          <div className={styles.buttonsGrid}>
            {/* תשימי לב שהנתיבים כאן קטנים, בדיוק כפי שהגדרת ב־AppWrapper */}
            <Link to="/summaries" className={styles.menuButton}>
              מאגר סיכומים
            </Link>
            <Link to="/forums" className={styles.menuButton}>
              פורומים
            </Link>
            <Link to="/support" className={styles.menuButton}>
              תמיכה
            </Link>
            <Link to="/dashboard" className={styles.menuButton}>
              לוח בקרה אישי
            </Link>
            <Link to="/settings" className={styles.menuButton}>
              הגדרות
            </Link>
          </div>
        </div>
      </div>
      <footer className={styles.footer}>
      © 2025 SmartStudy | כל הזכויות שמורות
      </footer>
    </>
  );
}

export default Homepage;