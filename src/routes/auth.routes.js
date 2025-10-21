import express from 'express';

const router = express.Router();

router.post('/sign-up', (req, res) => {
    res.send('POST /api/auth/sign-up respose');
});

router.post('/sign-in', (req, res) => {
    res.send('POST /api/auth/sign-in respose');
});

router.post('/sign-out', (req, res) => {
    res.send('POST /api/auth/sign-out respose');
});

export default router;