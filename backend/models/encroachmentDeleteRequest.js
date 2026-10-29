'use strict';

module.exports = (sequelize, type) => {
  const encroachmentDeleteRequest = sequelize.define('encroachmentDeleteRequest', {
    id: { type: type.INTEGER, primaryKey: true, autoIncrement: true },
    encroachmentId: { type: type.INTEGER, allowNull: false },
    requestedById: { type: type.INTEGER, allowNull: false },
    requestedByName: type.STRING,
    status: { type: type.STRING, allowNull: false, defaultValue: 'Pending' },
    reviewedById: type.INTEGER,
    reviewedAt: type.DATE
  });

  return encroachmentDeleteRequest;
};
