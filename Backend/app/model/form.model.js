module.exports = (sequelize, Sequelize) => {
  const Form = sequelize.define("forms", {
    name: {
      type: Sequelize.STRING,
    },
    type: {
      type: Sequelize.STRING,
    },
    label: {
      type: Sequelize.STRING,
    },
    options: {
      type: Sequelize.STRING,
    },
    value: {
      type: Sequelize.STRING,
    },

    required: {
      type: Sequelize.INTEGER,
    },
  });

  return Form;
};
