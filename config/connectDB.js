import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('EcomDB', 'root', 'Ps@ini@123', {
    host: 'localhost',
    dialect: 'mysql'
});

export default sequelize; 