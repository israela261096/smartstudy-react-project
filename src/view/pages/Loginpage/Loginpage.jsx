import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";
import styles from "./Loginpage.module.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const cleanEmail = email.trim().toLowerCase();
      await signInWithEmailAndPassword(auth, cleanEmail, password);
      navigate("/homepage");
    } catch (err) {
      console.error("שגיאה בהתחברות:", err.code, err.message);

      // במקרה ש־err.code הוא auth/invalid-credential, נציג הודעה מותאמת:
      if (err.code.includes("invalid-credential")) {
        setErrorMsg("אימייל או סיסמה שגויים. אנא נסי שוב.");
      } 
      // אם המשתמש לא קיים (אימייל לא נמצא)
      else if (err.code.includes("user-not-found")) {
        setErrorMsg("לא נמצא משתמש עם אימייל זה. אנא הירשמי קודם.");
      } 
      // סיסמה שגויה (כשיש משתמש תקין אבל הסיסמה שגויה)
      else if (err.code.includes("wrong-password")) {
        setErrorMsg("הסיסמה שגויה. אנא נסי שנית.");
      } 
      // אימייל לא תקין מבחינת תבנית
      else if (err.code.includes("invalid-email")) {
        setErrorMsg("כתובת מייל לא תקינה. אנא בדקי שוב.");
      } 
      // במקרה של יותר מדי ניסיונות
      else if (err.code.includes("too-many-requests")) {
        setErrorMsg("יותר מדי ניסיונות התחברות. אנא נסי מאוחר יותר.");
      } 
      // ברירת מחדל – הודעה כללית
      else {
        setErrorMsg("אירעה שגיאה בהתחברות. אנא נסי שוב.");
      }
    }
  };

  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.logoText}>SmartStudy</h1>
        <span className={styles.circle}>S</span>
      </header>

      <div className={styles.loginPageContainer}>
        <div className={styles.loginCard}>
          <h2 className={styles.loginTitle}>התחבר למערכת</h2>

          {/* הצגת הודעת שגיאה אם קיימת */}
          {errorMsg && <p className={styles.errorMessage}>{errorMsg}</p>}

          <form onSubmit={handleLogin} className={styles.loginForm}>
            <label htmlFor="email">אימייל:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.inputField}
            />

            <label htmlFor="password">סיסמה:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.inputField}
            />

            <button type="submit" className={styles.loginButton}>
              התחבר
            </button>
          </form>

          <p className={styles.registerLink}>
            אין לך חשבון?&nbsp;
            <NavLink to="/register" className={styles.navLink}>
              הירשמי כאן
            </NavLink>
          </p>
        </div>
      </div>
    </>
  );
}

export default LoginPage;