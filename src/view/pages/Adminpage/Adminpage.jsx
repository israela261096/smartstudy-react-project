import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import Navbar from '../../components/Navbar/Navbar';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';

import styles from './AdminPage.module.css';

// צבעים לגרף העוגה של התארים
const DEGREE_COLORS = ['#7F3DFF', '#FF6B6B', '#4ECDC4', '#FFA600', '#0088FE'];

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [summariesCount, setSummariesCount] = useState(0);
  const [supportRequestsCount, setSupportRequestsCount] = useState(0);
  const [degreeData, setDegreeData] = useState([]); // חלוקת משתמשים לפי תואר
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchSummaries();
    fetchSupportRequests();
  }, []);

  // שולף את כל המשתמשים
  const fetchUsers = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      const list = snapshot.docs.map(d => ({ uid: d.id, ...d.data() }));
      setUsers(list);

      // מחשב חלוקת משתמשים לפי תואר
      const countsByDegree = {};
      list.forEach(user => {
        const deg = user.degree || 'לא מוגדר';
        countsByDegree[deg] = (countsByDegree[deg] || 0) + 1;
      });
      setDegreeData(
        Object.entries(countsByDegree).map(([name, value]) => ({ name, value }))
      );
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  // שולף את כל הסיכומים
  const fetchSummaries = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'summaries'));
      setSummariesCount(snapshot.size);
    } catch (err) {
      console.error('Error fetching summaries:', err);
    }
  };

  // שולף את פניות התמיכה
  const fetchSupportRequests = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'supportRequests'));
      setSupportRequestsCount(snapshot.size);
    } catch (err) {
      console.error('Error fetching support requests:', err);
    }
  };

  // מחיקת משתמש
  const deleteUser = async uid => {
    try {
      await deleteDoc(doc(db, 'users', uid));
      setUsers(prev => prev.filter(u => u.uid !== uid));
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  // מתג Admin
  const toggleAdmin = async (uid, current) => {
    try {
      const ref = doc(db, 'users', uid);
      await updateDoc(ref, { isAdmin: !current });
      setUsers(prev =>
        prev.map(u => (u.uid === uid ? { ...u, isAdmin: !current } : u))
      );
    } catch (err) {
      console.error('Error toggling admin:', err);
    }
  };

  // סינון לפי חיפוש
  const filtered = users.filter(
    u =>
      u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUsers = users.length;

  // נתונים לגרף העמודות
  const barData = [
    { name: 'משתמשים', value: totalUsers },
    { name: 'סיכומים', value: summariesCount },
    { name: 'פניות תמיכה', value: supportRequestsCount },
  ];

  return (
    <>
      <Navbar />
      <div className={styles.adminContainer}>
        <h2 className={styles.pageTitle}>ניהול המערכת</h2>

        <div className={styles.adminContent}>
          {/* ===== גרפים ===== */}
          <div className={styles.charts}>
            {/* סיכום כללי */}
            <div className={styles.chartBox}>
              <h3 className={styles.chartTitle}>סיכום כללי</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={barData}
                  margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" name="כמות" barSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* חלוקת תארים */}
            <div className={styles.chartBox}>
              <h3 className={styles.chartTitle}>חלוקת תארים</h3>
              <ResponsiveContainer width="100%" height={270}>
                <PieChart>
                  <Pie
                    data={degreeData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {degreeData.map((entry, idx) => (
                      <Cell
                        key={entry.name}
                        fill={DEGREE_COLORS[idx % DEGREE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ===== כפתורים מתחת לגרפים ===== */}
          <div className={styles.actions}>
            <button className={styles.actionBtn}>
              סה״כ משתמשים: {totalUsers}
            </button>
            <button className={styles.actionBtn}>
              סיכומים: {summariesCount}
            </button>
            <button className={styles.actionBtn}>
              פוסטים בפורומים
            </button>
            <button className={styles.actionBtn}>
              פניות לתמיכה: {supportRequestsCount}
            </button>
          </div>
        </div>

        {/* ===== טבלת ניהול ===== */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>👥 ניהול משתמשים</h3>
          <input
            type="text"
            placeholder="חיפוש לפי אימייל או שם מלא"
            className={styles.searchInput}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />

          <table className={styles.usersTable}>
            <thead>
              <tr>
                <th>UID</th>
                <th>שם מלא</th>
                <th>אימייל</th>
                <th>Admin</th>
                <th>מחיקה</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => (
                <tr key={user.uid}>
                  <td>{user.uid}</td>
                  <td>
                    {user.fullName ||
                      user.displayName ||
                      (user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : 'לא הוגדר')}
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <button
                      className={styles.toggleBtn}
                      onClick={() => toggleAdmin(user.uid, user.isAdmin)}
                    >
                      {user.isAdmin ? 'הסר Admin' : 'הפוך ל־Admin'}
                    </button>
                  </td>
                  <td>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => deleteUser(user.uid)}
                    >
                      מחיקה
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <footer className={styles.footer}>
        © 2025 SmartStudy | כל הזכויות שמורות
      </footer>
    </>
  );
}

export default AdminPage;