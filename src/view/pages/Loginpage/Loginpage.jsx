import Navbar from '../../components/Navbar/Navbar';
import styles from './Loginpage.module.css';

function LoginPage() {
  return (
    <>
      <Navbar />
      <div className={styles.pageContent}>
        <h2 className={styles.title}>הלמידה שלך, תחת השליטה שלך</h2>

        <form className={styles.loginForm}>
          <label>אימייל משתמש:</label>
          <input type="text" />

          <label>סיסמה:</label>
          <input type="password" />

          <button type="submit">התחבר</button>
        </form>

        <p className={styles.registerText}>
          אין לך חשבון? <a href="/registerpage">הירשם</a>
        </p>
      </div>
    </>
  );
}

export default LoginPage;
