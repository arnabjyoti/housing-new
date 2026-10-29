'use strict';

const usersModel = require('../models').users;
const departmentModel = require('../models').department;
const path = require('path');
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'production';
const config = require(path.join(__dirname, '/../config/config.json'))[env];

const { createUploadConfig, createEntityDirectory } = require('../helpers/fileUploadHelper');

// ─── Multer config (user uploads keyed by req.body.dbid) ──────────────────
const upload_config = createUploadConfig({
  basePath: config.FILE_UPLOAD_PATH,
  subFolder: 'user',
  useIdSubfolder: true
});

// ─── Shared DB error handler ──────────────────────────────────────────────
function dbError(res, err) {
  console.error('[userController] DB error:', err.message || err);
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
      console.error('[userController] checkDirectory error:', err.message);
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
      console.error('[userController] createDirectory error:', err.message);
      if (typeof callback === 'function') callback({ status: false, error: err.message });
    }
  },

  // ── User detail lookup ─────────────────────────────────────────────────
  userDetails(req, res) {
    return usersModel
      .findOne({
        where: { id: req.body.requestObject },
        raw: true,
        include: [{ model: departmentModel, required: false }],
        attributes: [
          'id', 'f_name', 'l_name', 'email', 'role', 'phone_no', 'designation',
          'departmentId', 'basic_pay', 'pay_matrix', 'service_status', 'transferable',
          'doa', 'dor', 'dojs', 'dos', 'spouse_f_name', 'spouse_l_name', 'spouse_occ',
          'spouse_acco', 'resid_house', 'photo', 'sign', 'adhar', 'identity', 'appointment',
          'aadhaar_number',
          [Sequelize.col('department.dept_name'), 'department_name']
        ]
      })
      .then(data => res.status(200).send(data))
      .catch(err => dbError(res, err));
  },

  // ── Create user ────────────────────────────────────────────────────────
  createUser(req, res) {
    const r = req.body.requestObject || {};
    const aadhaar_number = r.aadhaar_number ? String(r.aadhaar_number).trim() : null;

    if (!aadhaar_number) {
      return res.status(400).send({ status: false, message: 'Aadhaar number is required.' });
    }

    return usersModel
      .findOne({ where: { aadhaar_number } })
      .then(existingUser => {
        if (existingUser) {
          return res.status(400).send({ status: false, message: 'Aadhaar number is already registered.' });
        }

        return usersModel
          .create({
            f_name: r.f_name,
            m_name: r.m_name,
            l_name: r.l_name,
            gender: r.gender,
            email: r.email,
            role: r.role,
            phone_no: r.phone_no,
            designation: r.designation,
            civic_charge: r.civic_charge,
            departmentId: r.department,
            others_dept: r.others_dept,
            basic_pay: r.basic_pay,
            pay_matrix: r.pay_matrix,
            service_status: r.service_status,
            transferable: r.transferable,
            doa: r.doa,
            dor: r.dor,
            dojs: r.dojs,
            dos: r.dos,
            spouse_f_name: r.spouse_f_name,
            spouse_l_name: r.spouse_l_name,
            spouse_occ: r.spouse_occ,
            spouse_acco: r.spouse_acco,
            resid_house: r.resid_house,
            aadhaar_number: aadhaar_number,
            active: 1
          })
          .then(project => {
            try { module.exports.createDirectory(project); } catch (e) { /* non-fatal */ }
            return res.status(200).send({ message: project.id, status: true });
          });
      })
      .catch(err => dbError(res, err));
  },

  // ── File uploads ───────────────────────────────────────────────────────
  uploadPan(req, res) {
    if (!req.file) return res.status(400).send({ status: false, message: 'File not found' });
    usersModel
      .update({ pan: req.file.filename }, { where: { id: req.body.dbid } })
      .then(() => res.status(200).send({ message: req.body.dbid, status: true, filename: req.file.filename }))
      .catch(err => dbError(res, err));
  },

  uploadAnx(req, res) {
    if (!req.file) return res.status(400).send({ status: false, message: 'File not found' });
    usersModel
      .update({ annexure_a: req.file.filename }, { where: { id: req.body.dbid } })
      .then(() => res.status(200).send({ message: req.body.dbid, status: true, filename: req.file.filename }))
      .catch(err => dbError(res, err));
  },

  uploadAdhar(req, res) {
    if (!req.file) return res.status(400).send({ status: false, message: 'File not found' });
    usersModel
      .update({ adhar: req.file.filename }, { where: { id: req.body.dbid } })
      .then(() => res.status(200).send({ message: req.body.dbid, status: true, filename: req.file.filename }))
      .catch(err => dbError(res, err));
  },

  uploadPhoto(req, res) {
    if (!req.file) return res.status(400).send({ status: false, message: 'File not found' });
    usersModel
      .update({ photo: req.file.filename }, { where: { id: req.body.dbid } })
      .then(() => res.status(200).send({ message: req.body.dbid, status: true, filename: req.file.filename }))
      .catch(err => dbError(res, err));
  },

  uploadSign(req, res) {
    if (!req.file) return res.status(400).send({ status: false, message: 'File not found' });
    usersModel
      .update({ sign: req.file.filename }, { where: { id: req.body.dbid } })
      .then(() => res.status(200).send({ message: req.body.dbid, status: true, filename: req.file.filename }))
      .catch(err => dbError(res, err));
  },

  uploadIcard(req, res) {
    if (!req.file) return res.status(400).send({ status: false, message: 'File not found' });
    usersModel
      .update({ identity: req.file.filename }, { where: { id: req.body.dbid } })
      .then(() => res.status(200).send({ message: req.body.dbid, status: true, filename: req.file.filename }))
      .catch(err => dbError(res, err));
  },

  uploadAppointment(req, res) {
    if (!req.file) return res.status(400).send({ status: false, message: 'File not found' });
    usersModel
      .update({ appointment: req.file.filename }, { where: { id: req.body.dbid } })
      .then(() => res.status(200).send({ message: req.body.dbid, status: true, filename: req.file.filename }))
      .catch(err => dbError(res, err));
  },

  // ── Profile update ─────────────────────────────────────────────────────
  updateUserData(req, res) {
    const r = (req.body && req.body.requestObject) || {};
    const newData = {
      f_name: r.f_name,
      l_name: r.l_name,
      phone_no: r.phone_no,
      designation: r.designation,
      departmentId: r.departmentId,
      basic_pay: r.basic_pay,
      pay_matrix: r.pay_matrix,
      service_status: r.service_status,
      transferable: r.transferable,
      doa: r.doa,
      dor: r.dor,
      dojs: r.dojs,
      dos: r.dos,
      spouse_f_name: r.spouse_f_name,
      spouse_l_name: r.spouse_l_name,
      spouse_occ: r.spouse_occ,
      spouse_acco: r.spouse_acco,
      resid_house: r.resid_house
    };

    if (r.aadhaar_number !== undefined && r.aadhaar_number !== null && String(r.aadhaar_number).trim() !== '') {
      const aadhaar_number = String(r.aadhaar_number).trim();
      return usersModel
        .findOne({
          where: {
            aadhaar_number,
            id: { [Sequelize.Op.ne]: r.id }
          }
        })
        .then(existing => {
          if (existing) {
            return res.status(400).send({ status: false, message: 'Aadhaar number is already registered.' });
          }
          newData.aadhaar_number = aadhaar_number;
          return usersModel
            .update(newData, { where: { id: r.id } })
            .then(() => res.status(200).send({ message: r.id, status: true, aadhaar_number }));
        })
        .catch(err => dbError(res, err));
    }

    return usersModel
      .update(newData, { where: { id: r.id } })
      .then(() => res.status(200).send({ message: r.id, status: true }))
      .catch(err => dbError(res, err));
  },

  // ── Quarter request data update ────────────────────────────────────────
  updateQuarterRequest(req, res) {
    const r = (req.body && req.body.requestObject) || {};
    const newData = {
      f_name: r.f_name,
      l_name: r.l_name,
      gender: r.gender,
      phone_no: r.phone_no,
      designation: r.designation,
      basic_pay: r.basic_pay,
      pay_matrix: r.pay_matrix,
      service_status: r.service_status,
      transferable: r.transferable,
      doa: r.doa,
      dor: r.dor,
      dojs: r.dojs,
      dos: r.dos,
      spouse_f_name: r.spouse_f_name,
      spouse_l_name: r.spouse_l_name,
      spouse_occ: r.spouse_occ,
      spouse_acco: r.spouse_acco,
      resid_house: r.resid_house
    };
    usersModel
      .update(newData, { where: { id: r.user_id } })
      .then(result => res.status(200).send(result))
      .catch(err => dbError(res, err));
  }
};