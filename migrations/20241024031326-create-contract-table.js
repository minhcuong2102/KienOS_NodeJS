'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('contract', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      expire_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      nonptservice_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
          model: 'nonpt_service',
          key: 'id',
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION',
        deferrable: Sequelize.Deferrable.INITIALLY_DEFERRED,
      },
      ptservice_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
          model: 'pt_service',
          key: 'id',
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION',
        deferrable: Sequelize.Deferrable.INITIALLY_DEFERRED,
      },
      coach_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
          model: 'coach_profile',
          key: 'id',
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION',
        deferrable: Sequelize.Deferrable.INITIALLY_DEFERRED,
      },
      customer_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
          model: 'customer_profile',
          key: 'id',
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION',
        deferrable: Sequelize.Deferrable.INITIALLY_DEFERRED,
      },
      is_purchased: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      used_sessions: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });

    // Indexes
    await queryInterface.addIndex('contract', ['coach_id'], {
      name: 'contract_coach_id_4883343f',
    });

    await queryInterface.addIndex('contract', ['customer_id'], {
      name: 'contract_customer_id_9fe79f41',
    });

    await queryInterface.addIndex('contract', ['nonptservice_id'], {
      name: 'contract_nonptservice_id_ce780ed2',
    });

    await queryInterface.addIndex('contract', ['ptservice_id'], {
      name: 'contract_ptservice_id_c1331dc8',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('contract');
  },
};
