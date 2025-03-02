import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('EComDB', 'root', 'Ps@ini@123', {
    host: 'localhost',
    dialect: 'mysql'
});

export default sequelize; 