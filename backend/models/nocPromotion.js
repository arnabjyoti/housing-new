'use strict';
module.exports = (sequelize, type) => {
    const nocPromotion = sequelize.define('nocPromotion', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        spouse_qrtr_avail: type.STRING,
        spouse_qrtr_no_type: type.STRING,
        spouse_qrtr_sctr_loc: type.STRING,
        spouse_qrtr_enc: type.STRING,
        spouse_qrtr_enc_name: type.STRING,
        spouse_qrtr_enc_nature: type.STRING,
        annexure_c: type.STRING,
        applyDate:{ type: 'DATE' },
        referenceNo: type.STRING,
        remark: type.STRING,
        status: type.STRING,
    },
    {}
    );
    nocPromotion.associate = function(models) {
        nocPromotion.belongsTo(models.users);
    };
    return nocPromotion;
};