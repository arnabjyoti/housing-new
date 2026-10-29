const sectorModel = require("../models").sector;
const locationModel = require("../models").location;
const departmentModel = require("../models").department;
const quarterModel = require("../models").quarter;
const applicationModel = require("../models").application;
const nonAccomodation = require("../models").nonAccomodation;
const quarterAllotmentModel = require("../models").quarterAllotment;
const encroachmentModel = require("../models").encroachment;
const repairMaintainModel = require("../models").repairMaintain;
const courtCaseModel = require("../models").courtCase;
const Op = require('sequelize').Op;

module.exports = {
  async adminHomeCounter(req, res) {
    try {
      const departmentCount = await departmentModel.count({});

      const encroachCount = await encroachmentModel.count({
        where: {
          status: { [Op.ne]: 0 }
        }
      });

      const quarterOnlyCount = await quarterModel.count({
        where: { status: 1 }
      });

      const quarterAllotmentCount = await quarterAllotmentModel.count({
        where: { status: "Approved" }
      });

      const freshApllicationAllotCount = await applicationModel.count({
        where: {
          status: "Allotted",
          is_deleted: "No"
        }
      });

      const quarterCount = quarterOnlyCount + quarterAllotmentCount + freshApllicationAllotCount;

      const applicationCount = await applicationModel.count({
        where: {
          status: {
            [Op.in]: ["Apply", "Approved", "Verified", "Rejected"]
          }
        }
      });

      const renewalCount = await quarterAllotmentModel.count({
        where: {
          status: { [Op.ne]: 'Incomplete' }
        }
      });

      const nonAcooCount = await nonAccomodation.count({
        where: {
          status: { [Op.ne]: 'Incomplete' }
        }
      });

      const courtCaseCount = await courtCaseModel.count({
        where: {
          status: { [Op.ne]: 0 }
        }
      });

      const repairCount = await repairMaintainModel.count({
        where: {
          [Op.or]: [
            { door_status: "Pending" }, { window_status: "Pending" },
            { wall_status: "Pending" }, { ceiling_status: "Pending" },
            { wiring_status: "Pending" }, { tank_status: "Pending" },
            { roof_status: "Pending" }, { door_status: "Complete" },
            { window_status: "Complete" }, { wall_status: "Complete" },
            { ceiling_status: "Complete" }, { wiring_status: "Complete" },
            { tank_status: "Complete" }, { roof_status: "Complete" }
          ]
        }
      });

      return res.status(200).send({
        departmentCount,
        encroachCount,
        quarterCount,
        applicationCount,
        renewalCount,
        nonAcooCount,
        repairCount,
        courtCaseCount
      });
    } catch (err) {
      return res.status(400).send(err);
    }
  },

  async userHomeCounter(req, res) {
    try {
      const userId = req.body.requestObject || req.body.userId;

      // 1. Fresh Application Count for this user
      const applyCount = await applicationModel.count({
        where: {
          userId: userId,
          is_deleted: "No"
        }
      });

      // 2. Renewal Count for this user
      const renewalCount = await quarterAllotmentModel.count({
        where: {
          userId: userId,
          status: { [Op.ne]: 'Incomplete' }
        }
      });

      // 3. Non-Accommodation Count for this user
      const nonAcooCount = await nonAccomodation.count({
        where: {
          userId: userId,
          status: 'Approved'
        }
      });

      return res.status(200).send({
        applyCount,
        renewalCount,
        nonAcooCount
      });
    } catch (err) {
      return res.status(400).send(err);
    }
  }
};