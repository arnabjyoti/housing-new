'use strict';
module.exports = (sequelize, type) => {
    const quarterAllotment = sequelize.define('quarterAllotment', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        qrtr_type: type.STRING,
        qrtr_no: type.STRING,
        qrtr_letitude: type.STRING,
        qrtr_longitude: type.STRING,
        map_loc: type.STRING,
        allot_order: type.STRING,
        photo_1: type.STRING,
        photo_2: type.STRING,
        photo_3: type.STRING,
        photo_4: type.STRING,
        d_w: type.STRING,
        e_w: type.STRING,
        r_c: type.STRING,
        s_q: type.STRING,
        s_t: type.STRING,
        qtr_extnd: type.STRING,
        type_of_strc: type.STRING,
        area_extnd_strc: type.STRING,
        extnd_prmsn: type.STRING,
        extnd_doc: type.STRING,
        strc_nearby: type.STRING,
        strc_by_whm: type.STRING,
        strc_distance: type.STRING,
        strc_type: type.STRING,
        strc_allot: type.STRING,
        strc_area: type.STRING,
        strc_storeys: type.STRING,
        strc_photo: type.STRING,
        reference_no: type.STRING,
        applyDate: { type: 'DATE' },
        startDate: { type: 'DATE' },
        renewalDate: { type: 'DATE' },
        upload_signed_copy: type.STRING,
        status: type.STRING,
        remark: type.STRING,
    },
    {}
    );
    quarterAllotment.associate = function(models) {
        quarterAllotment.belongsTo(models.sector);
        quarterAllotment.belongsTo(models.location);
        quarterAllotment.belongsTo(models.users);
    };
    return quarterAllotment;
};