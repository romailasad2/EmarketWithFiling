const Sequelize = require('sequelize');

const sequelize = new Sequelize('e-market', 'root', 'romimalik574', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;