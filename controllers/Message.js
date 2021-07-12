const service = require('@services/Message');
const { responseErrorJson, responseJson } = require('@utils/Controller');
const SocketClient = require('@utils/SocketClient');

const index = async (req, res) => {
    try {
        const { query, params } = req;
        const result = await service.index(Object.assign(params, query));
        return responseJson(res, result);
    } catch (error) {
        return responseErrorJson(res, 'Message::index', error);
    }
};

const show = async (req, res) => {
    try {
        const { query, params } = req;
        const result = await service.show(Object.assign(params, query));
        return responseJson(res, result);
    } catch (error) {
        return responseErrorJson(res, 'Message::show', error);
    }
};

const store = async (req, res) => {
    try {
        const { body } = req;
        const result = await service.store(body);
        if (result && result.id) {
            SocketClient.emit('message', result);
        }
        return responseJson(res, result);
    } catch (error) {
        return responseErrorJson(res, 'Message::store', error);
    }
};

const update = async (req, res) => {
    try {
        const { body, params } = req;
        const result = await service.update(body, parseInt(params.id));
        return responseJson(res, result);
    } catch (error) {
        return responseErrorJson(res, 'Message::update', error);
    }
};

const destroy = async (req, res) => {
    try {
        const { params } = req;
        const result = await service.destroy(params);
        return responseJson(res, result);
    } catch (error) {
        return responseErrorJson(res, 'Message::destroy', error);
    }
};

module.exports = {
    index,
    show,
    store,
    update,
    destroy,
};