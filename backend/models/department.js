'use strict';
module.exports = (sequelize, type) => {
    const department = sequelize.define('department', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        dept_name: type.STRING,
    },
    {}
    );
    department.associate = function(models) {
        department.hasMany(models.users);
        department.hasMany(models.application);
        department.hasMany(models.encroachment);
        department.hasMany(models.quarter);
    };
    return department;
};