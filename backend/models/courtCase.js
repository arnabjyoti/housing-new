'use strict';
module.exports = (sequelize, type) => {
    const courtCase = sequelize.define('courtCase', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        case_nature: type.STRING,
        case_no: type.STRING,
        case_details: type.TEXT,
        start_date: { type: 'DATE' },
        end_date: { type: 'DATE' },
        case_status: type.STRING,
        qrtr_no: type.STRING,
        status: type.STRING,
    },
    {}
    );
    courtCase.associate = function(models) {
        courtCase.belongsTo(models.sector);
        courtCase.belongsTo(models.location);
        courtCase.belongsTo(models.quarter);
        courtCase.hasMany(models.courtCaseImage);
    };
    return courtCase;
};