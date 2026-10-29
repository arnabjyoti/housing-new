'use strict';
module.exports = (sequelize, type) => {
    const application = sequelize.define('application', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        apply_date: { type: 'DATE' },
        apply_place: type.STRING,
        anx_a: type.STRING,
        status: type.STRING,
        status_type: type.STRING,
        remark: type.STRING,
        map_loc: type.STRING,
        qrtr_type: type.STRING,
        qrtr_no: type.STRING,
        qrtr_letitude: type.STRING,
        qrtr_longitude: type.STRING,
        allot_order: type.STRING,
        photo_1: type.STRING,
        photo_2: type.STRING,
        photo_3: type.STRING,
        photo_4: type.STRING,
        reference_no: type.STRING,
        verify_date: { type: 'DATE' },
        start_date: { type: 'DATE' },
        renewal_date: { type: 'DATE' },
        allottedDate: { type: 'DATE' },
        is_deleted: type.STRING,
    },
    {}
    );
    application.associate = function(models) {
        application.belongsTo(models.sector);
        application.belongsTo(models.location);
        application.belongsTo(models.quarter);
        application.belongsTo(models.users);
        application.belongsTo(models.department);
    };
    return application;
};