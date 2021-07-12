const _ = require('lodash');
const service = require('@services/User');
const httpStatus = require('http-status-codes');
const EmailUtil = require('@utils/Email');
const { responseErrorJson, responseJson } = require('@utils/Controller');
const { checkPassword, generatePassword, generateToken, createSession, updateSession, closeSession } = require("@controllers/Auth");

const index = async (req, res) => {
    try {
        const { query, params } = req;
        const result = await service.index(Object.assign(params, query));
        return responseJson(res, result);
    } catch (error) {
        return responseErrorJson(res, 'Usuario::index', error);
    }
};

const show = async (req, res) => {
    try {
        const { query, params } = req;
        const result = await service.show(Object.assign(params, query));
        return responseJson(res, result);
    } catch (error) {
        return responseErrorJson(res, 'Usuario::show', error);
    }
};

const store = async (req, res) => {
    try {
        const { body } = req;
        const password = generatePassword(null, body.senha);
        const usuario = _.cloneDeep(body);
        usuario.senha = password.senha;
        usuario.contra_senha = password.contra_senha;
        const result = await service.store(usuario);
        return responseJson(res, result);
    } catch (error) {
        return responseErrorJson(res, 'Usuario::store', error);
    }
};

const update = async (req, res) => {
    try {
        const { body, params } = req;
        if (body.senha) delete body.senha;
        if (body.contra_senha) delete body.contra_senha;
        const result = await service.update(body, parseInt(params.id));
        return responseJson(res, result);
    } catch (error) {
        return responseErrorJson(res, 'Usuario::update', error);
    }
};

const destroy = async (req, res) => {
    try {
        const { params } = req;
        const result = await service.destroy(params);
        return responseJson(res, result);
    } catch (error) {
        return responseErrorJson(res, 'Usuario::destroy', error);
    }
};

const updatePassword = async (req, res) => {
    try {
        const { body, DECODED } = req;
        const result = await service.show({ id: DECODED.id, permissao: DECODED.permissao });
        if (!result) throw 'Usuário não encontrado';
        const usuario = result;
        if (!checkPassword(usuario.senha, body.senha_atual, usuario.contra_senha)) throw 'Senha incorreta';
        const password = generatePassword(null, body.senha_nova, usuario.contra_senha);
        usuario.senha = password.senha;
        const model = await service.update(usuario, usuario.id);
        delete model.senha;
        delete model.contra_senha;
        return responseJson(res, model);
    } catch (error) {
        return responseErrorJson(res, 'Usuario::updatePassword', error);
    }
};

const resetPassword = async (req, res) => {
    try {
        const { body, CLIENT } = req;
        if (_.isEmpty(body.email)) throw 'Email inváido';
        const result = await service.show({ email: body.email });
        if (!result) throw 'Email inválido';
        const usuario = result;
        const password = generatePassword(null, null, usuario.contra_senha);
        usuario.senha = password.senha;
        await sendPassword({ email: usuario.email, senha: password.senha_visivel });
        const model = await service.update(usuario, usuario.id);
        delete model.senha;
        delete model.contra_senha;
        return responseJson(res, model);
    } catch (error) {
        return responseErrorJson(res, 'Usurio::resetPassword', error);
    }
};

const login = async (req, res) => {
    try {
        const { CLIENT, body } = req;
        let chats = [];

        if (_.isEmpty(body.email)) throw 'Email inválido';
        if (_.isEmpty(body.senha)) throw 'Senha inválida';
        let result = await service.show({ email: body.email, fields: 'users_chat' });
        if (!result) throw 'Email inválido';
        if (result && result.users_chat.length) {
            result.users_chat.map(obj => {
            chats.push(obj.chat);
            });
            delete result.users_chat;
            result.chats = chats;
        }
        const usuario = result;
        if (!checkPassword(usuario.senha, body.senha, usuario.contra_senha)) throw 'Senha inválida';
        usuario.token = generateToken(usuario, CLIENT);
        await createSession({ usuario_id: usuario.id, client_id: CLIENT.id, token: usuario.token });
        delete usuario.senha;
        delete usuario.contra_senha;
        return responseJson(res, usuario);
    } catch (error) {
        return responseErrorJson(res, 'Usuario::login', error, httpStatus.FORBIDDEN);
    }
};

const validate = async (req, res) => {
	try {
		const { CLIENT, DECODED } = req;
		const result = await service.index({ id: DECODED.id, ativo: 1 });

		if (!result.rows.length)
			return responseErrorJson(res, "Usuario::validate", "Você não tem permissão para acessar o app!", httpStatus.UNAUTHORIZED);

		const usuario = result.rows[0];
		usuario.token = generateToken(usuario, CLIENT);
		delete usuario.senha;
		delete usuario.contra_senha;
		return responseJson(res, usuario);
	} catch (error) {
		return responseErrorJson(res, "Usuario::validate", error);
	}
};

const logout = async (req, res) => {
    try {
        const { TOKEN } = req;
        const result = await closeSession(TOKEN);
        return responseJson(res, result);
    } catch (error) {
        return responseErrorJson(res, 'Usuario::logout', error, httpStatus.FORBIDDEN);
    }
};

const sendPassword = async data => {
	try {
		return await EmailUtil.sendPassword(data);
	} catch (error) {
		throw new Error(error);
	}
}

module.exports = {
    index,
    show,
    store,
    update,
    destroy,
    login,
    updatePassword,
    resetPassword,
    validate,
    logout,
};