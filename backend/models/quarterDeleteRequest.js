'use strict';

module.exports = (sequelize, type) => {
  const quarterDeleteRequest = sequelize.define('quarterDeleteRequest', {
    id: { type: type.INTEGER, primaryKey: true, autoIncrement: true },
    targetId: { type: type.INTEGER, allowNull: false },
    tableFrom: { type: type.STRING, allowNull: false },
    requestedById: { type: type.INTEGER, allowNull: false },
    requestedByName: type.STRING,
    status: { type: type.STRING, allowNull: false, defaultValue: 'Pending' },
    reviewedById: type.INTEGER,
    reviewedAt: type.DATE
  });

  quarterDeleteRequest.associate = function(models) {
    quarterDeleteRequest.belongsTo(models.users, { as: 'requester', foreignKey: 'requestedById' });
    quarterDeleteRequest.belongsTo(models.users, { as: 'reviewer', foreignKey: 'reviewedById' });
  };

  return quarterDeleteRequest;
};
