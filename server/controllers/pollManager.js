class PollManager {
    constructor() {
        this.currentPoll = null;
        this.answers = {};
        this.pollHistory = [];
        this.kickedStudents = new Set();
    }

    createPoll(question, options, maxTime = 60) {
        if (this.currentPoll && Date.now() - this.currentPoll.startTime < this.currentPoll.maxTime * 1000) {
            return { error: 'A poll is already running' };
        }

        this.currentPoll = {
            id: Date.now(),
            question,
            options,
            maxTime,
            startTime: Date.now(),
        };

        console.log('✅ Created poll and stored in singleton:', this.currentPoll);

        this.answers = {};
        this.kickedStudents.clear();
        return { success: true, poll: this.currentPoll };
    }

    submitAnswer(studentId, answer) {
        if (!this.currentPoll) return { error: 'No active poll' };
        if (this.kickedStudents.has(studentId)) return { error: 'You have been removed from the poll' };
        if (Date.now() - this.currentPoll.startTime > this.currentPoll.maxTime * 1000)
            return { error: 'Poll has ended' };

        // ✅ Only store the selected option (string), not an object
        this.answers[studentId] = answer.option;

        return { success: true };
    }

    getResults() {
        const resultCount = {};
        if (!this.currentPoll) return resultCount;

        for (const option of this.currentPoll.options) {
            resultCount[option] = 0;
        }

        Object.values(this.answers).forEach((ans) => {
            if (resultCount[ans] !== undefined) {
                resultCount[ans]++;
            }
        });

        return {
            question: this.currentPoll.question,
            results: resultCount,
        };
    }

    endPoll() {
        if (this.currentPoll) {
            this.pollHistory.push({
                ...this.currentPoll,
                results: this.getResults(),
                endTime: Date.now(),
            });
        }

        this.currentPoll = null;
        this.answers = {};
        this.kickedStudents.clear();
    }

    getCurrentPoll() {
        console.log('📣 getCurrentPoll() called, returning:', this.currentPoll);
        return this.currentPoll;
    }

    getPollHistory() {
        return this.pollHistory;
    }

    kickStudent(studentId) {
        this.kickedStudents.add(studentId);
    }
}
module.exports = PollManager;