module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('files', 'signature', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('files', 'signature');
  }
};
