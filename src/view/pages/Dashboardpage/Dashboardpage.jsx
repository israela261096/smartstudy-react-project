import { useEffect, useState } from 'react';
import styles from './DashboardPage.module.css';
import Navbar from '../../components/Navbar/Navbar';
import { auth } from "../../../firebase";

function DashboardPage() {
  const [studentName, setStudentName] = useState("");

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setStudentName(user.displayName || "סטודנט");
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.container}>
          <h2 className={styles.welcome}>לוח הבקרה אישי שלך</h2>

          <div className={styles.grid}>
            <div className={styles.card}>
              <h3>📋 המשימה שלך היום</h3>
              <p>להשלים את תרגול הקריאה בקורס סטטיסטיקה</p>
            </div>

            <div className={styles.card}>
              <h3>🎓 הקורסים שלי</h3>
              <ul>
                <li>ניהול מערכות מידע</li>
                <li>CRM וניתוח עסקי</li>
                <li>פייתון לניתוח נתונים</li>
              </ul>
            </div>

            <div className={styles.card}>
              <h3>📌 התקדמות אישית</h3>
              <p>12 מתוך 18 משימות הושלמו</p>
              <p>4 סיכומים הוגשו</p>
            </div>

            <div className={styles.card}>
              <h3>🧠 סיכומים אחרונים</h3>
              <ul>
                <li>ניהול פרויקטים - שיעור 5</li>
                <li>ERP - מדריך מעשי</li>
              </ul>
            </div>

            <div className={styles.card}>
              <h3>🔔 התראות</h3>
              <ul>
                <li>מחר הגשה בקורס CRM</li>
                <li>תגובה חדשה בפורום שלך</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <footer className={styles.footer}>
            © 2025 SmartStudy | כל הזכויות שמורות
          </footer>
    </>
  );
}

export default DashboardPage;