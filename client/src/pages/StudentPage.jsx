import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { useSocket } from '../context/SocketContext';
import AnswerPoll from '../components/Student/AnswerPoll';
import StudentResult from '../components/Student/StudentResult';
import styles from './StudentPage.module.css';

const StudentPage = () => {
    const { name, setName } = useUser();
    const socket = useSocket();

    const [pollActive, setPollActive] = useState(false);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [timeUp, setTimeUp] = useState(false);
    const [question, setQuestion] = useState(null);

    // Prompt for student name after component mounts
    useEffect(() => {
        if (!name) {
            const inputName = prompt('Enter your name:');
            if (inputName) {
                console.log("Student entered name:", inputName);
                setName(inputName);
            }
        }
    }, [name, setName]);

    console.log("Listening for new_poll event and poll started...");
    // Listen for poll question from teacher

    useEffect(() => {
        if (!socket) {
            console.warn("Socket not initialized.");
            return;
        }

        const handlePoll = (data) => {
            console.log("🔥 Poll received on student side:", data);
            setPollActive(true);
            setHasAnswered(false);
            setTimeUp(false);
            setQuestion(data);
            startTimer();
        };
        socket.on('poll_started', handlePoll);
        socket.on('new_poll', handlePoll); // ✅ Handle both

        return () => {
            socket.off('poll_started', handlePoll);
            socket.off('new_poll', handlePoll); // ✅ Clean up both
        };
    }, [socket]);

    // Request current poll if student joins late
    useEffect(() => {
        if (socket && name) {
            console.log("📡 Requesting current poll from server...");
            socket.emit('get_current_poll');
        }
    }, [socket, name]);


    const startTimer = () => {
        console.log("Starting 60-second timer...");
        setTimeout(() => {
            console.log("Time is up!");
            setTimeUp(true);
        }, 60000); // 60 seconds
    };

    const handleAnswer = (option) => {
        if (!question || !name) return;
        console.log("Submitting answer:", { name, questionId: question.id, option });
        socket.emit('submit_answer', {
            name,
            questionId: question.id,
            option,
        });

        setHasAnswered(true);
    };

    if (!name) {
        return <div className={styles.nameRequired}>Name is required to participate in the poll.</div>;
    }

    // Show AnswerPoll if question is active and student hasn’t answered & time isn’t up
    if (pollActive && !hasAnswered && !timeUp) {
        return <AnswerPoll question={question} onAnswer={handleAnswer} />;
    }

    // Show results after answer or timeout
    if (hasAnswered || timeUp) {
        return <StudentResult />;
    }
    return (
        <div className={styles.waitingContainer}>
            <h2 className={styles.welcomeMessage}>Welcome, {name}!</h2>
            <div className={styles.waitingCard}>
                <p>Waiting for poll...</p>
                <p>No active poll at the moment.</p>
                <p>When your teacher starts a poll, it will appear here automatically.</p>
            </div>
        </div>
    );
};

export default StudentPage;
