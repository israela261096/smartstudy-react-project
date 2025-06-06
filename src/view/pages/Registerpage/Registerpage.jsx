import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebase';

import styles from './Registerpage.module.css';

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    idNumber: '',
    birthDate: '',
    email: '',
    password: '',
    confirmPassword: '',
    academicInstitution: '',
    degree: '',
    secretAnswer: '',
  });

  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg(''); // מאפס הודעות קודמות

    // 1. בדיקת התאמת סיסמאות
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('הסיסמאות לא תואמות. אנא וודאי שהזנת אותה סיסמה בשני השדות.');
      return;
    }

    // 2. ניקוי ה־email (trim + lowercase)
    const cleanEmail = formData.email.trim().toLowerCase();

    try {
      // 3. בדיקת קיומו של אימייל במערכת
      const methods = await fetchSignInMethodsForEmail(auth, cleanEmail);
      if (methods.length > 0) {
        // כבר קיים חשבון עם האימייל הזה → מנסים להתחבר במקום ליצור חדש
        try {
          await signInWithEmailAndPassword(auth, cleanEmail, formData.password);
          // כניסה הצליחה, מפנים לדף הבית
          navigate('/homepage');
          return;
        } catch (loginErr) {
          console.log('Login error:', loginErr.code);
          if (loginErr.code === 'auth/wrong-password') {
            setErrorMsg('הסיסמה שהזנת שגויה. נסי שוב.');
          } else {
            setErrorMsg(
              'אירעה שגיאה בכניסה לחשבון קיים. אם אין לך חשבון, נסי להשתמש באימייל אחר לרישום.'
            );
          }
          return;
        }
      }

      // 4. אם לא קיים חשבון כזה – יוצרים חשבון חדש
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        cleanEmail,
        formData.password
      );
      const user = userCredential.user;

      // 5. שמירת נתוני המשתמש ב־Firestore
      await setDoc(doc(db, 'users', user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        idNumber: formData.idNumber,
        birthDate: formData.birthDate,
        email: cleanEmail,
        academicInstitution: formData.academicInstitution,
        degree: formData.degree,
        secretAnswer: formData.secretAnswer,
      });

      // 6. אם הגעתם לכאן, ההרשמה הצליחה
      alert('ההרשמה הצליחה!');
      navigate('/homepage');
    } catch (error) {
      console.error('Registration error:', error.code);
      // 7. טיפול בשגיאות נוספות
      switch (error.code) {
        case 'auth/invalid-email':
          setErrorMsg('כתובת המייל אינה תקינה. אנא בדקי את הפורמט.');
          break;
        case 'auth/weak-password':
          setErrorMsg('הסיסמה חלשה מדי. יש להזין לפחות 6 תווים.');
          break;
        default:
          setErrorMsg('שגיאה ברישום. אנא נסי שוב במועד מאוחר יותר.');
      }
    }
  };

  return (
    <div className={styles.registerPage}>
      <header className={styles.header}>
              <h1 className={styles.logoText}>SmartStudy</h1>
              <span className={styles.circle}>S</span>
            </header>
      <div className={styles.formContainer}>
        <h2 className={styles.pageTitle}>
          אנא מלא/י את הפרטים הבאים על מנת להירשם למערכת
        </h2>

        {/* אם קיימת הודעת שגיאה – מציגים אותה כאן */}
        {errorMsg && <p className={styles.errorMessage}>{errorMsg}</p>}

        <form className={styles.registerForm} onSubmit={handleRegister}>
          <input
            name="firstName"
            type="text"
            placeholder="שם פרטי"
            value={formData.firstName}
            onChange={handleChange}
            required
          />

          <input
            name="lastName"
            type="text"
            placeholder="שם משפחה"
            value={formData.lastName}
            onChange={handleChange}
            required
          />

          <input
            name="idNumber"
            type="text"
            placeholder="מספר תעודת זהות"
            value={formData.idNumber}
            onChange={handleChange}
            required
          />

          <input
            name="birthDate"
            type="date"
            placeholder="תאריך לידה"
            value={formData.birthDate}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="אימייל"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="סיסמה"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            name="confirmPassword"
            type="password"
            placeholder="אימות סיסמה"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <select
            name="academicInstitution"
            value={formData.academicInstitution}
            onChange={handleChange}
            required
          >
            <option value="">בחר מוסד אקדמי</option>
            <option value="אוניברסיטת רייכמן">אוניברסיטת רייכמן</option>
            <option value="אוניברסיטת בר אילן">אוניברסיטת בר אילן</option>
            <option value="האוניברסיטה העברית">האוניברסיטה העברית</option>
            <option value="אוניברסיטת בן־גוריון">אוניברסיטת בן־גוריון</option>
            <option value="המרכז האקדמי פרס">המרכז האקדמי פרס</option>
            <option value="הקריה האקדמית אונו">הקריה האקדמית אונו</option>
            <option value="אפקה">אפקה</option>
          </select>

          <select
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            required
          >
            <option value="">בחר תואר</option>
            <option value="מנהל עסקים ומערכות מידע">
              מנהל עסקים ומערכות מידע
            </option>
            <option value="מדעי המחשב">מדעי המחשב</option>
            <option value="פסיכולוגיה">פסיכולוגיה</option>
            <option value="חשבונאות">חשבונאות</option>
          </select>

          {/* אם תרצי להוסיף שדה תשובה סודית, תוכלי להפעיל את הקטע הזה */}
          {/* <input
            name="secretAnswer"
            type="text"
            placeholder="תשובת אבטחה"
            value={formData.secretAnswer}
            onChange={handleChange}
          /> */}

          <button type="submit" className={styles.registerButton}>
            הירשם
          </button>
        </form>
      </div>

      <footer className={styles.footer}>
        © 2025 SmartStudy | כל הזכויות שמורות
      </footer>
    </div>
  );
}

export default RegisterPage;