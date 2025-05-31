import styles from './PollResults.module.css';

const PollResults = ({ poll, results }) => {
    if (!poll) {
        return null;
    }

    // Calculate total votes for percentage calculations
    const totalVotes = Object.values(results).reduce((sum, count) => sum + count, 0);

    return (
        <div className={styles.resultsContainer}>
            <h2 className={styles.resultsTitle}>Live Poll Results</h2>
            <div className={styles.questionCard}>
                <h3 className={styles.questionText}>{poll.question}</h3>
                <div className={styles.timerBadge}>
                    <span className={styles.timerIcon}>⏱️</span>
                    {poll.duration}s
                </div>
            </div>

            <div className={styles.optionsGrid}>
                {poll.options.map((opt, idx) => {
                    const votes = results[opt] || 0;
                    const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

                    return (
                        <div key={idx} className={styles.optionCard}>
                            <div className={styles.optionHeader}>
                                <span className={styles.optionText}>{opt}</span>
                                <span className={styles.voteCount}>{votes} vote{votes !== 1 ? 's' : ''}</span>
                            </div>
                            <div className={styles.progressBarContainer}>
                                <div
                                    className={styles.progressBar}
                                    style={{ width: `${percentage}%` }}
                                ></div>
                                <span className={styles.percentage}>{percentage}%</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PollResults;