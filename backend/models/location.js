'use strict';
module.exports = (sequelize, type) => {
    const location = sequelize.define('location', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        loc_name: type.STRING,
        status: type.STRING
    },
    {}
    );
    location.associate = function(models) {
        location.hasMany(models.sector);
        location.hasMany(models.quarter);
        location.hasMany(models.application);
        location.hasMany(models.courtCase);
        location.hasMany(models.encroachment);
        location.hasMany(models.repairMaintain);
    };
    return location;
};