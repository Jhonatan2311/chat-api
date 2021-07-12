const { Chat, User, UserChat } = require('@models');
const _ = require('lodash');

const getInclude = data => {
  const fields = data.fields ? data.fields.split(",") : [];
  const include = [
    {
      model: UserChat,
      as: 'users_chat',
      required: false,
      include: [
        {
          model: Chat,
          as: 'chat',
          required: false,
        }
      ]
    },
  ];
  return _.filter(_.uniqBy(include, 'as'), o => _.includes(fields, o.as));
};

const getWhere = data => {
  const where = {};

  if (data.id) where.id = data.id;
  if (data.email) where.email = data.email.toLowerCase();
  if (!_.isNil(data.actived)) where.actived = data.actived;

  return where;
};

const index = async data => {
  try {
    const result = await User.findAndCountAll({
      where: getWhere(data),
      offset: data.offset ? parseInt(data.offset) : null,
      limit: data.limit ? parseInt(data.limit) : null,
      include: getInclude(data),
      distinct: true,
    });
    result.rows = result.rows.map(r => r.get({ plain: true }));
    return result;
  } catch (error) {
    console.log(error)
    throw new Error(error.errors.map(e => e.message));
  }
};

const show = async data => {
  try {
    const result = await User.findOne({
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
    const result = await User.create(data);
    return Object.assign(data, result.get({ plain: true }));
  } catch (error) {
    throw new Error(error.errors.map(e => e.message));
  }
};

const update = async (data, id) => {
  try {
    await User.update(data, { where: { id } });
    const result = User.findByPk(id);
    return Object.assign(data, result.get({ plain: true }));
  } catch (error) {
    throw new Error(error.errors.map(e => e.message));
  }
};

const destroy = async data => {
  try {
    if (!_.size(data)) throw 'Dados inválidos';
    return await User.destroy({ where: data });
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
