const BrandIdNotDefinedError = require('../error/BrandIdNotDefinedError');
const BrandNotDefinedError = require('../error/BrandNotDefinedError');
const Brand = require('../entity/Brand');

module.exports = class BrandService {
  constructor(brandRepository) {
    this.brandRepository = brandRepository;
  }

  async getAll() {
    return this.brandRepository.getAll();
  }

  async getById(brandId) {
    if (!Number(brandId)) {
      throw new BrandIdNotDefinedError();
    }
    return this.brandRepository.getById(brandId);
  }

  async save(brand) {
    if (!(brand instanceof Brand)) {
      throw new BrandNotDefinedError();
    }
    return this.brandRepository.save(brand);
  }

  async delete(brand) {
    if (!(brand instanceof Brand)) {
      throw new BrandNotDefinedError();
    }
    return this.brandRepository.delete(brand);
  }
};
