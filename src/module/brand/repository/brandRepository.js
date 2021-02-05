const BrandNotDefinedError = require('../error/BrandNotDefinedError');
const BrandIdNotDefinedError = require('../error/BrandIdNotDefinedError');
const BrandNotFoundError = require('../error/BrandNotFoundError');
const { fromModelToEntity } = require('../mapper/brandMapper');
const Brand = require('../entity/Brand');

module.exports = class BrandRepository {
  constructor(brandModel) {
    this.brandModel = brandModel;
  }

  async getAll() {
    return this.brandModel.findAll();
  }

  async getById(brandId) {
    if (!Number(brandId)) {
      throw new BrandIdNotDefinedError();
    }
    const brandInstance = await this.brandModel.findByPk(brandId);
    if (!brandInstance) {
      throw new BrandNotFoundError(`There is no existing brand with ID ${brandId}`);
    }

    return fromModelToEntity(brandInstance);
  }

  async save(brand) {
    if (!(brand instanceof Brand)) {
      throw new BrandNotDefinedError();
    }

    let brandModel;
    const buildOptions = { isNewRecord: !brand.id };
    brandModel = this.brandModel.build(brand, buildOptions);
    brandModel = await brandModel.save();

    return fromModelToEntity(brandModel);
  }

  async delete(brand) {
    if (!brand || !brand.id) {
      throw new BrandIdNotDefinedError();
    }

    return Boolean(await this.brandModel.destroy({ where: { id: brand.id } }));
  }
};
