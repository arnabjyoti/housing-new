'use strict';

const applicationModel = require('../models').application;
const usersModel = require('../models').users;
const departmentModel = require('../models').department;
const sectorModel = require('../models').sector;
const locationModel = require('../models').location;
const quarterAllotmentModel = require('../models').quarterAllotment;
const quarterModel = require('../models').quarter;
const path = require('path');
const { Op } = require('sequelize');
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'production';
const config = require(path.join(__dirname, '/../config/config.json'))[env];

const { createUploadConfig, createEntityDirectory } = require('../helpers/fileUploadHelper');

// ─── Multer config ────────────────────────────────────────────────────────────
const upload_config = createUploadConfig({
  basePath: config.FILE_UPLOAD_PATH,
  subFolder: 'user',
  useIdSubfolder: true,
  getIdFromReq: (req) => (req.body && (req.body.userId || req.body.dbid)) || 'default'
});

// ─── Shared error handler ─────────────────────────────────────────────────────
function dbError(res, err) {
  console.error('[applicationController] DB error:', err.message || err);
  return res.status(500).send({ status: false, message: 'An internal server error occurred.' });
}

module.exports = {
  upload_config,

  checkDirectory(directory, callback) {
    try {
      const { ensureDirectory } = require('../helpers/fileUploadHelper');
      ensureDirectory(directory);
      if (typeof callback === 'function') callback();
    } catch (err) {
      console.error('[applicationController] checkDirectory error:', err.message);
      if (typeof callback === 'function') callback(err);
    }
  },

  createDirectory(project, callback) {
    const projectId = project && (project.id || project);
    if (!projectId) {
      if (typeof callback === 'function') callback({ status: false, message: 'Invalid ID' });
      return;
    }
    try {
      const dest = createEntityDirectory(projectId, 'user', config.FILE_UPLOAD_PATH);
      if (typeof callback === 'function') callback({ status: true, path: dest });
    } catch (err) {
      console.error('[applicationController] createDirectory error:', err.message);
      if (typeof callback === 'function') callback({ status: false, error: err.message });
    }
  },

  // ── Counts (properly wrapped async) ──────────────────────────────────────
  async quarterAllocationCount(req, res) {
    try {
      const statusPending = { [Op.or]: [{ status: 'Apply' }, { status: 'Verified' }] };
      const [allocationTotal, allocationPending, allocationRejected, allocationApproved] = await Promise.all([
        applicationModel.count({
          where: { [Op.or]: [{ status: 'Apply' }, { status: 'Approved' }, { status: 'Verified' }, { status: 'Rejected' }] }
        }),
        applicationModel.count({ where: statusPending }),
        applicationModel.count({ where: { status: 'Rejected' } }),
        applicationModel.count({ where: { status: 'Approved' } })
      ]);
      return res.status(200).send({ allocationTotal, allocationPending, allocationRejected, allocationApproved });
    } catch (err) {
      return dbError(res, err);
    }
  },

  // ── Apply for fresh quarter ────────────────────────────────────────────────
  applyQuarter(req, res) {
    return applicationModel
      .create({
        anx_a: req.file ? req.file.filename : null,
        userId: req.body.dbid,
        departmentId: req.body.departmentId,
        reference_no: req.body.reference_no,
        map_loc: req.body.map_loc,
        apply_place: req.body.apply_place,
        apply_date: req.body.apply_date,
        status: 'Apply',
        status_type: 'Fresh',
        is_deleted: 'No'
      })
      .then(project => res.status(200).send({ message: project.reference_no, status: true }))
      .catch(err => dbError(res, err));
  },

  checkUser(req, res) {
    return applicationModel
      .findOne({ where: { userId: req.body.requestObject }, order: [['id', 'DESC']], raw: true })
      .then(data => res.status(200).send(data))
      .catch(err => dbError(res, err));
  },

  applyData(req, res) {
    return applicationModel
      .findAll({
        raw: true,
        include: [
          { model: usersModel, required: false },
          { model: departmentModel, required: false }
        ],
        order: [[usersModel, 'dojs', 'ASC']]
      })
      .then(data => res.status(200).send(data))
      .catch(err => dbError(res, err));
  },

  freshApplyData(req, res) {
    return applicationModel
      .findOne({
        where: { id: req.params.rqstId },
        order: [['id', 'DESC']],
        raw: true,
        include: [
          {
            model: usersModel,
            required: false,
            include: [{ model: departmentModel, required: false }]
          },
          { model: sectorModel, required: false },
          { model: locationModel, required: false }
        ]
      })
      .then(data => res.status(200).send(data))
      .catch(err => dbError(res, err));
  },

  // ── Admin decision actions ─────────────────────────────────────────────────
  acceptFreshQuarter(req, res) {
    const r = req.body.requestObject;
    applicationModel
      .update(
        { status: r.status, remark: r.remark, start_date: r.startDate, renewal_date: r.renewalDate },
        { where: { id: r.rqstId } }
      )
      .then(() => res.status(200).send({ message: r.rqstId, status: true }))
      .catch(err => dbError(res, err));
  },

  rejectFreshQuarter(req, res) {
    const r = req.body.requestObject;
    applicationModel
      .update({ status: r.status, remark: r.remark }, { where: { id: r.rqstId } })
      .then(() => res.status(200).send({ message: r.rqstId, status: true }))
      .catch(err => dbError(res, err));
  },

  verifiedFreshQuarter(req, res) {
    const r = req.body.requestObject;
    applicationModel
      .update({ status: r.status, remark: 'Application is verified', verify_date: r.startDate }, { where: { id: r.rqstId } })
      .then(() => res.status(200).send({ message: r.rqstId, status: true }))
      .catch(err => dbError(res, err));
  },

  allotedFreshQuarter(req, res) {
    const r = req.body.requestObject;
    applicationModel
      .update({ status: 'Allotted', allottedDate: r.allottedDate }, { where: { id: r.rqstId } })
      .then(() => res.status(200).send({ message: r.rqstId, status: true }))
      .catch(err => dbError(res, err));
  },

  getApproveFreshData(req, res) {
    return applicationModel
      .findAll({
        where: { status: 'Allotted', is_deleted: 'No' },
        order: [['id', 'DESC']],
        raw: true,
        include: [
          {
            model: usersModel,
            required: false,
            attributes: ['id', 'f_name', 'l_name', 'designation', 'civic_charge'],
            include: [{ model: departmentModel, required: false, attributes: ['dept_name'] }]
          },
          { model: sectorModel, required: false, attributes: ['sctr_name', 'id'] },
          { model: locationModel, required: false, attributes: ['loc_name', 'id'] }
        ],
        attributes: [
          'id', 'status_type', 'qrtr_no', 'qrtr_type', 'map_loc', 'allot_order',
          'userId', 'photo_1', 'photo_2', 'photo_3', 'photo_4',
          [Sequelize.col('sector.sctr_name'), 'sctr_name'],
          [Sequelize.col('location.loc_name'), 'loc_name']
        ]
      })
      .then(data => res.status(200).send(data))
      .catch(err => dbError(res, err));
  },

  // ── Update fresh quarter (duplicate check) ────────────────────────────────
  updateFreshQuarter(req, res) {
    const requestData = req.body;
    const whereCondition = {
      qrtr_no: requestData.qrtr_no,
      sectorId: requestData.sec_id,
      locationId: requestData.loc_id,
      qrtr_type: requestData.qrtr_type
    };

    Promise.all([
      quarterModel.findOne({ where: { ...whereCondition, status: 1 } }),
      quarterAllotmentModel.findOne({ where: whereCondition }),
      applicationModel.findOne({ where: { ...whereCondition, id: { [Op.ne]: requestData.id } } })
    ])
      .then(([existingQuarter, existingAllotment, existingApplication]) => {
        if (existingQuarter || existingAllotment || existingApplication) {
          return res.status(400).send({
            status: false,
            message: 'Quarter with the same Quarter No, Sector, Location, and Quarter Type already exists.'
          });
        }
        return applicationModel.update(
          { qrtr_no: requestData.qrtr_no, qrtr_type: requestData.qrtr_type, sectorId: requestData.sec_id, locationId: requestData.loc_id },
          { where: { id: requestData.id } }
        );
      })
      .then(updateResult => {
        if (!updateResult) return;
        if (updateResult[0] === 0) {
          return res.status(404).send({ status: false, message: 'Quarter not found or nothing changed.' });
        }
        return res.status(200).send({ status: true, message: 'Quarter updated successfully.' });
      })
      .catch(err => {
        if (!res.headersSent) dbError(res, err);
      });
  },

  // ── Update allotted photo ─────────────────────────────────────────────────
  updateQuarterAllotedPhoto(req, res) {
    const photoMap = {
      Allot: 'allot_order',
      photo1: 'photo_1',
      photo2: 'photo_2',
      photo3: 'photo_3',
      photo4: 'photo_4'
    };
    const fieldKey = photoMap[req.body.photo_number];
    if (!fieldKey) {
      return res.status(400).send({ status: false, message: 'Invalid photo number' });
    }
    const filename = req.file ? req.file.filename : null;
    applicationModel
      .update({ [fieldKey]: filename }, { where: { id: req.body.dbid } })
      .then(() => res.status(200).send({ message: req.body.dbid, status: true }))
      .catch(err => dbError(res, err));
  }
};