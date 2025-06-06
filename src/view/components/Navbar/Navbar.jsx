import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { auth, db } from '../../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';
import styles from './Navbar.module.css';

function Navbar() {
  const [user] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }

    const checkAdminFlag = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().isAdmin === true) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error('שגיאה בשליפת שדה isAdmin:', err);
        setIsAdmin(false);
      }
    };

    checkAdminFlag();
  }, [user]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (err) {
      console.error('שגיאה בעת התנתקות:', err);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo} onClick={() => navigate('/homepage')}>
        SmartStudy
        <span className={styles.circle}>S</span>
      </div>

      <div className={styles.navLinks}>
        <NavLink
          to="/homepage"
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
        >
          דף הבית
        </NavLink>

        <NavLink
          to="/summaries"
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
        >
          הסיכומים שלי
        </NavLink>

        <NavLink
          to="/support"
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
        >
          תמיכה
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
        >
          הגדרות
        </NavLink>

        <NavLink
          to="/forums"
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
        >
          פורומים
        </NavLink>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
        >
          לוח בקרה אישי
        </NavLink>

        <NavLink
  to="/Adminpage"
  className={({ isActive }) =>
    isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
  }
>
  ניהול המערכת
</NavLink>

        

        {user && isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            לוח ניהול
          </NavLink>
        )}

        {!user ? (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            התנתק
          </NavLink>
        ) : (
          <button className={styles.logoutButton} onClick={handleLogout}>
            התנתק
          </button>
        )}
      </div>
    </nav> 
  );
}

export default Navbar;