'use strict';
module.exports = (sequelize, type) => {
    const quarter = sequelize.define('quarter', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        allottee_name: type.STRING,
        designation: type.STRING,
        gMapLink: type.STRING,
        allotment_order: type.STRING,
        qrtr_no: type.STRING,
        qrtr_type: type.STRING,
        qrtr_longitude: type.STRING,
        qrtr_letitude: type.STRING,
        photo_1: type.STRING,
        photo_2: type.STRING,
        photo_3: type.STRING,
        photo_4: type.STRING,
        photo_5: type.STRING,
        photo_6: type.STRING,
        photo_7: type.STRING,
        photo_8: type.STRING,
        remark: type.STRING,
        status: type.STRING,
    },
    {}
    );
    quarter.associate = function(models) {
        quarter.belongsTo(models.sector);
        quarter.belongsTo(models.location);
        quarter.hasMany(models.application);
        quarter.hasMany(models.courtCase);
        quarter.hasMany(models.repairMaintain);
        quarter.belongsTo(models.department);
    };
    return quarter;
};