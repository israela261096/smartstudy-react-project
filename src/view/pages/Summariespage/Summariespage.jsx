import React, { useState } from 'react';
import { auth, db } from '../../../firebase';
import { collection, addDoc, Timestamp, getDocs } from 'firebase/firestore';
import Navbar from '../../components/Navbar/Navbar';
import styles from './SummariesPage.module.css';

function SummariesPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadCourseName, setUploadCourseName] = useState('');
  const [searchCourseName, setSearchCourseName] = useState('');
  const [progress, setProgress] = useState(0);
  const [fetchedSummaries, setFetchedSummaries] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0] || null);
    setProgress(0);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('אנא בחרי קובץ');
      return;
    }

    if (!uploadCourseName.trim()) {
      alert('אנא הזיני שם קורס');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert('אין משתמש מחובר - אנא התחברי מחדש');
      return;
    }

    const allowedTypes = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(selectedFile.type)) {
      alert('סוג קובץ לא נתמך. אנא בחרי PDF, Word או קובץ טקסט');
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("upload_preset", "smartstudy_uploads");

      const res = await fetch("https://api.cloudinary.com/v1_1/dpubtxvqb/auto/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!data.secure_url) throw new Error("העלאה נכשלה");

      const downloadURL = data.secure_url;

      const docData = {
        uid: user.uid,
        courseName: uploadCourseName.trim(),
        fileName: selectedFile.name,
        fileURL: downloadURL,
        uploadedAt: Timestamp.now(),
      };

      await addDoc(collection(db, 'summaries'), docData);

      alert(`הקובץ "${selectedFile.name}" הועלה ונשמר בהצלחה ✅`);
      setSelectedFile(null);
      setUploadCourseName('');
      setProgress(0);
      setIsUploading(false);
      setShowUploadForm(false);

      if (searchCourseName.trim() === uploadCourseName.trim()) {
        fetchSummariesByCourse();
      }

    } catch (error) {
      console.error('שגיאה בהעלאה:', error);
      alert('אירעה שגיאה בהעלאה: ' + error.message);
      setIsUploading(false);
    }
  };

  const fetchSummariesByCourse = async () => {
    if (!searchCourseName.trim()) {
      alert('אנא הזיני שם קורס כדי לראות סיכומים');
      return;
    }

    try {
      const snapshot = await getDocs(collection(db, 'summaries'));
      const user = auth.currentUser;
      const filtered = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((s) =>
          s.courseName.toLowerCase().includes(searchCourseName.toLowerCase().trim()) &&
          s.uid === user?.uid
        );

      setFetchedSummaries(filtered);

    } catch (err) {
      console.error('שגיאה בשליפת סיכומים:', err);
      alert('אירעה שגיאה בשליפת סיכומים: ' + err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.pageContainer}>
          <div className={styles.content}>
            <h2 className={styles.pageTitle}>מאגר סיכומים</h2>

            <div className={styles.mainCard}>
              <div className={styles.cardIcon}>📄</div>
              <h3 className={styles.cardTitle}>צפייה בסיכומים לפי קורס</h3>
              <p className={styles.cardSubtitle}>ניתוח נתונים, סטטיסטיקה, ניהול פרויקטים</p>

              <div className={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="הקלד את שם הקורס"
                  value={searchCourseName}
                  onChange={(e) => setSearchCourseName(e.target.value)}
                  className={styles.searchInput}
                />
                <button
                  type="button"
                  onClick={fetchSummariesByCourse}
                  className={styles.searchBtn}
                >
                  חפש סיכומים לפי קורס 🔍
                </button>
              </div>

              {fetchedSummaries.length > 0 && (
                <div className={styles.summariesResults}>
                  <ul className={styles.summariesList}>
                    {fetchedSummaries.map((s) => (
                      <li key={s.id} className={styles.summaryItem}>
                        <div className={styles.summaryInfo}>
                          <strong>{s.fileName}</strong>
                          <span className={styles.uploadDate}>
                            הועלה בתאריך {s.uploadedAt?.toDate().toLocaleDateString() || 'לא זמין'}
                          </span>
                        </div>
                        {s.fileURL && (
                          <a 
                            href={s.fileURL} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={styles.downloadLink}
                          >
                            הורד 📥
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {searchCourseName && fetchedSummaries.length === 0 && (
                <p className={styles.noSummaries}>
                  לא נמצאו סיכומים עבור קורס "{searchCourseName}".
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowUploadForm(!showUploadForm)}
              className={styles.addSummaryBtn}
            >
              הוסף סיכום חדש +
            </button>

            {showUploadForm && (
              <div className={styles.uploadForm}>
                <h3>העלה סיכום חדש ➕</h3>
                <input
                  type="text"
                  placeholder="הקלד את שם הקורס"
                  value={uploadCourseName}
                  onChange={(e) => setUploadCourseName(e.target.value)}
                  className={styles.inputField}
                  disabled={isUploading}
                />
                <input
                  type="file"
                  onChange={handleFileChange}
                  className={styles.fileInput}
                  accept=".pdf,.doc,.docx,.txt"
                  disabled={isUploading}
                />
                {selectedFile && (
                  <p className={styles.selectedFileText}>
                    קובץ נבחר: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
                {progress > 0 && (
                  <p className={styles.progressText}>
                    התקדמות: {progress}%
                  </p>
                )}
                <div className={styles.uploadActions}>
                  <button
                    type="button"
                    onClick={handleUpload}
                    className={styles.uploadBtn}
                    disabled={isUploading || !selectedFile || !uploadCourseName.trim()}
                  >
                    {isUploading ? 'מעלה...' : 'העלה קובץ ➕'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUploadForm(false)}
                    className={styles.cancelBtn}
                    disabled={isUploading}
                  >
                    ביטול
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <footer className={styles.footer}>
        © 2025 SmartStudy | כל הזכויות שמורות
      </footer>
    </>
  );
}

export default SummariesPage;
