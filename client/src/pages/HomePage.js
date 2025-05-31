import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>Welcome to the Live Polling System</h1>
                <p className={styles.subtitle}>
                    Please select the role that best describes you to begin using the live polling system
                </p>

                <div className={styles.roleCards}>
                    <div className={styles.card} onClick={() => navigate('/student')}>
                        <h3 className={styles.cardTitle}>I'm a Student</h3>
                        <p className={styles.cardDescription}>
                            Submit answers and view live poll results in real-time.
                        </p>
                        <div className={styles.cardFooter}>Continue</div>
                    </div>

                    <div className={styles.card} onClick={() => navigate('/teacher')}>
                        <h3 className={styles.cardTitle}>I'm a Teacher</h3>
                        <p className={styles.cardDescription}>
                            Create polls and monitor live results from your students.
                        </p>
                        <div className={styles.cardFooter}>Continue</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;