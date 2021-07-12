const express = require('express');
const router = express.Router();
const httpStatus = require('http-status-codes');

const Auth = require('@controllers/Auth');
const User = require('@controllers/User');
const Message = require('@controllers/Message');
const Chat = require('@controllers/Chat');

router.post('/login', User.login);
router.put('/password/reset', User.resetPassword);

router.use(async (req, res, next) => {
    try {
        const { CLIENT, TOKEN } = req;
        const decoded = await Auth.decodedToken(TOKEN, CLIENT.private_key);
        req.DECODED = decoded;
        next();
    } catch (error) {
        Auth.closeSession(req.TOKEN);
        return res.status(httpStatus.UNAUTHORIZED).json({ error: 'Sessão expirada' });
    }
});

router.post('/login/validate', User.validate);

router.get('/user', User.index);
router.get('/user/:id', User.show);
router.post('/user', User.store);
router.put('/user/:id', User.update);
router.delete('/user/:id', User.destroy);

router.get('/message', Message.index);
router.get('/message/:id', Message.show);
router.post('/message', Message.store);
router.put('/message/:id', Message.update);
router.delete('/message/:id', Message.destroy);

router.get('/chat', Chat.index);
router.get('/chat/:id', Chat.show);
router.post('/chat', Chat.store);
router.put('/chat/:id', Chat.update);
router.put('/delete-chat/:id', Chat.deleteChat);
router.delete('/chat/:id', Chat.destroy);
router.post('/create-chat', Chat.createChat);
router.post('/check-chat', Chat.checkChat);

module.exports = router;