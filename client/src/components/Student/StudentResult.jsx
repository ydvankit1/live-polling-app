import React, { useEffect, useState, useContext } from 'react';
import { useSocket } from '../../context/SocketContext';
import styles from './StudentResult.module.css';

const StudentResult = () => {
    const socket = useSocket();
    const [resultData, setResultData] = useState(null);

    useEffect(() => {
        socket.on('poll_results', (data) => {
            console.log("📊 Received poll results:", data);
            setResultData(data);
        });

        // Cleanup on unmount
        return () => {
            socket.off('poll_results');
        };
    }, [socket]);

    if (!resultData || !resultData.results || typeof resultData.results !== 'object') {
        return <div className={styles.loadingResults}>Waiting for poll results...</div>;
    }

    const { question, results } = resultData;

    const totalVotes = Object.values(resultData.results).reduce((sum, count) => sum + count, 0);

    return (
        <div className={styles.resultsContainer}>
            <h3 className={styles.resultsTitle}>Poll Results</h3>
            <div className={styles.questionCard}>
                <h4 className={styles.question}>{resultData.question}</h4>
            </div>
            <ul className={styles.resultsList}>
                {Object.entries(resultData.results).map(([option, votes]) => {
                    const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
                    return (
                        <li key={option} className={styles.resultItem}>
                            <div className={styles.optionInfo}>
                                <span className={styles.optionText}>{option}</span>
                                <span className={styles.voteCount}>{votes} vote{votes !== 1 ? 's' : ''}</span>
                            </div>
                            <div className={styles.progressContainer}>
                                <div
                                    className={styles.progressBar}
                                    style={{ width: `${percentage}%` }}
                                ></div>
                                <span className={styles.percentage}>{percentage}%</span>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default StudentResult;
