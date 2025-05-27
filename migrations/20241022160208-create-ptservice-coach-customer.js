'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ptservice_coach_customer', {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      pt_service_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'pt_service', // Name of the target table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      coach_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'user',
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
      },
      used_session: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      is_purchased: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ptservice_coach_customer');
  },
};