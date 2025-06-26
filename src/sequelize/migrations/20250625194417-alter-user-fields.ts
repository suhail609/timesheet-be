import { QueryInterface, DataTypes } from 'sequelize';

export = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.changeColumn('users', 'firstName', {
      type: DataTypes.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('users', 'lastName', {
      type: DataTypes.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.changeColumn('users', 'firstName', {
      type: DataTypes.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('users', 'lastName', {
      type: DataTypes.STRING,
      allowNull: false,
    });
  },
};
