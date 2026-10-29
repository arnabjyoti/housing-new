'use strict';
module.exports = (sequelize, type) => {
    const privilege = sequelize.define('privilege', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        slug: {
            type: type.STRING,
            uniqueKey: true
        }
    }, {});
    privilege.associate = function(models) {
        // associations can be defined here
        privilege.hasMany(models.roles);
    };
    return privilege;
};