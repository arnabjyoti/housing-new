'use strict';

module.exports = (sequelize, type) => {
  const satelliteImage = sequelize.define('satelliteImage', {
    id: { type: type.INTEGER, primaryKey: true, autoIncrement: true },
    photo_1: type.STRING,
    photo_2: type.STRING,
    photo_3: type.STRING,
    photo_4: type.STRING,
    photo_5: type.STRING,
    created_by: type.INTEGER
  }, {});

  satelliteImage.associate = function(models) {
    satelliteImage.belongsTo(models.location);
    satelliteImage.belongsTo(models.sector);
    satelliteImage.belongsTo(models.users, { foreignKey: 'created_by' });
  };

  return satelliteImage;
};
