'use strict';

const nocPromotion = require('../models').nocPromotion;
const usersModel = require('../models').users;
const departmentModel = require('../models').department;
const nonAccomodation = require('../models').nonAccomodation;
const path = require('path');
const { Op } = require('sequelize');

const env = process.env.NODE_ENV || 'production';
const config = require(path.join(__dirname, '/../config/config.json'))[env];

const { createUploadConfig, createEntityDirectory } = require('../helpers/fileUploadHelper');

// ─── Multer config (keyed by req.body.userId) ─────────────────────────────────
const upload_config = createUploadConfig({
  basePath: config.FILE_UPLOAD_PATH,
  subFolder: 'user',
  useIdSubfolder: true,
  getIdFromReq: (req) => (req.body && req.body.userId) || 'default'
});

// ─── Shared error handler ─────────────────────────────────────────────────────
function dbError(res, err) {
  console.error('[certificateController] DB error:', err.message || err);
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
      console.error('[certificateController] checkDirectory error:', err.message);
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
      console.error('[certificateController] createDirectory error:', err.message);
      if (typeof callback === 'function') callback({ status: false, error: err.message });
    }
  },

  // ── NOC Permission ─────────────────────────────────────────────────────────
  addNocPermission(req, res) {
    return nocPromotion
      .create({
        spouse_qrtr_avail: req.body.spouse_qrtr_avail,
        spouse_qrtr_no_type: req.body.spouse_qrtr_no_type,
        spouse_qrtr_sctr_loc: req.body.spouse_qrtr_sctr_loc,
        spouse_qrtr_enc: req.body.spouse_qrtr_enc,
        spouse_qrtr_enc_name: req.body.spouse_qrtr_enc_name,
        spouse_qrtr_enc_nature: req.body.spouse_qrtr_enc_nature,
        annexure_c: req.file ? req.file.filename : null,
        referenceNo: req.body.referenceNo,
        remark: req.body.remark,
        status: 'Applied',
        applyDate: req.body.applyDate,
        userId: req.body.userId
      })
      .then(project => res.status(200).send({ message: project.id, status: true }))
      .catch(err => dbError(res, err));
  },

  nocPromotionData(req, res) {
    return nocPromotion
      .findOne({ where: { userId: req.body.requestObject }, raw: true, order: [['createdAt', 'DESC']] })
      .then(data => res.status(200).send(data))
      .catch(err => dbError(res, err));
  },

  /**
   * NOTE: The include array was duplicated in the original (two `include` keys on the same object,
   * so only the last one was applied). Fixed to use a single include with both models.
   */
  getNocPromotionData(req, res) {
    return nocPromotion
      .findAll({
        raw: true,
        order: [['id', 'ASC']],
        include: [
          { model: usersModel, required: false },
          { model: departmentModel, required: false }
        ]
      })
      .then(data => res.status(200).send(data))
      .catch(err => dbError(res, err));
  },

  // ── No Accommodation ───────────────────────────────────────────────────────
  addNoAccomodation(req, res) {
    return nonAccomodation
      .create({
        spouse_qrtr_avail: req.body.spouse_qrtr_avail,
        spouse_qrtr_no_type: req.body.spouse_qrtr_no_type,
        spouse_qrtr_sctr_loc: req.body.spouse_qrtr_sctr_loc,
        spouse_qrtr_enc: req.body.spouse_qrtr_enc,
        spouse_qrtr_enc_name: req.body.spouse_qrtr_enc_name,
        spouse_qrtr_enc_nature: req.body.spouse_qrtr_enc_nature,
        annexure_b: req.file ? req.file.filename : null,
        referenceNo: req.body.referenceNo,
        remark: req.body.remark,
        status: 'Applied',
        applyDate: req.body.applyDate,
        place: req.body.place,
        userId: req.body.userId
      })
      .then(project => res.status(200).send({ message: project.id, status: true }))
      .catch(err => dbError(res, err));
  },

  noAccomodationData(req, res) {
    return nonAccomodation
      .findOne({ where: { userId: req.body.requestObject }, raw: true, order: [['createdAt', 'DESC']] })
      .then(data => res.status(200).send(data))
      .catch(err => dbError(res, err));
  },

  getNonAccoData(req, res) {
    return nonAccomodation
      .findAll({
        raw: true,
        order: [['id', 'ASC']],
        include: [
          {
            model: usersModel,
            required: false,
            include: [{ model: departmentModel, required: false }]
          }
        ]
      })
      .then(data => res.status(200).send(data))
      .catch(err => dbError(res, err));
  },

  // ── Accept / Reject ────────────────────────────────────────────────────────
  acceptNoAcco(req, res) {
    const r = req.body.requestObject;
    const currentDate = new Date().toISOString().split('T')[0];
    const futureDate = (() => {
      const d = new Date(currentDate);
      d.setMonth(d.getMonth() + 6);
      return d.toISOString().split('T')[0];
    })();
    nonAccomodation
      .update(
        { status: r.status, remark: r.remark, approvedDate: currentDate, renewalDate: futureDate },
        { where: { id: r.rqstId } }
      )
      .then(() => res.status(200).send({ status: true, message: r.rqstId }))
      .catch(err => dbError(res, err));
  },

  rejectNoAcco(req, res) {
    const r = req.body.requestObject;
    nonAccomodation
      .update({ status: r.status, remark: r.remark }, { where: { id: r.rqstId } })
      .then(() => res.status(200).send({ status: true, message: r.rqstId }))
      .catch(err => dbError(res, err));
  },

  // ── Counts (async with proper try/catch) ───────────────────────────────────
  // NOTE: "Appllied" matches existing DB values — DB migration required to fix typo.
  async nocPromotionCount(req, res) {
    try {
      const [nocPromotionTotal, nocPromotionPending, nocPromotionRejected, nocPromotionApproved] = await Promise.all([
        nocPromotion.count({ where: { status: { [Op.ne]: 'Incomplete' } } }),
        nocPromotion.count({ where: { status: 'Appllied' } }),
        nocPromotion.count({ where: { status: 'Rejected' } }),
        nocPromotion.count({ where: { status: 'Approved' } })
      ]);
      return res.status(200).send({ nocPromotionTotal, nocPromotionPending, nocPromotionRejected, nocPromotionApproved });
    } catch (err) {
      return dbError(res, err);
    }
  },

  async noAccomodationCount(req, res) {
    try {
      const [noAccomodationTotal, noAccomodationPending, noAccomodationRejected, noAccomodationApproved] = await Promise.all([
        nonAccomodation.count({ where: { status: { [Op.ne]: 'Incomplete' } } }),
        nonAccomodation.count({ where: { status: 'Appllied' } }),
        nonAccomodation.count({ where: { status: 'Rejected' } }),
        nonAccomodation.count({ where: { status: 'Approved' } })
      ]);
      return res.status(200).send({ noAccomodationTotal, noAccomodationPending, noAccomodationRejected, noAccomodationApproved });
    } catch (err) {
      return dbError(res, err);
    }
  }
};