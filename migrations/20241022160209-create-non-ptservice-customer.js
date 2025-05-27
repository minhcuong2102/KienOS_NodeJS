'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('non_ptservice_customer', {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      non_pt_service_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'nonpt_service', // Name of the target table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      customer_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      expire_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      is_purchased: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('non_ptservice_customer');
  },
};
