import styles from "./Navbar.module.css";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className={styles.navbar}>
      <div className={styles.logo}>
        <span className={styles.circle}>S</span> SmartStudy
      </div>

      <div className={styles.links}>
        <Link to="/homepage">דף הבית</Link>
        <Link to="/taskspage">רשימת משימות</Link>
        <Link to="/summariespage">הסיכומים שלי</Link>
        <Link to="/supportpage">תמיכה</Link>
        <Link to="/forumspage">פורומים</Link>
        <Link to="/profilepage">האזור האישי שלי</Link>
        <Link to="/loginpage">התנתקות</Link>
        <Link to="/registerpage">עמוד הרשמה</Link>
        <Link to="/adminpage">ניהול המערכת</Link>
        <Link to="/settingspage">הגדרות</Link>
      </div>
    </div>
  );
}

export default Navbar;