const { Message, User } = require('@models');
const _ = require('lodash');

const getInclude = data => {
  const fields = data.fields ? data.fields.split(",") : [];
  const include = [
    {
      model: User,
      as: 'user',
      required: true,
    },
  ];
  return _.filter(_.uniqBy(include, 'as'), o => _.includes(fields, o.as));
};

const getWhere = data => {
  const where = {};
  if (data.id) where.id = data.id;
  if (!_.isNil(data.chat_id)) where.chat_id = data.chat_id;
  if (!_.isNil(data.user_id)) where.user_id = data.user_id;
  if (!_.isNil(data.actived)) where.actived = data.actived;

  return where;
};

const index = async data => {
  try {
    const result = await Message.findAndCountAll({
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
    const result = await Message.findOne({
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
    const result = await Message.create(data);
    return Object.assign(data, result.get({ plain: true }));
  } catch (error) {
    throw new Error(error.errors.map(e => e.message));
  }
};

const update = async (data, id) => {
  try {
    await Message.update(data, { where: { id } });
    const result = Message.findByPk(id);
    return Object.assign(data, result.get({ plain: true }));
  } catch (error) {
    throw new Error(error.errors.map(e => e.message));
  }
};

const destroy = async data => {
  try {
    if (!_.size(data)) throw 'Dados inválidos';
    return await Message.destroy({ where: data });
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
