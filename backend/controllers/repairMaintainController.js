'use strict';

const usersModel = require('../models').users;
const repairMaintainModel = require('../models').repairMaintain;
const path = require('path');
const Sequelize = require('sequelize');
const { literal, Op } = require('sequelize');
const sectorModel = require('../models').sector;
const locationModel = require('../models').location;

const env = process.env.NODE_ENV || 'production';
const config = require(path.join(__dirname, '/../config/config.json'))[env];

const { createUploadConfig } = require('../helpers/fileUploadHelper');

// ─── Multer config ────────────────────────────────────────────────────────────
const upload_config = createUploadConfig({
  basePath: config.FILE_UPLOAD_PATH,
  subFolder: 'user',
  useIdSubfolder: true
});

// ─── Shared error handler ─────────────────────────────────────────────────────
function dbError(res, err) {
  console.error('[repairMaintainController] DB error:', err.message || err);
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
      console.error('[repairMaintainController] checkDirectory error:', err.message);
      if (typeof callback === 'function') callback(err);
    }
  },

  // ── Check if repair record exists ─────────────────────────────────────────
  checkRepairData(req, res) {
    return repairMaintainModel
      .findOne({
        where: { userId: req.body.requestObject },
        raw: true,
        include: [
          { model: sectorModel, required: false, attributes: ['sctr_name'] },
          { model: locationModel, required: false, attributes: ['loc_name'] }
        ],
        attributes: [
          'id', 'quarter_type', 'quarter_no', 'allotment_order',
          'door', 'door_status', 'door_update_date',
          'window', 'window_status', 'window_update_date',
          'wall', 'wall_status', 'wall_update_date',
          'ceiling', 'ceiling_status', 'ceiling_update_date',
          'wiring', 'wiring_status', 'wiring_update_date',
          'tank', 'tank_status', 'tank_update_date',
          'roof', 'roof_status', 'roof_update_date',
          [Sequelize.col('sector.sctr_name'), 'sctr_name'],
          [Sequelize.col('location.loc_name'), 'loc_name']
        ]
      })
      .then(data => res.status(200).send(data))
      .catch(err => dbError(res, err));
  },

  // ── List all pending / complete repairs ────────────────────────────────────
  RepairList(req, res) {
    const pendingOrComplete = [
      'door_status', 'window_status', 'wall_status',
      'ceiling_status', 'wiring_status', 'tank_status', 'roof_status'
    ].flatMap(col => [{ [col]: 'Pending' }, { [col]: 'Complete' }]);

    repairMaintainModel
      .findAll({
        raw: true,
        where: { [Op.or]: pendingOrComplete },
        include: [
          { model: usersModel, required: false, attributes: ['id', 'f_name', 'l_name'] },
          { model: sectorModel, required: false, attributes: ['sctr_name'] },
          { model: locationModel, required: false, attributes: ['loc_name'] }
        ],
        attributes: [
          'id', 'quarter_type', 'quarter_no', 'allotment_order',
          'door', 'door_status', 'door_update_date',
          'window', 'window_status', 'window_update_date',
          'wall', 'wall_status', 'wall_update_date',
          'ceiling', 'ceiling_status', 'ceiling_update_date',
          'wiring', 'wiring_status', 'wiring_update_date',
          'tank', 'tank_status', 'tank_update_date',
          'roof', 'roof_status', 'roof_update_date',
          [Sequelize.col('user.f_name'), 'f_name'],
          [Sequelize.col('user.id'), 'userId'],
          [Sequelize.col('user.l_name'), 'l_name'],
          [Sequelize.col('sector.sctr_name'), 'sctr_name'],
          [Sequelize.col('location.loc_name'), 'loc_name']
        ]
      })
      .then(data => res.status(200).send(data))
      .catch(err => dbError(res, err));
  },

  // ── Upload allotment order (creates new repair record) ────────────────────
  uploadAllotment(req, res) {
    if (!req.file) return res.status(400).send({ status: false, message: 'File not found' });
    return repairMaintainModel
      .create({
        quarter_no: req.body.qtr_no,
        quarter_type: req.body.type,
        locationId: req.body.loc_id,
        sectorId: req.body.sec_id,
        userId: req.body.dbid,
        allotment_order: req.file.filename
      })
      .then(project => res.status(200).send({ message: project.id, status: true }))
      .catch(err => dbError(res, err));
  },

  // ── Individual component uploads ──────────────────────────────────────────
  uploadDoor(req, res) {
    if (!req.file) return res.status(400).send({ status: false, message: 'File not found' });
    repairMaintainModel
      .update(
        { door_status: 'Pending', door_update_date: literal('CURRENT_DATE'), door: req.file.filename },
        { where: { id: req.body.repairId } }
      )
      .then(() => res.status(200).send({ message: req.body.repairId, status: true }))
      .catch(err => dbError(res, err));
  },

  uploadWindow(req, res) {
    if (!req.file) return res.status(400).send({ status: false, message: 'File not found' });
    repairMaintainModel
      .update(
        { window_status: 'Pending', window_update_date: literal('CURRENT_DATE'), window: req.file.filename },
        { where: { id: req.body.repairId } }
      )
      .then(() => res.status(200).send({ message: req.body.repairId, status: true }))
      .catch(err => dbError(res, err));
  },

  uploadWall(req, res) {
    if (!req.file) return res.status(400).send({ status: false, message: 'File not found' });
    repairMaintainModel
      .update(
        { wall_status: 'Pending', wall_update_date: literal('CURRENT_DATE'), wall: req.file.filename },
        { where: { id: req.body.repairId } }
      )
      .then(() => res.status(200).send({ message: req.body.repairId, status: true }))
      .catch(err => dbError(res, err));
  },

  uploadCeiling(req, res) {
    if (!req.file) return res.status(400).send({ status: false, message: 'File not found' });
    repairMaintainModel
      .update(
        { ceiling_status: 'Pending', ceiling_update_date: literal('CURRENT_DATE'), ceiling: req.file.filename },
        { where: { id: req.body.repairId } }
      )
      .then(() => res.status(200).send({ message: req.body.repairId, status: true }))
      .catch(err => dbError(res, err));
  },

  uploadWiring(req, res) {
    if (!req.file) return res.status(400).send({ status: false, message: 'File not found' });
    repairMaintainModel
      .update(
        { wiring_status: 'Pending', wiring_update_date: literal('CURRENT_DATE'), wiring: req.file.filename },
        { where: { id: req.body.repairId } }
      )
      .then(() => res.status(200).send({ message: req.body.repairId, status: true }))
      .catch(err => dbError(res, err));
  },

  uploadTank(req, res) {
    if (!req.file) return res.status(400).send({ status: false, message: 'File not found' });
    repairMaintainModel
      .update(
        { tank_status: 'Pending', tank_update_date: literal('CURRENT_DATE'), tank: req.file.filename },
        { where: { id: req.body.repairId } }
      )
      .then(() => res.status(200).send({ message: req.body.repairId, status: true }))
      .catch(err => dbError(res, err));
  },

  uploadRoof(req, res) {
    if (!req.file) return res.status(400).send({ status: false, message: 'File not found' });
    repairMaintainModel
      .update(
        { roof_status: 'Pending', roof_update_date: literal('CURRENT_DATE'), roof: req.file.filename },
        { where: { id: req.body.repairId } }
      )
      .then(() => res.status(200).send({ message: req.body.repairId, status: true }))
      .catch(err => dbError(res, err));
  }
};