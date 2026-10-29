'use strict';

module.exports = (sequelize, type) => {
    const roles = sequelize.define('roles', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        role: type.STRING
    }, {});
    roles.associate = function(models) {
        // associations can be defined here
        roles.belongsTo(models.privilege);
    };

    return roles;
};