'use strict';

const quarterModel = require('../models').quarter;
const sectorModel = require('../models').sector;
const locationModel = require('../models').location;
const courtCaseModel = require('../models').courtCase;
const courtCaseImageModel = require('../models').courtCaseImage;
const departmentModel = require('../models').department;
const applicationModel = require('../models').application;
const quarterAllotmentModel = require('../models').quarterAllotment;
const quarterDeleteRequestModel = require('../models').quarterDeleteRequest;
const usersModel = require('../models').users;
const path = require('path');
const { Op } = require('sequelize');

const env = process.env.NODE_ENV || 'production';
const config = require(path.join(__dirname, '/../config/config.json'))[env];

const { createUploadConfig } = require('../helpers/fileUploadHelper');

// ─── Shared error handler ─────────────────────────────────────────────────────
function dbError(res, err) {
  console.error('[QuarterController] DB error:', err.message || err);
  return res.status(500).send({ status: false, message: 'An internal server error occurred.' });
}



module.exports = {



  upload_config: createUploadConfig({
    basePath: config.FILE_UPLOAD_PATH,
    subFolder: 'quarter_user',
    useIdSubfolder: false   // quarter files go flat into quarter_user/
  }),

  checkDirectory(directory, callback) {
    try {
      const { ensureDirectory } = require('../helpers/fileUploadHelper');
      ensureDirectory(directory);
      if (typeof callback === 'function') callback();
    } catch (err) {
      console.error('[QuarterController] checkDirectory error:', err.message);
      if (typeof callback === 'function') callback(err);
    }
  },




  getQuarter(req, res) {
    quarterModel
      .findAll({
        raw: true,
        where: {
          status: 1
        },
        include: [
          {
            model: sectorModel,
            required: false,
          },
          {
            model: locationModel,
            required: false,
          },
          {
            model: departmentModel,
            required: false,
          }
        ],
      })
      .then(quarter => res.status(200).send(quarter))
      .catch(err => dbError(res, err));
  },

  addQuarter(req, res) {

    return quarterModel
      .findOne({
        where: {
          qrtr_no: req.body.qrtr_no,
          sectorId: req.body.sec_id,
          locationId: req.body.loc_id,
          qrtr_type: req.body.type,
          status: 1
        }
      })
      .then(existingQuarter => {
        if (existingQuarter) {
          return res.status(400).send({
            status: false,
            message: 'Quarter with the same qrtr_no, sectorId, and locationId already exists'
          });
        } else {
          return quarterModel
            .create({
              allottee_name: req.body.allottee_name,
              designation: req.body.designation,
              gMapLink: req.body.gMapLink,
              qrtr_no: req.body.qrtr_no,
              qrtr_type: req.body.type,
              qrtr_longitude: req.body.qrtr_longitude,
              qrtr_letitude: req.body.qrtr_letitude,
              sectorId: req.body.sec_id,
              locationId: req.body.loc_id,
              departmentId: req.body.department_id,
              status: "1",
              allotment_order: req.file ? (req.file.filename || req.file.originalname) : null,
            })
            .then(project => {
              return res.status(200).send({
                status: true,
                message: "Quarter added successfully",
                quarterId: project.id
              });
            })
            .catch(err => dbError(res, err));
        }
      })
      .catch(err => dbError(res, err));
  },

  updateQuarter(req, res) {
    const reqObj = (req.body && req.body.requestObject) || {};
    const targetId = reqObj.ID || reqObj.id;
    if (!targetId) {
      return res.status(400).send({ status: false, message: 'Quarter ID is required' });
    }
    const newData = {};
    if (reqObj.allottee_name) newData.allottee_name = reqObj.allottee_name;
    if (reqObj.qrtr_no) newData.qrtr_no = reqObj.qrtr_no;
    if (reqObj.designation) newData.designation = reqObj.designation;
    if (reqObj.department_id) newData.departmentId = reqObj.department_id;
    if (reqObj.sec_id) newData.sectorId = reqObj.sec_id;
    if (reqObj.loc_id) newData.locationId = reqObj.loc_id;

    quarterModel
      .update(newData, {
        where: {
          id: targetId
        }
      })
      .then(p => res.status(200).send(p))
      .catch(err => dbError(res, err));
  },


  checkQuarter(req, res) {
    quarterModel
      .findAll({
        where: {
          sectorId: req.params.req,
          status: 1
        },
        raw: true
      })
      .then(data => res.status(200).send(data))
      .catch(err => dbError(res, err));
  },

  async deleteQuarter(req, res) {
    try {
      const requestObject = req.body.requestObject || {};
      const { table_from, status, qId, userId } = requestObject;

      if (!requestObject.approvedRequestId) {
        const requester = await usersModel.findOne({ where: { id: userId }, raw: true });
        if (!requester || requester.role !== 'admin') {
          return res.status(403).send({ status: false, message: 'Only admin users can request a quarter deletion.' });
        }
        const existing = await quarterDeleteRequestModel.findOne({
          where: { targetId: qId, tableFrom: table_from, status: 'Pending' }
        });
        if (existing) {
          return res.status(409).send({ status: false, message: 'A deletion request for this quarter is already pending.' });
        }
        await quarterDeleteRequestModel.create({
          targetId: qId, tableFrom: table_from, requestedById: requester.id,
          requestedByName: `${requester.f_name || ''} ${requester.l_name || ''}`.trim(),
          status: 'Pending'
        });
        return res.status(202).send({ status: true, message: 'Deletion request sent to SuperAdmin for approval.' });
      }

      const approvedRequest = await quarterDeleteRequestModel.findOne({
        where: { id: requestObject.approvedRequestId, targetId: qId, tableFrom: table_from, status: 'Approved' }
      });
      if (!approvedRequest) {
        return res.status(403).send({ status: false, message: 'An approved deletion request is required.' });
      }

      if (table_from === 'data3') {
        const result = await applicationModel.update({ is_deleted: 'Yes' }, { where: { id: qId } });
        return res.status(200).send({ message: 'Updated in data3 table', data: result });
      }
      const result = await quarterModel.update({ status }, { where: { id: qId } });
      return res.status(200).send({ message: result });
    } catch (err) {
      return dbError(res, err);
    }
  },

  async getQuarterDeleteRequests(req, res) {
    try {
      const requestObject = req.body.requestObject || {};
      const reviewer = await usersModel.findOne({ where: { id: requestObject.userId }, raw: true });
      if (!reviewer || reviewer.role !== 'admin' || reviewer.accessKeyword !== 'SuperAdmin') {
        return res.status(403).send({ status: false, message: 'Only SuperAdmin can view deletion requests.' });
      }
      const requests = await quarterDeleteRequestModel.findAll({
        where: { status: 'Pending' }, order: [['createdAt', 'DESC']], raw: true
      });
      const requestsWithQuarterDetails = await Promise.all(requests.map(async (deleteRequest) => {
        const sourceModel = deleteRequest.tableFrom === 'data1' ? quarterModel
          : deleteRequest.tableFrom === 'data2' ? quarterAllotmentModel
            : applicationModel;
        const quarter = await sourceModel.findOne({
          where: { id: deleteRequest.targetId },
          include: [
            { model: sectorModel, required: false, attributes: ['sctr_name'] },
            { model: locationModel, required: false, attributes: ['loc_name'] },
            ...(deleteRequest.tableFrom === 'data1' ? [] : [{ model: usersModel, required: false, attributes: ['f_name', 'l_name'] }])
          ],
          raw: true
        });
        return {
          ...deleteRequest,
          allotteeName: quarter?.allottee_name || `${quarter?.['user.f_name'] || ''} ${quarter?.['user.l_name'] || ''}`.trim() || '-',
          locationName: quarter?.['location.loc_name'] || '-',
          sectorName: quarter?.['sector.sctr_name'] || '-',
          quarterNo: quarter?.qrtr_no || '-',
          quarterType: quarter?.qrtr_type || '-'
        };
      }));
      return res.status(200).send(requestsWithQuarterDetails);
    } catch (err) {
      return dbError(res, err);
    }
  },

  async reviewQuarterDeleteRequest(req, res) {
    try {
      const requestObject = req.body.requestObject || {};
      const reviewer = await usersModel.findOne({ where: { id: requestObject.userId }, raw: true });
      if (!reviewer || reviewer.role !== 'admin' || reviewer.accessKeyword !== 'SuperAdmin') {
        return res.status(403).send({ status: false, message: 'Only SuperAdmin can approve or reject deletion requests.' });
      }
      if (!['Approved', 'Rejected'].includes(requestObject.decision)) {
        return res.status(400).send({ status: false, message: 'Invalid review decision.' });
      }
      const [updated] = await quarterDeleteRequestModel.update(
        { status: requestObject.decision, reviewedById: reviewer.id, reviewedAt: new Date() },
        { where: { id: requestObject.requestId, status: 'Pending' } }
      );
      if (!updated) return res.status(404).send({ status: false, message: 'Pending deletion request not found.' });
      if (requestObject.decision === 'Rejected') {
        return res.status(200).send({ status: true, message: 'Deletion request rejected.' });
      }
      const pendingRequest = await quarterDeleteRequestModel.findByPk(requestObject.requestId, { raw: true });
      req.body.requestObject = { qId: pendingRequest.targetId, table_from: pendingRequest.tableFrom, status: 0, approvedRequestId: pendingRequest.id };
      return module.exports.deleteQuarter(req, res);
    } catch (err) {
      return dbError(res, err);
    }
  },

  updateQuarterData(req, res) {
    const requestData = req.body;

    // ✅ Common condition for duplicate check
    const whereCondition = {
      qrtr_no: requestData.qrtr_no,
      sectorId: requestData.sec_id,
      locationId: requestData.loc_id,
      qrtr_type: requestData.qrtr_type,
    };

    // ✅ Check in quarters table (skip same record)
    const quarterCheck = quarterModel.findOne({
      where:
      {
        ...whereCondition,
        status: 1,
        id: { [Op.ne]: requestData.id }
      }
    });

    // ✅ Check in other two tables
    const allotmentCheck = quarterAllotmentModel.findOne({ where: whereCondition });
    const applicationCheck = applicationModel.findOne({ where: whereCondition });

    // ✅ Run all checks
    Promise.all([quarterCheck, allotmentCheck, applicationCheck])
      .then(([existingQuarter, existingAllotment, existingApplication]) => {
        if (existingQuarter || existingAllotment || existingApplication) {
          return res.status(400).send({
            status: false,
            message: "Quarter with the same Quarter No, Sector, Location, and Quarter Type already exists."
          });
        }


        const newData = {
          allottee_name: requestData.allottee_name,
          departmentId: requestData.department_id,
          designation: requestData.designation,
          gMapLink: requestData.gMapLink,
          qrtr_no: requestData.qrtr_no,
          qrtr_type: requestData.qrtr_type,
          sectorId: requestData.sec_id,
          locationId: requestData.loc_id,
          qrtr_longitude: requestData.qrtr_longitude,
          qrtr_letitude: requestData.qrtr_letitude,
        };

        // Return this promise to keep the chain clean
        return quarterModel.update(newData, {
          where: { id: requestData.id }
        });
      })
      .then(updateResult => {
        if (!updateResult) {
          return; // In case the earlier branch already sent response
        }

        if (updateResult[0] === 0) {
          return res.status(404).send({ status: false, message: 'Quarter not found or nothing changed.' });
        }

        return res.status(200).send({ status: true, message: 'Quarter updated successfully.' });
      })
      .catch(err => {
        if (!res.headersSent) dbError(res, err);
      });
  },




  updatePhoto2(req, res) {
    const savedFilename = req.file ? (req.file.filename || req.file.originalname) : null;
    let fieldObj = null;
    if (req.body.photo_number == "Allot") fieldObj = { allotment_order: savedFilename };
    else if (req.body.photo_number == "photo1") fieldObj = { photo_1: savedFilename };
    else if (req.body.photo_number == "photo2") fieldObj = { photo_2: savedFilename };
    else if (req.body.photo_number == "photo3") fieldObj = { photo_3: savedFilename };
    else if (req.body.photo_number == "photo4") fieldObj = { photo_4: savedFilename };

    if (!fieldObj) {
      return res.status(400).send({ status: false, message: 'Invalid photo number' });
    }

    quarterModel
      .update(fieldObj, {
        where: {
          id: req.body.dbid
        }
      })
      .then(() => {
        return res.status(200).send({ status: true, message: req.body.dbid, filename: savedFilename });
      })
      .catch(err => dbError(res, err));
  },
};
