import { useState } from 'react';
import styles from './Forumspage.module.css';

function Forumspage() {
  const [activeSection, setActiveSection] = useState(null);

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  return (
    <>
    <div className={styles.page}>
      <h2 className={styles.pageTitle}>פורומים</h2>
      <p className={styles.description}>כאן ניתן להתייעץ עם סטודנטים אחרים, לשאול שאלות, לשתף סיכומים או טיפים ללמידה.</p>

      <div className={styles.grid}>
        <button onClick={() => handleSectionClick('tips')}>🗨️ טיפים למבחנים</button>
        <button onClick={() => handleSectionClick('questions')}>🔍 שאלות כלליות על קורסים</button>
        <button onClick={() => handleSectionClick('partners')}>📚 חיפוש שותפים ללמידה</button>
        <button onClick={() => handleSectionClick('support')}>🛠️ בעיות טכניות / תמיכה</button>
        <button onClick={() => handleSectionClick('create')}>📝 יצירת פוסט חדש</button>
        <button onClick={() => handleSectionClick('search')}>🔎 חיפוש בפורום</button>
      </div>
      
      <div className={styles.content}>
        {activeSection === 'tips' && <p>💡 כאן יוצגו פוסטים של טיפים למבחנים...</p>}
        {activeSection === 'questions' && <p>📘 שאלות כלליות על קורסים (תוכן כאן)...</p>}
        {activeSection === 'partners' && <p>🤝 שותפים ללמידה (רשימה/טופס)...</p>}
        {activeSection === 'support' && <p>🛠️ בעיות טכניות – ניתן גם לקשר לעמוד התמיכה</p>}
        {activeSection === 'search' && (
          <div>
            <input type="text" placeholder="הקלד מילת חיפוש..." />
          </div>
        )}
        {activeSection === 'create' && (
          <form className={styles.postForm} onSubmit={(e) => {
            e.preventDefault();
            alert("הפוסט נשלח (מדומה)");
          }}>
            <input type="text" placeholder="כותרת הפוסט" required />
            <textarea placeholder="תוכן הפוסט" rows={4} required />
            <select required>
              <option value="">בחר קטגוריה</option>
              <option value="tips">טיפים</option>
              <option value="questions">שאלות</option>
              <option value="partners">שותפים</option>
              <option value="support">תמיכה</option>
            </select>
            <button type="submit">שלח פוסט</button>
          </form>
        )}
      </div>
    </div>
    <footer className={styles.footer}>
            © 2025 SmartStudy | כל הזכויות שמורות
          </footer>
    </>
  );
}

export default Forumspage;