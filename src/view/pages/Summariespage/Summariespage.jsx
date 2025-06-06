import React, { useState } from 'react';
import { auth, db, storage } from '../../../firebase';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
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

  const handleUpload = () => {
    console.log('handleUpload נקרא');
    
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

    console.log('User:', user.uid);
    console.log('Storage config:', storage.app.options);
    console.log('Selected file:', selectedFile);

    const allowedTypes = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(selectedFile.type)) {
      alert('סוג קובץ לא נתמך. אנא בחרי PDF, Word או קובץ טקסט');
      return;
    }

    setIsUploading(true);

    const timestamp = Date.now();
    const fileName = `${timestamp}_${selectedFile.name}`;
    const storageRef = ref(storage, `summaries/${user.uid}/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(Math.floor(pct));
        console.log(`התקדמות העלאה: ${Math.floor(pct)}%`);
      },
      (error) => {
        console.error('שגיאה בהעלאה ל-Storage:', error);
        alert('אירעה שגיאה בהעלאה: ' + error.message);
        setIsUploading(false);
        setProgress(0);
      },
      async () => {
        try {
          console.log('העלאה הסתיימה, מקבל URL...');
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('URL התקבל:', downloadURL);
          
          const docData = {
            uid: user.uid,
            courseName: uploadCourseName.trim(),
            fileName: selectedFile.name,
            fileURL: downloadURL,
            uploadedAt: Timestamp.now(),
          };
          
          console.log('שומר ב-Firestore:', docData);
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
          
        } catch (fireErr) {
          console.error('שגיאה ב-Firestore:', fireErr);
          alert('הקובץ הועלה ל-Storage אך לא נשמר ב-Firestore: ' + fireErr.message);
          setIsUploading(false);
        }
      }
    );
  };

  const fetchSummariesByCourse = async () => {
    if (!searchCourseName.trim()) {
      alert('אנא הזיני שם קורס כדי לראות סיכומים');
      return;
    }
    
    try {
      console.log('מחפש סיכומים עבור קורס:', searchCourseName);
      const snapshot = await getDocs(collection(db, 'summaries'));
      console.log('נמצאו מסמכים:', snapshot.docs.length);
      
      const user = auth.currentUser;
      const filtered = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((s) => 
          s.courseName.toLowerCase().includes(searchCourseName.toLowerCase().trim()) &&
          s.uid === user?.uid
        );
      
      console.log('סיכומים מסוננים:', filtered);
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

            {/* כרטיס מרכזי לחיפוש וצפייה */}
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

            {/* לחצן הוספת סיכום חדש */}
            <button
              type="button"
              onClick={() => setShowUploadForm(!showUploadForm)}
              className={styles.addSummaryBtn}
            >
              הוסף סיכום חדש +
            </button>

            {/* טופס העלאה (מוצג רק כשלוחצים על הלחצן) */}
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