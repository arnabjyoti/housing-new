'use strict';
module.exports = (sequelize, type) => {
    const nonAccomodation = sequelize.define('nonAccomodation', {
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
        annexure_b: type.STRING,
        applyDate:{ type: 'DATE' },
        approvedDate:{ type: 'DATE' },
        renewalDate:{ type: 'DATE' },
        place: type.STRING,
        referenceNo: type.STRING,
        remark: type.STRING,
        status: type.STRING,
    },
    {}
    );
    nonAccomodation.associate = function(models) {
        nonAccomodation.belongsTo(models.users);
    };
    return nonAccomodation;
};