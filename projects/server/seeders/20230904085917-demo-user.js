'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    //  await queryInterface.bulkInsert('Users', [{
    //     username: 'afdal',
    //     name : "Afdal Maulana",
    //     birthdate : new Date(1998,7,26),
    //     email: "afdalmaulanaaa@gmail.com",
    //     password : "$2a$12$wpWwNSYMuO4Bmkysdndxx.JW.crjBdoQsjIF5fBu1UB5Wko1ddwUK",
    //     gender : "Male",
    //     profileimg : "",
    //     refcode : "abc",
    //     refby : "",
    //     createdAt : new Date(),
    //     updatedAt : new Date()
//  }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
