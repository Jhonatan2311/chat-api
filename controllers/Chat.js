
const service = require('@services/Chat');
const serviceUserChat = require('@services/UserChat');
const { responseErrorJson, responseJson } = require('@utils/Controller');
const _ = require('lodash');
const SocketClient = require('@utils/SocketClient');

const index = async (req, res) => {
    try {
        const { query, params } = req;
        const result = await service.index(Object.assign(params, query));
        return responseJson(res, result);
    } catch (error) {
        return responseErrorJson(res, 'Chat::index', error);
    }
};

const show = async (req, res) => {
    try {
        const { query, params } = req;
        const result = await service.show(Object.assign(params, query));
        return responseJson(res, result);
    } catch (error) {
        return responseErrorJson(res, 'Chat::show', error);
    }
};

const store = async (req, res) => {
    try {
        const { body } = req;
        const result = await service.store(body);
        return responseJson(res, result);
    } catch (error) {
        return responseErrorJson(res, 'Chat::store', error);
    }
};

const update = async (req, res) => {
    try {
        const { body, params } = req;
        const result = await service.update(body, parseInt(params.id));
        return responseJson(res, result);
    } catch (error) {
        return responseErrorJson(res, 'Chat::update', error);
    }
};

const destroy = async (req, res) => {
    try {
        const { params } = req;
        const result = await service.destroy(params);
        return responseJson(res, result);
    } catch (error) {
        return responseErrorJson(res, 'Chat::destroy', error);
    }
};

const createChat = async (req, res) => {
    try {
        const { body } = req;
        const result = await service.store(body);
        if (result && result.id) {
            await serviceUserChat.store({
                chat_id: result.id,
                user_id: body.owner_id,
            });
            await serviceUserChat.store({
                chat_id: result.id,
                user_id: body.user_id,
            });
        }
        return responseJson(res, result);
    } catch (error) {
        return responseErrorJson(res, 'Chat::createChat', error);
    }
};

const checkChat = async (req, res) => {
    try {
        const { body } = req;
        const resultUser1 = await serviceUserChat.index({ user_id : body.owner_id});
        const resultUser2 = await serviceUserChat.index({ user_id: body.user_id });
        let result1 = resultUser1.rows.map(a => a.chat_id);
        let result2 = resultUser2.rows.map(a => a.chat_id);
        const insersectionChats = _.intersection(result1, result2);
        console.log(insersectionChats)
        return responseJson(res, insersectionChats.length ? insersectionChats[0] : false);
    } catch (error) {
        return responseErrorJson(res, 'Chat::check-chat', error);
    }
};

const deleteChat = async (req, res) => {
    try {
        const { body, params } = req;
        const result = await service.update(body, parseInt(params.id));
        if (result && result.id) {
            SocketClient.emit('deleteChat', result);
        }
        return responseJson(res, result);
    } catch (error) {
        return responseErrorJson(res, 'Chat::delete', error);
    }
};

module.exports = {
    index,
    show,
    store,
    update,
    destroy,
    createChat,
    checkChat,
    deleteChat,
};