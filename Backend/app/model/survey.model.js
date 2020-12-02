module.exports = (sequelize, Sequelize) => {
  const Survey = sequelize.define("survey", {
    name: {
      type: Sequelize.STRING,
    },
  });

  return Survey;
};
