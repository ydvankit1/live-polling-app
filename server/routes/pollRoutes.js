const express = require('express');
const router = express.Router();
const PollManager = require('../controllers/pollSingleton');


router.get('/current', (req, res) => {
    const poll = PollManager.getCurrentPoll();
    if (!poll) return res.status(404).json({ error: 'No active poll' });
    res.json(poll);
});

router.get('/results', (req, res) => {
    const results = PollManager.getResults();
    res.json(results);
});

router.get('/history', (req, res) => {
    const history = PollManager.getPollHistory();
    res.json(history);
});

module.exports = router;
