'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.bulkInsert('Products', [{
        name: 'Bayam',
        category_id : 1,
        store_id : null,
        price : 2000,
        admin_discount : null,
        product_img : null,
        createdAt : new Date(),
        updatedAt : new Date()
      }], {});
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.bulkDelete('Products', null, {});
  }
};
