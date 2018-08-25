'use strict'

const path = require('path');
const Sequelize = require('sequelize');
const Op = Sequelize.Op

const sequelize = new Sequelize('my_db', 'root', '123456', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    operatorsAliases: {
      $and: Op.and,
      $or: Op.or,
      $eq: Op.eq,
      $gt: Op.gt,
      $lt: Op.lt,
      $lte: Op.lte,
      $like: Op.like
    },
    dialectOptions: {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
      supportBigNumbers: true,
      bigNumberStrings: true
  }
});

//定义模型
const Blog = sequelize.define('Blog', {
    id: {
        type: Sequelize.INTEGER, 
        primaryKey: true, 
        autoIncrement: true
    },
    title: {
        type:Sequelize.STRING
    },
    content: {
        type:Sequelize.STRING
    },
    createdAt:{
        type:Sequelize.DATE
    },
    updatedAt:{
        type:Sequelize.DATE
    }
})

sequelize.sync();

module.exports = Blog;
