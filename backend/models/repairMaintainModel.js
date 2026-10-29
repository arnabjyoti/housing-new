'use strict';
module.exports = (sequelize, type) => {
    const repairMaintain = sequelize.define('repairMaintain', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        quarter_type: type.STRING,
        quarter_no: type.STRING,
        allotment_order: type.STRING,

        door: type.STRING,
        door_status: type.STRING,
        door_update_date: { type: 'DATE' },

        window: type.STRING,
        window_status: type.STRING,
        window_update_date: { type: 'DATE' },

        wall: type.STRING,
        wall_status: type.STRING,
        wall_update_date: { type: 'DATE' },

        ceiling: type.STRING,
        ceiling_status: type.STRING,
        ceiling_update_date: { type: 'DATE' },

        wiring: type.STRING,
        wiring_status: type.STRING,
        wiring_update_date: { type: 'DATE' },

        tank: type.STRING,
        tank_status: type.STRING,
        tank_update_date: { type: 'DATE' },

        roof: type.STRING,
        roof_status: type.STRING,
        roof_update_date: { type: 'DATE' },
    },
    {}
    );
    repairMaintain.associate = function(models) {
        repairMaintain.belongsTo(models.sector);
        repairMaintain.belongsTo(models.location);
        repairMaintain.belongsTo(models.quarter);
        repairMaintain.belongsTo(models.users);
    };
    return repairMaintain;
};