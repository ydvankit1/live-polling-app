import React, { useState } from 'react';
import styles from './NamePrompt.module.css';

const NamePrompt = ({ setName }) => {
    const [inputName, setInputName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputName.trim()) {
            setName(inputName.trim());
        }
    };

    return (
        <div className={styles.namePromptContainer}>
            <div className={styles.namePromptCard}>
                <h2>Welcome to Live Poll</h2>
                <p>Please enter your name to participate</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={inputName}
                        onChange={(e) => setInputName(e.target.value)}
                        placeholder="Your name"
                        className={styles.nameInput}
                        required
                        autoFocus
                    />
                    <button type="submit" className={styles.submitButton}>
                        Continue
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NamePrompt;