'use strict';
module.exports = (sequelize, type) => {
    const users = sequelize.define('users', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        f_name: type.STRING,
        m_name: type.STRING,
        l_name: type.STRING,
        gender: type.STRING,
        email: type.STRING,
        phone_no: type.STRING,
        designation: type.STRING,
        civic_charge: type.STRING,
        others_dept: type.STRING,
        basic_pay: type.STRING,
        pay_matrix: type.STRING,
        service_status: type.STRING,
        transferable:  type.STRING,
        doa: { type: 'DATE' },
        dor: { type: 'DATE' },
        dojs: { type: 'DATE' },
        dos: { type: 'DATE' },
        spouse_f_name: type.STRING,
        spouse_l_name: type.STRING,
        spouse_occ: type.STRING,
        spouse_acco: type.STRING,
        resid_house: type.STRING,
        annexure_a: type.STRING,
        annexure_a_date: { type: 'DATE' },
        annexure_a_place: type.STRING,
        photo: type.STRING,
        sign: type.STRING,
        pan: type.STRING,
        adhar: type.STRING,
        aadhaar_number: type.STRING,
        identity: type.STRING,
        appointment: type.STRING,
        role: type.STRING,
        active: {
            type: type.BOOLEAN,
            default: true
        },
        rememberToken: type.STRING,
        accessKeyword: type.STRING,
    }, {});
    users.associate = function(models) {
        // associations can be defined here
        users.belongsTo(models.department);
        users.hasMany(models.application);
        users.hasMany(models.nocPromotion);
        users.hasMany(models.quarterAllotment);
        users.hasMany(models.nonAccomodation);
        users.hasMany(models.repairMaintain);
    };
    return users;
};