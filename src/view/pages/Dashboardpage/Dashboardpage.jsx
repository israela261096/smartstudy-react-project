import styles from './Dashboardpage.module.css';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';

function Dashboardpage() {
  return (
    <>
    <header className={styles.header}>
  SmartStudy <span className={styles.circle}>S</span>
</header>
  <Navbar />
  <div>לוח בקרה</div>
    </>
  );
}

export default Dashboardpage;
