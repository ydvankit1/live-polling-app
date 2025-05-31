import styles from './AnswerPoll.module.css';
import React, { useEffect, useState, useContext } from 'react';
const AnswerPoll = ({ question, onAnswer }) => {
    const [selectedOption, setSelectedOption] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(question?.duration || 60);

    useEffect(() => {
        console.log("✅ Question received in AnswerPoll:", question);
        setTimeLeft(question?.duration || 60);
    }, [question]);

    useEffect(() => {
        let timer;
        if (!submitted && timeLeft > 0) {
            console.log("⏳ Starting countdown timer for poll...");
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        console.log("Time is up! Automatically submitting answer...");
                        if (selectedOption) {
                            onAnswer(selectedOption);
                        } else {
                            console.log("⛔ Skipped answer - no option selected");
                        }
                        setSubmitted(true); // timeout
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [submitted, timeLeft, selectedOption, onAnswer]);

    const handleSubmit = () => {
        if (!selectedOption) return alert('Please select an option');

        onAnswer(selectedOption); // Submit via parent
        setSubmitted(true);
    };

    if (!question) return <div className={styles.noQuestion}>No question yet.</div>;

    if (submitted) return <div className={styles.submittedMessage}>Answer submitted! Waiting for results...</div>;

    return (
        <div className={styles.pollContainer}>
            <div className={styles.pollHeader}>
                <h3 className={styles.question}>{question.question}</h3>
                <div className={styles.timer}>
                    ⏱️ {timeLeft} seconds remaining
                </div>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className={styles.optionsForm}>
                {question.options.map((opt, index) => (
                    <label key={index} className={styles.optionLabel}>
                        <input
                            type="radio"
                            name="option"
                            value={opt}
                            checked={selectedOption === opt}
                            onChange={() => setSelectedOption(opt)}
                            className={styles.optionInput}
                        />
                        <span className={styles.optionText}>{opt}</span>
                    </label>
                ))}
                <button
                    type="submit"
                    onClick={handleSubmit}
                    className={styles.submitButton}
                    disabled={!selectedOption}
                >
                    Submit Answer
                </button>
            </form>
        </div>
    );
};

export default AnswerPoll;
