import styles from './summariespage.module.css';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';


function Summariespage() {
    return (
      <div>
        <Navbar />
        <h1>עמוד סיכומים</h1>
      </div>
    );
  }
  
  export default Summariespage;