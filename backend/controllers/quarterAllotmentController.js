'use strict';

const departmentModel = require('../models').department;
const quarterAllotmentModel = require('../models').quarterAllotment;
const sectorModel = require('../models').sector;
const locationModel = require('../models').location;
const usersModel = require('../models').users;
const path = require('path');
const ExifImage = require('exif').ExifImage;
const { Op } = require('sequelize');
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'production';
const config = require(path.join(__dirname, '/../config/config.json'))[env];

const { createUploadConfig, createEntityDirectory } = require('../helpers/fileUploadHelper');

// ─── Multer config ────────────────────────────────────────────────────────────
const upload_config = createUploadConfig({
  basePath: config.FILE_UPLOAD_PATH,
  subFolder: 'user',
  useIdSubfolder: true
});

// ─── Shared error handler ─────────────────────────────────────────────────────
function dbError(res, err) {
  console.error('[quarterAllotmentController] DB error:', err.message || err);
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
      console.error('[quarterAllotmentController] checkDirectory error:', err.message);
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
      const dest = createEntityDirectory(projectId, null, config.FILE_UPLOAD_PATH);
      if (typeof callback === 'function') callback({ status: true, path: dest });
    } catch (err) {
      console.error('[quarterAllotmentController] createDirectory error:', err.message);
      if (typeof callback === 'function') callback({ status: false, error: err.message });
    }
  },

  // ── Apply for renewal ─────────────────────────────────────────────────────
  quarterRenewalApply(req, res) {
    const r = req.body.requestObject;
    return quarterAllotmentModel
      .create({
        qrtr_no: r.qrtr_no,
        qrtr_type: r.type,
        locationId: r.loc_id,
        sectorId: r.sec_id,
        qrtr_longitude: r.qrtr_longitude,
        qrtr_letitude: r.qrtr_letitude,
        map_loc: r.map_loc,
        d_w: r.d_w,
        e_w: r.e_w,
        r_c: r.r_c,
        s_q: r.s_q,
        s_t: r.s_t,
        qtr_extnd: r.qtr_extnd,
        type_of_strc: r.type_of_strc,
        area_extnd_strc: r.area_extnd_strc,
        extnd_prmsn: r.extnd_prmsn,
        strc_nearby: r.strc_nearby,
        strc_by_whm: r.strc_by_whm,
        strc_distance: r.strc_distance,
        strc_type: r.strc_type,
        strc_allot: r.strc_allot,
        strc_area: r.strc_area,
        strc_storeys: r.strc_storeys,
        reference_no: r.reference_no,
        userId: r.userID,
        status: 'Incomplete'
      })
      .then(project => res.status(200).send({ message: project.id, status: true }))
      .catch(err => dbError(res, err));
  },

  // ── Quarter apply details ──────────────────────────────────────────────────
  quarterApplyDetails(req, res) {
    return quarterAllotmentModel
      .findOne({
        where: { userId: req.body.requestObject },
        raw: true,
        include: [
          { model: sectorModel, required: false, attributes: ['sctr_name'] },
          { model: locationModel, required: false, attributes: ['loc_name'] }
        ],
        attributes: [
          'id', 'qrtr_no', 'qrtr_type', 'qrtr_longitude', 'qrtr_letitude', 'map_loc',
          'd_w', 'e_w', 'r_c', 's_q', 's_t', 'qtr_extnd', 'type_of_strc', 'area_extnd_strc',
          'extnd_prmsn', 'strc_nearby', 'strc_by_whm', 'strc_distance', 'strc_type', 'strc_allot',
          'strc_area', 'strc_storeys', 'reference_no', 'status', 'allot_order', 'photo_1', 'photo_2',
          'photo_3', 'photo_4', 'extnd_doc', 'startDate', 'renewalDate', 'remark',
          [Sequelize.col('sector.sctr_name'), 'sctr_name'],
          [Sequelize.col('location.loc_name'), 'loc_name']
        ]
      })
      .then(data => res.status(200).send(data))
      .catch(err => dbError(res, err));
  },

  // ── File uploads (keyed by userId stored as dbid) ─────────────────────────
  uploadOrderFile(req, res) {
    if (!req.file) return res.status(400).send({ status: false, message: 'File not found' });
    quarterAllotmentModel
      .update({ allot_order: req.file.filename }, { where: { userId: req.body.dbid } })
      .then(() => res.status(200).send({ status: true, message: req.body.dbid }))
      .catch(err => dbError(res, err));
  },

  uploadSideOneImage(req, res) {
    if (!req.file) return res.status(400).send({ status: false, message: 'File not found' });
    quarterAllotmentModel
      .update({ photo_1: req.file.filename }, { where: { userId: req.body.dbid } })
      .then(() => res.status(200).send({ status: true, message: req.body.dbid }))
      .catch(err => dbError(res, err));
  },

  uploadSideTwoImage(req, res) {
    if (!req.file) return res.status(400).send({ status: false, message: 'File not found' });
    quarterAllotmentModel
      .update({ photo_2: req.file.filename }, { where: { userId: req.body.dbid } })
      .then(() => res.status(200).send({ status: true, message: req.body.dbid }))
      .catch(err => dbError(res, err));
  },

  uploadSideThreeImage(req, res) {
    if (!req.file) return res.status(400).send({ status: false, message: 'File not found' });
    quarterAllotmentModel
      .update({ photo_3: req.file.filename }, { where: { userId: req.body.dbid } })
      .then(() => res.status(200).send({ status: true, message: req.body.dbid }))
      .catch(err => dbError(res, err));
  },

  uploadSideFourImage(req, res) {
    if (!req.file) return res.status(400).send({ status: false, message: 'File not found' });
    quarterAllotmentModel
      .update({ photo_4: req.file.filename }, { where: { userId: req.body.dbid } })
      .then(() => res.status(200).send({ status: true, message: req.body.dbid }))
      .catch(err => dbError(res, err));
  },

  uploadQtrExtndImage(req, res) {
    if (!req.file) return res.status(400).send({ status: false, message: 'File not found' });
    quarterAllotmentModel
      .update({ extnd_doc: req.file.filename }, { where: { userId: req.body.dbid } })
      .then(() => res.status(200).send({ status: true, message: req.body.dbid }))
      .catch(err => dbError(res, err));
  },

  // ── Save final form (submit application) ──────────────────────────────────
  saveFinalForm(req, res) {
    const r = req.body.requestObject;
    // NOTE: "Appllied" is intentionally kept to match existing DB values.
    // A database migration is required before correcting this typo to "Applied".
    quarterAllotmentModel
      .update(
        { reference_no: r.reference_no, status: 'Appllied', applyDate: r.apply_date },
        { where: { userId: r.userID } }
      )
      .then(() => res.status(200).send({ status: true, message: r.userID }))
      .catch(err => dbError(res, err));
  },

  // ── Listing ────────────────────────────────────────────────────────────────
  renewalApplyList(req, res) {
    return quarterAllotmentModel
      .findAll({
        where: { status: { [Op.ne]: 'Incomplete' } },
        order: [['id', 'DESC']],
        raw: true,
        include: [
          {
            model: usersModel,
            required: false,
            attributes: ['id', 'f_name', 'l_name', 'designation', 'civic_charge', 'gender'],
            include: [{ model: departmentModel, required: false, attributes: ['dept_name'] }]
          },
          { model: sectorModel, required: false, attributes: ['sctr_name', 'id'] },
          { model: locationModel, required: false, attributes: ['loc_name', 'id'] }
        ],
        attributes: [
          'id', 'qrtr_no', 'qrtr_type', 'applyDate', 'reference_no', 'status', 'startDate', 'upload_signed_copy',
          [Sequelize.col('sector.sctr_name'), 'sctr_name'],
          [Sequelize.col('location.loc_name'), 'loc_name']
        ]
      })
      .then(data => res.status(200).send(data))
      .catch(err => dbError(res, err));
  },

  renewalApprovedList(req, res) {
    return quarterAllotmentModel
      .findAll({
        where: { status: 'Approved' },
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
          'id', 'qrtr_no', 'qrtr_type', 'applyDate', 'reference_no', 'status',
          'startDate', 'upload_signed_copy', 'map_loc', 'allot_order',
          [Sequelize.col('sector.sctr_name'), 'sctr_name'],
          [Sequelize.col('location.loc_name'), 'loc_name']
        ]
      })
      .then(data => res.status(200).send(data))
      .catch(err => dbError(res, err));
  },

  renewalApplyData(req, res) {
    return quarterAllotmentModel
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

  // ── Accept / Reject ────────────────────────────────────────────────────────
  acceptQuarterRenewal(req, res) {
    const r = req.body.requestObject;
    quarterAllotmentModel
      .update(
        { map_loc: r.map_loc, status: r.status, remark: r.remark, startDate: r.startDate, renewalDate: r.renewalDate },
        { where: { id: r.rqstId } }
      )
      .then(() => res.status(200).send({ status: true, message: r.rqstId }))
      .catch(err => dbError(res, err));
  },

  rejectQuarterRenewal(req, res) {
    const r = req.body.requestObject;
    quarterAllotmentModel
      .update({ status: r.status, remark: r.remark }, { where: { id: r.rqstId } })
      .then(() => res.status(200).send({ status: true, message: r.rqstId }))
      .catch(err => dbError(res, err));
  },

  // ── Count (async/await with proper try/catch) ──────────────────────────────
  async quarterRenewalCount(req, res) {
    try {
      // NOTE: "Appllied" matches existing DB values — fix pending DB migration.
      const [renewTotal, renewPending, renewRejected, renewApproved] = await Promise.all([
        quarterAllotmentModel.count({ where: { status: { [Op.ne]: 'Incomplete' } } }),
        quarterAllotmentModel.count({ where: { status: 'Appllied' } }),
        quarterAllotmentModel.count({ where: { status: 'Rejected' } }),
        quarterAllotmentModel.count({ where: { status: 'Approved' } })
      ]);
      return res.status(200).send({ renewTotal, renewPending, renewRejected, renewApproved });
    } catch (err) {
      return dbError(res, err);
    }
  },

  // ── Upload signed copy ─────────────────────────────────────────────────────
  uploadSignedCopy(req, res) {
    if (!req.file) return res.status(400).send({ status: false, message: 'File not found' });
    return quarterAllotmentModel
      .update({ upload_signed_copy: req.file.filename }, { where: { id: req.body.allotmentId } })
      .then(() => res.status(200).send({ status: true, message: req.body.allotmentId }))
      .catch(err => dbError(res, err));
  },

  // ── Update allotment (patch-style) ────────────────────────────────────────
  updateQuarterAllotment(req, res) {
    const requestData = req.body.requestObject || req.body || {};
    const targetId = requestData.id || requestData.allotmentId;
    if (!targetId) {
      return res.status(400).send({ status: false, message: 'Allotment ID required' });
    }
    const newData = {};
    if (requestData.qrtr_no !== undefined) newData.qrtr_no = requestData.qrtr_no;
    if (requestData.qrtr_type !== undefined) newData.qrtr_type = requestData.qrtr_type;
    if (requestData.sec_id !== undefined || requestData.sectorId !== undefined)
      newData.sectorId = requestData.sec_id !== undefined ? requestData.sec_id : requestData.sectorId;
    if (requestData.loc_id !== undefined || requestData.locationId !== undefined)
      newData.locationId = requestData.loc_id !== undefined ? requestData.loc_id : requestData.locationId;
    if (requestData.qrtr_longitude !== undefined) newData.qrtr_longitude = requestData.qrtr_longitude;
    if (requestData.qrtr_letitude !== undefined) newData.qrtr_letitude = requestData.qrtr_letitude;
    if (requestData.map_loc !== undefined) newData.map_loc = requestData.map_loc;
    if (requestData.reference_no !== undefined) newData.reference_no = requestData.reference_no;
    if (requestData.d_w !== undefined) newData.d_w = requestData.d_w;
    if (requestData.e_w !== undefined) newData.e_w = requestData.e_w;
    if (requestData.r_c !== undefined) newData.r_c = requestData.r_c;
    if (requestData.s_q !== undefined) newData.s_q = requestData.s_q;
    if (requestData.s_t !== undefined) newData.s_t = requestData.s_t;
    if (requestData.qtr_extnd !== undefined) newData.qtr_extnd = requestData.qtr_extnd;
    if (requestData.type_of_strc !== undefined) newData.type_of_strc = requestData.type_of_strc;

    return quarterAllotmentModel
      .update(newData, { where: { id: targetId } })
      .then(result => res.status(200).send({ status: true, message: 'Quarter allotment updated successfully', data: result }))
      .catch(err => dbError(res, err));
  },

  // ── Update quarter form fields ─────────────────────────────────────────────
  updateQuarterForm(req, res) {
    const r = req.body.requestObject;
    const newData = {
      qrtr_no: r.qrtr_no,
      qrtr_type: r.qrtr_type,
      qrtr_longitude: r.qrtr_longitude,
      qrtr_letitude: r.qrtr_letitude,
      map_loc: r.map_loc,
      d_w: r.d_w,
      e_w: r.e_w,
      r_c: r.r_c,
      s_q: r.s_q,
      s_t: r.s_t,
      qtr_extnd: r.qtr_extnd,
      type_of_strc: r.type_of_strc,
      area_extnd_strc: r.area_extnd_strc,
      extnd_prmsn: r.extnd_prmsn,
      strc_nearby: r.strc_nearby,
      strc_by_whm: r.strc_by_whm,
      strc_distance: r.strc_distance,
      strc_type: r.strc_type,
      strc_allot: r.strc_allot,
      strc_area: r.strc_area,
      strc_storeys: r.strc_storeys
    };
    quarterAllotmentModel
      .update(newData, { where: { id: r.id } })
      .then(result => res.status(200).send(result))
      .catch(err => dbError(res, err));
  }
};