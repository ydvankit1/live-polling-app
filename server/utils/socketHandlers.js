
const PollManager = require('../controllers/pollSingleton');

const activeConnections = {}; // socket.id => studentId

const socketHandlers = (io) => {
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on('register', ({ studentId }) => {
            console.log(`Registering student: ${studentId} with socket ID: ${socket.id}`);
            activeConnections[socket.id] = studentId;
        });

        socket.on('create_poll', ({ question, options, maxTime }) => {
            const { success, poll, error } = PollManager.createPoll(question, options, maxTime);

            if (!success) {
                socket.emit('poll_creation_failed', { error });
                return;
            }

            console.log("📢 Poll created and emitting to clients:", poll);

            // Notify all clients about the new poll
            io.emit('poll_started', poll);
            io.emit('new_poll', poll);

            const timeInSeconds = Number(maxTime) || 60; // Default to 60 seconds if not provided

            // Schedule end of poll
            setTimeout(() => {
                const results = PollManager.getResults();
                io.emit('poll_ended', { results });
                PollManager.endPoll();
            }, timeInSeconds * 1000);
        });

        socket.on('get_current_poll', () => {
            const currentPoll = PollManager.getCurrentPoll();
            console.log("📣 Current poll requested, sending:", currentPoll);
            if (currentPoll) {
                socket.emit('poll_started', currentPoll);
            } else {
                socket.emit('poll_not_found');
            }
        });

        socket.on('submit_answer', ({ name, questionId, option }) => {
            const result = PollManager.submitAnswer(name, { questionId, option }); // 🔄 adjusted
            if (result.error) {
                socket.emit('answer_error', result);
                return;
            }
            console.log(`Answer submitted by ${name} for question ${questionId}: ${option}`);

            // ✅ Add this to notify teacher dashboard in real-time:
            console.log("🔥 Emitting poll_vote event with option:", option);
            io.emit('poll_vote', option); // <-- 🔥 this is what your PollResults.jsx listens for

            const results = PollManager.getResults();
            io.emit('poll_results', results);

        });

        socket.on('kick_student', ({ studentId }) => {
            PollManager.kickStudent(studentId);
            io.emit('student_kicked', { studentId });

            // Disconnect the kicked student's socket
            const kickedSocketId = Object.keys(activeConnections).find(
                (id) => activeConnections[id] === studentId
            );
            if (kickedSocketId && io.sockets.sockets.get(kickedSocketId)) {
                io.sockets.sockets.get(kickedSocketId).disconnect(true);
            }
        });

        socket.on('send_message', ({ sender, message }) => {
            io.emit('receive_message', { sender, message, timestamp: Date.now() });
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
            delete activeConnections[socket.id];
        });
    });
};

module.exports = socketHandlers;
