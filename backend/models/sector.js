'use strict';
module.exports = (sequelize, type) => {
    const sector = sequelize.define('sector', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        sctr_name: type.STRING,
        status: type.STRING,
    },
    {}
    );
    sector.associate = function(models) {
        sector.belongsTo(models.location);
        sector.hasMany(models.quarter);
        sector.hasMany(models.application);
        sector.hasMany(models.courtCase);
        sector.hasMany(models.encroachment);
        sector.hasMany(models.repairMaintain);
    };
    return sector;
};