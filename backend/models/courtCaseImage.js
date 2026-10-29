'use strict';
module.exports = (sequelize, type) => {
    const courtCaseImage = sequelize.define('courtCaseImage', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        image_name: type.STRING,
        image_desc: type.STRING,
        status: type.STRING,
    },
    {}
    );
    courtCaseImage.associate = function(models) {
        courtCaseImage.belongsTo(models.courtCase);
    };
    return courtCaseImage;
};