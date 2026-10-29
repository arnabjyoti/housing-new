'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Add aadhaar_number column
    await queryInterface.addColumn('users', 'aadhaar_number', {
      type: Sequelize.STRING(20),
      allowNull: true,
      defaultValue: null
    });

    // 2. Add unique index on aadhaar_number
    await queryInterface.addIndex('users', ['aadhaar_number'], {
      unique: true,
      name: 'unique_users_aadhaar_number'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('users', 'unique_users_aadhaar_number');
    await queryInterface.removeColumn('users', 'aadhaar_number');
  }
};
