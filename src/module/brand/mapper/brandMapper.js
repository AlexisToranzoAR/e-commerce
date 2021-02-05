const Brand = require('../entity/Brand');

function fromDataToEntity({ id, name, image }) {
  return new Brand({
    id,
    name,
    image,
  });
}

function fromModelToEntity(model) {
  return new Brand(model.toJSON());
}

module.exports = {
  fromDataToEntity,
  fromModelToEntity,
};
