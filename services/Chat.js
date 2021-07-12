const { Chat, Message, User, UserChat } = require('@models');
const _ = require('lodash');

const getInclude = data => {
  const fields = data.fields ? data.fields.split(",") : [];
  const include = [
    {
      model: Message,
      as: 'messages',
      required: true,
    },
    {
      model: UserChat,
      as: 'users_chat',
      required: true,
      attributes: { exclude: ['senha', 'contra_senha'] },
      include: [
        {
          model: User,
          as: 'user',
          required: false,
          attributes: { exclude: ['senha', 'contra_senha'] },
        },
      ]
    },
  ];
  return _.filter(_.uniqBy(include, 'as'), o => _.includes(fields, o.as));
};

const getWhere = data => {
  const where = {};

  if (data.id) where.id = data.id;
  if (!_.isNil(data.actived)) where.actived = data.actived;

  return where;
};

const index = async data => {
  try {
    const result = await Chat.findAndCountAll({
      where: getWhere(data),
      offset: data.offset ? parseInt(data.offset) : null,
      limit: data.limit ? parseInt(data.limit) : null,
      include: getInclude(data),
      distinct: true,
    });
    result.rows = result.rows.map(r => r.get({ plain: true }));
    result.rows.map(r => {
      r.last_message = _.maxBy(r.messages, 'id');
      const findLastUser = r.users_chat.length > 0 ? _.findLast(r.users_chat, function (obj) {
        return obj.user_id != parseInt(data.user_id);
      }) : null;
      r.user = findLastUser && findLastUser.id && findLastUser.user && findLastUser.user.id ? findLastUser.user : null;
    });
    return result;
  } catch (error) {
    console.log(error)
    throw new Error(error.errors.map(e => e.message));
  }
};

const show = async data => {
  try {
    const result = await Chat.findOne({
      where: getWhere(data),
      include: getInclude(data),
      distinct: true,
    });
    return result ? result.get({ plain: true }) : null;
  } catch (error) {
    throw new Error(error.errors.map(e => e.message));
  }
};

const store = async data => {
  try {
    const result = await Chat.create(data);
    return Object.assign(data, result.get({ plain: true }));
  } catch (error) {
    throw new Error(error.errors.map(e => e.message));
  }
};

const update = async (data, id) => {
  try {
    await Chat.update(data, { where: { id } });
    const result = Chat.findByPk(id);
    return Object.assign(data, result.get({ plain: true }));
  } catch (error) {
    throw new Error(error.errors.map(e => e.message));
  }
};

const destroy = async data => {
  try {
    if (!_.size(data)) throw 'Dados inválidos';
    return await Chat.destroy({ where: data });
  } catch (error) {
    throw new Error(error.errors.map(e => e.message));
  }
};

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
};
