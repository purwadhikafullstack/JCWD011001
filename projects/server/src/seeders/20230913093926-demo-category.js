'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // await queryInterface.bulkInsert('Categories', [{
    //   name: 'Sayur',
    //   category_img : "",
    //   isactive : 1,
    //   createdAt : new Date(),
    //   updatedAt : new Date()
    // }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
