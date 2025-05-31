import React, { useState } from 'react';
import { useSocket } from '../../context/SocketContext';
import styles from './CreatePoll.module.css';

const CreatePoll = () => {
    const socket = useSocket();
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']);
    const [duration, setDuration] = useState(60);

    const handleOptionChange = (index, value) => {
        const updated = [...options];
        updated[index] = value;
        setOptions(updated);
    };

    const addOption = () => {
        if (options.length < 6) setOptions([...options, '']);
    };

    const removeOption = (index) => {
        if (options.length > 2) {
            const updated = options.filter((_, i) => i !== index);
            setOptions(updated);
        }
    };

    const sendPoll = () => {
        if (!question.trim() || options.some(opt => !opt.trim())) {
            alert('Please fill in the question and all options.');
            return;
        }

        const pollData = {
            question,
            options: options.filter(opt => opt.trim()),
            duration,
        };

        socket.emit('create_poll', pollData);
    };

    return (
        <div className={styles.pollCreator}>
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Enter your question</h2>
                <input
                    type="text"
                    className={styles.questionInput}
                    placeholder="Type your question here..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />
                <div className={styles.duration}>
                    <span>Duration:</span>
                    <input
                        type="number"
                        min="10"
                        max="300"
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className={styles.durationInput}
                    />
                    <span>seconds</span>
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Edit Options</h2>
                {options.map((opt, idx) => (
                    <div key={idx} className={styles.optionRow}>
                        <input
                            type="text"
                            className={styles.optionInput}
                            placeholder={`Option ${idx + 1}`}
                            value={opt}
                            onChange={(e) => handleOptionChange(idx, e.target.value)}
                        />
                        {options.length > 2 && (
                            <button
                                onClick={() => removeOption(idx)}
                                className={styles.removeButton}
                            >
                                ×
                            </button>
                        )}
                    </div>
                ))}
                {options.length < 4 && (
                    <button onClick={addOption} className={styles.addOptionButton}>
                        + Add More option
                    </button>
                )}
            </div>

            <button onClick={sendPoll} className={styles.submitButton}>
                Start Poll
            </button>
        </div>
    );
};

export default CreatePoll;
