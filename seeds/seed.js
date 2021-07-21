const sequelize = require('../config/connection');
const { Post } = require('../models');
const { User } = require('../models');
const postData = require('./postData.json');
const userData = require('./userData.json');

const seedAll = async () => {
  try {
    await sequelize.sync({ force: true });

    await User.bulkCreate(userData);
    
    await Post.bulkCreate(postData);

  } catch (err) {
    console.log(err);
  }

  process.exit(0);
};

seedAll();