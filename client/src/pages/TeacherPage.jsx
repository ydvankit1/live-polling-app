import React, { useState, useEffect, useContext } from 'react';
import CreatePoll from '../components/Teacher/CreatePoll';
import PollResults from '../components/Teacher/PollResults';
import { useSocket } from '../context/SocketContext';
import styles from './TeacherPage.module.css';

const TeacherPage = () => {
    const socket = useSocket();
    const [poll, setPoll] = useState(null);
    const [results, setResults] = useState({});

    useEffect(() => {
        socket.on('poll_started', (pollData) => {
            setPoll(pollData);
            const initialResults = {};
            pollData.options.forEach(opt => (initialResults[opt] = 0));
            setResults(initialResults);
        });

        socket.on('poll_vote', (vote) => {
            setResults(prev => ({
                ...prev,
                [vote]: (prev[vote] || 0) + 1
            }));
        });

        socket.on('poll_ended', () => {
            setPoll(null);
            setResults({});
        });

        return () => {
            socket.off('poll_started');
            socket.off('poll_ended');
            socket.off('poll_vote');
        };
    }, [socket]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Let's Get Started</h1>
                <p className={styles.subtitle}>
                    You'll have the ability to create and manage polls, ask questions,
                    and monitor your students' responses in real-time.
                </p>
            </div>

            {!poll ? (
                <CreatePoll />
            ) : (
                <div className={styles.activePollNotice}>
                    <PollResults poll={poll} results={results} />
                </div>
            )}
        </div>
    );
};

export default TeacherPage;