import React from 'react';
import { useNavigate } from 'react-router-dom';
import { updateEmail, updatePassword, signOut } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebase';

import styles from './settingspage.module.css';
import Navbar from '../../components/Navbar/Navbar';

function Settingspage() {
  const navigate = useNavigate();

  const handleUpdateName = async () => {
    const user = auth.currentUser;
    if (!user) return alert('אין משתמש מחובר');
    
    const newName = prompt("הכנס שם חדש:");
    if (!newName) return;

    try {
      await updateDoc(doc(db, "users", user.uid), {
        firstName: newName
      });
      alert("השם עודכן בהצלחה!");
    } catch (error) {
      alert("שגיאה בעדכון השם: " + error.message);
    }
  };

  const handleUpdatePassword = async () => {
    const user = auth.currentUser;
    if (!user) return alert('אין משתמש מחובר');

    const newPassword = prompt("הכנס סיסמה חדשה:");
    if (!newPassword) return;

    try {
      await updatePassword(user, newPassword);
      alert("הסיסמה עודכנה בהצלחה!");
    } catch (error) {
      alert("שגיאה בעדכון הסיסמה: " + error.message);
    }
  };

  const handleUpdateEmail = async () => {
    const user = auth.currentUser;
    if (!user) return alert('אין משתמש מחובר');

    const newEmail = prompt("הכנס אימייל חדש:");
    if (!newEmail) return;

    try {
      await updateEmail(user, newEmail);
      await updateDoc(doc(db, "users", user.uid), {
        email: newEmail
      });
      alert("האימייל עודכן בהצלחה!");
    } catch (error) {
      alert("שגיאה בעדכון האימייל: " + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/loginpage");
    } catch (error) {
      alert("שגיאה ביציאה מהמערכת: " + error.message);
    }
  };

  return (
    <>
    <div>
      <Navbar />
      <div className={styles.settingsPage}>

        <div className={styles.settingsCard}>
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>פרטים אישיים:</h4>
            <button className={styles.settingsButton} onClick={handleUpdateName}>עדכון שם מלא</button>
            <button className={styles.settingsButton} onClick={handleUpdatePassword}>עדכון סיסמה</button>
            <button className={styles.settingsButton} onClick={handleUpdateEmail}>עדכון אימייל</button>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>ניהול חשבון:</h4>
            <button className={styles.settingsButton} onClick={handleLogout}>יציאה מהמערכת</button>
          </div>
        </div>
      </div>
        <footer className={styles.footer}>
      © 2025 SmartStudy | כל הזכויות שמורות
      </footer>
    </div>
      </>
  );
}

export default Settingspage;