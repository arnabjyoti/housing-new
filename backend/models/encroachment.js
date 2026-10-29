'use strict';
module.exports = (sequelize, type) => {
    const encroachment = sequelize.define('encroachment', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        allotee_name: type.STRING,
        allotee_designation: type.STRING,
        allotee_department: type.STRING,
        qrtr_type: type.STRING,
        qrtr_no: type.STRING,
        encroachment_details: type.TEXT('long'),
        name_of_encroacher: type.STRING,
        designation_of_encroacher: type.STRING,
        department_of_encroacher: type.STRING,
        encroacher_designation: type.STRING,
        encroached_type: type.STRING,
        status_of_case: type.STRING,
        photo_1: type.STRING,
        photo_2: type.STRING,
        photo_3: type.STRING,
        photo_4: type.STRING,
        photo_5: type.STRING,
        status: type.STRING,
    },
    {}
    );
    encroachment.associate = function(models) {
        encroachment.belongsTo(models.sector);
        encroachment.belongsTo(models.location);
        encroachment.belongsTo(models.quarter);
        encroachment.belongsTo(models.users);
        encroachment.belongsTo(models.department, { foreignKey: 'allotee_department', as: 'allotee_departmentID' });
        encroachment.belongsTo(models.department, { foreignKey: 'department_of_encroacher', as: 'department_of_encroacherID' });
    };
    return encroachment;
};