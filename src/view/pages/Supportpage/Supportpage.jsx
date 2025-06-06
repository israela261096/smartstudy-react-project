import { useState } from 'react';
import styles from './supportpage.module.css';
import Navbar from '../../components/Navbar/Navbar';

function SupportPage() {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.pageContainer}>
          <h2 className={styles.pageTitle}>מרכז העזרה</h2>

          <div className={styles.content}>
            {/* --- כרטיס FAQ --- */}
            <div className={styles.card}>
              <button
                className={styles.accordionHeader}
                onClick={() => toggleSection('faq')}
              >
                ❓ שאלות נפוצות
              </button>
              {openSection === 'faq' && (
                <div className={styles.accordionBody}>
                  <p>
                    <strong>איך נרשמים למערכת?</strong><br />
                    ממלאים את טופס ההרשמה עם מייל וסיסמה.
                  </p>
                  <p>
                    <strong>איך מעלים סיכום?</strong><br />
                    נכנסים לעמוד הסיכומים ולוחצים על העלאה.
                  </p>
                  <p>
                    <strong>איך מעדכנים פרטים?</strong><br />
                    בוחרים "הגדרות" בתפריט הראשי.
                  </p>
                </div>
              )}
            </div>

            {/* --- כרטיס מדריך שימוש --- */}
            <div className={styles.card}>
              <button
                className={styles.accordionHeader}
                onClick={() => toggleSection('guide')}
              >
                📘 מדריך שימוש
              </button>
              {openSection === 'guide' && (
                <div className={styles.accordionBody}>
                  <ol>
                    <li>
                      <strong>הרשמה:</strong> גשי לעמוד ההרשמה, מלאי את כל השדות ולחצי על "הירשם".
                    </li>
                    <li>
                      <strong>התחברות:</strong> הזיני את האימייל והסיסמה בעמוד ההתחברות.
                    </li>
                    <li>
                      <strong>כניסה ללוח הבקרה:</strong> לאחר התחברות תועברי לדף המרכזי עם כל המשימות והקורסים שלך.
                    </li>
                    <li>
                      <strong>העלאת סיכומים:</strong> עברי לעמוד "מאגר סיכומים", בחרי קובץ ולחצי על "העלה סיכום".
                    </li>
                    <li>
                      <strong>עדכון פרטים אישיים:</strong> תוכלי לשנות שם, אימייל או סיסמה דרך עמוד "הגדרות".
                    </li>
                    <li>
                      <strong>תמיכה טכנית:</strong> בעמוד זה ניתן לשלוח פנייה בעזרת כרטיס “יצירת קשר” שנמצא מתחת לכרטיס זה.
                    </li>
                  </ol>
                </div>
              )}
            </div>

            {/* --- כרטיס יצירת קשר --- */}
            <div className={styles.card}>
              <button
                className={styles.accordionHeader}
                onClick={() => toggleSection('contact')}
              >
                💬 יצירת קשר
              </button>
              {openSection === 'contact' && (
                <div className={styles.accordionBody}>
                  <form
                    className={styles.supportForm}
                    onSubmit={(e) => {
                      e.preventDefault();
                      // כאן אפשר לשלוח את המידע ל־API או לטפל בו לפי הצורך
                      alert('הפנייה נשלחה לצוות התמיכה. תודה!');
                    }}
                  >
                    <label className={styles.label}>בחר/י נושא הפנייה:</label>
                    <select className={styles.select} required>
                      <option value="" disabled>
                        בחר נושא...
                      </option>
                      <option value="bug">דיווח תקלה</option>
                      <option value="feature">פתיחת/ניהול פורום</option>
                      <option value="account">תמיכה טכנית כללית</option>
                      <option value="other">אחר</option>
                    </select>
                  
                    <label className={styles.label}>הודעה:</label>
                    <textarea
                      className={styles.textarea}
                      rows="4"
                      required
                      placeholder="כתוב/כתבי את ההודעה כאן"
                    ></textarea>

                    <button type="submit" className={styles.submitBtn}>
                      שלח/י פנייה
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- פוטר קבוע בתחתית --- */}
        <footer className={styles.footer}>
          © 2025 SmartStudy | כל הזכויות שמורות
        </footer>
      </div>
    </>
  );
}

export default SupportPage;