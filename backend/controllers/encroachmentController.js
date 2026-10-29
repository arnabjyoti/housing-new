'use strict';

const encroachmentModel = require('../models').encroachment;
const departmentModel = require('../models').department;
const sectorModel = require('../models').sector;
const locationModel = require('../models').location;
const usersModel = require('../models').users;
const encroachmentDeleteRequestModel = require('../models').encroachmentDeleteRequest;
const path = require('path');
const { Op } = require('sequelize');

const env = process.env.NODE_ENV || 'production';
const config = require(path.join(__dirname, '/../config/config.json'))[env];

const { createUploadConfig, createEntityDirectory } = require('../helpers/fileUploadHelper');

// ─── Multer config ────────────────────────────────────────────────────────────
const upload_config = createUploadConfig({
  basePath: config.FILE_UPLOAD_PATH,
  subFolder: 'encroachment',
  useIdSubfolder: true
});

// ─── Shared error handler ─────────────────────────────────────────────────────
function dbError(res, err) {
  console.error('[encroachmentController] DB error:', err.message || err);
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
      console.error('[encroachmentController] checkDirectory error:', err.message);
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
      const dest = createEntityDirectory(projectId, 'encroachment', config.FILE_UPLOAD_PATH);
      if (typeof callback === 'function') callback({ status: true, path: dest });
    } catch (err) {
      console.error('[encroachmentController] createDirectory error:', err.message);
      if (typeof callback === 'function') callback({ status: false, error: err.message });
    }
  },

  // ── Add encroachment record ────────────────────────────────────────────────
  addEncroachment(req, res) {
    const r = (req.body && req.body.requestObject) || {};
    const alloteeName = r.allotee_name ? String(r.allotee_name).toUpperCase() : null;

    return encroachmentModel
      .create({
        sectorId: r.sec_id || null,
        locationId: r.loc_id || null,
        qrtr_type: r.type || null,
        qrtr_no: r.qrtr_no || null,
        allotee_name: alloteeName,
        allotee_department: r.department || null,
        allotee_designation: r.allotee_designation || null,
        encroachment_details: r.encroachment_details || null,
        name_of_encroacher: r.name_of_encroacher || null,
        designation_of_encroacher: r.designation_of_encroacher || null,
        department_of_encroacher: r.department_of_encroacher || null,
        encroacher_designation: r.encroacher_designation || null,
        encroached_type: r.encroached_type || null,
        status_of_case: r.status_of_case || null,
        created_by: r.createdBy || null,
        quarterId: null,
        userId: null,
        departmentId: r.department || null,
        status: 1
      })
      .then(project => {
        try { module.exports.createDirectory(project); } catch (e) { /* non-fatal */ }
        return res.status(200).send({ message: project.id, status: true });
      })
      .catch(err => dbError(res, err));
  },

  // ── Image uploads ──────────────────────────────────────────────────────────
  uploadEncImgOne(req, res) {
    if (!req.file) return res.status(400).send({ status: false, message: 'File not found' });
    encroachmentModel
      .update({ photo_1: req.file.filename }, { where: { id: req.body.dbid } })
      .then(() => res.status(200).send({ message: req.body.dbid, status: true }))
      .catch(err => dbError(res, err));
  },

  uploadEncImgTwo(req, res) {
    if (!req.file) return res.status(400).send({ status: false, message: 'File not found' });
    encroachmentModel
      .update({ photo_2: req.file.filename }, { where: { id: req.body.dbid } })
      .then(() => res.status(200).send({ message: req.body.dbid, status: true }))
      .catch(err => dbError(res, err));
  },

  uploadEncImgThree(req, res) {
    if (!req.file) return res.status(400).send({ status: false, message: 'File not found' });
    encroachmentModel
      .update({ photo_3: req.file.filename }, { where: { id: req.body.dbid } })
      .then(() => res.status(200).send({ message: req.body.dbid, status: true }))
      .catch(err => dbError(res, err));
  },

  uploadEncImgFour(req, res) {
    if (!req.file) return res.status(400).send({ status: false, message: 'File not found' });
    encroachmentModel
      .update({ photo_4: req.file.filename }, { where: { id: req.body.dbid } })
      .then(() => res.status(200).send({ message: req.body.dbid, status: true }))
      .catch(err => dbError(res, err));
  },

  uploadEncImgFive(req, res) {
    if (!req.file) return res.status(400).send({ status: false, message: 'File not found' });
    encroachmentModel
      .update({ photo_5: req.file.filename }, { where: { id: req.body.dbid } })
      .then(() => res.status(200).send({ message: req.body.dbid, status: true }))
      .catch(err => dbError(res, err));
  },

  // ── List active encroachments ──────────────────────────────────────────────
  encroachData(req, res) {
    return encroachmentModel
      .findAll({
        order: [['id', 'DESC']],
        where: { status: 1 },
        raw: true,
        include: [
          { model: sectorModel, required: false, attributes: ['sctr_name', 'id'] },
          { model: locationModel, required: false, attributes: ['loc_name', 'id'] },
          { model: departmentModel, required: false, as: 'allotee_departmentID' },
          { model: departmentModel, required: false, as: 'department_of_encroacherID' }
        ]
      })
      .then(data => res.status(200).send(data))
      .catch(err => dbError(res, err));
  },

  // ── Update encroachment ────────────────────────────────────────────────────
  updateEncroach(req, res) {
    const r = req.body.requestObject;
    const newData = {
      allotee_name: r.allotee_name,
      allotee_designation: r.allotee_designation,
      allotee_department: r.allotee_dept_id,
      qrtr_type: r.qrtr_type,
      qrtr_no: r.qrtr_no,
      encroachment_details: r.encroachment_details,
      name_of_encroacher: r.name_of_encroacher,
      designation_of_encroacher: r.designation_of_encroacher,
      department_of_encroacher: r.department_id_of_encroacher,
      encroacher_designation: r.encroacher_designation,
      encroached_type: r.encroached_type,
      departmentId: r.departmentId,
      sectorId: r.sec_id,
      locationId: r.loc_id,
      quarterId: r.quarterId,
      userId: r.userId
    };
    encroachmentModel
      .update(newData, { where: { id: r.id } })
      .then(() => res.status(200).send({ message: r.id, status: true }))
      .catch(err => dbError(res, err));
  },

  // ── Update with photo swap ─────────────────────────────────────────────────
  updateEncroachWithPhotos(req, res) {
    const savedFilename = req.file ? (req.file.filename || req.file.originalname) : null;
    const photoMap = { photo1: 'photo_1', photo2: 'photo_2', photo3: 'photo_3', photo4: 'photo_4' };
    const fieldKey = photoMap[req.body.photo_number];
    if (!fieldKey) {
      return res.status(400).send({ status: false, message: 'Invalid photo number' });
    }
    encroachmentModel
      .update({ [fieldKey]: savedFilename }, { where: { id: req.body.dbid } })
      .then(() => res.status(200).send({ status: true, message: req.body.dbid, filename: savedFilename }))
      .catch(err => dbError(res, err));
  },

  // ── Delete / delete-request flow ──────────────────────────────────────────
  /**
   * Security note: role is validated against DB record but userId comes from req.body
   * (not JWT). This is flagged for improvement once authentication middleware is
   * applied uniformly to all routes — tracked as a Critical issue in the audit.
   */
  async deleteEncroach(req, res) {
    try {
      const requestObject = req.body.requestObject || {};

      if (!requestObject.approvedRequestId) {
        const requester = await usersModel.findOne({ where: { id: requestObject.userId }, raw: true });
        if (!requester || requester.role !== 'admin') {
          return res.status(403).send({ status: false, message: 'Only admin users can request an encroachment deletion.' });
        }
        const existing = await encroachmentDeleteRequestModel.findOne({
          where: { encroachmentId: requestObject.qId, status: 'Pending' }
        });
        if (existing) {
          return res.status(409).send({ status: false, message: 'An encroachment deletion request is already pending.' });
        }
        await encroachmentDeleteRequestModel.create({
          encroachmentId: requestObject.qId,
          requestedById: requester.id,
          requestedByName: `${requester.f_name || ''} ${requester.l_name || ''}`.trim(),
          status: 'Pending'
        });
        return res.status(202).send({ status: true, message: 'Deletion request sent to SuperAdmin for approval.' });
      }

      const approvedRequest = await encroachmentDeleteRequestModel.findOne({
        where: { id: requestObject.approvedRequestId, encroachmentId: requestObject.qId, status: 'Approved' }
      });
      if (!approvedRequest) {
        return res.status(403).send({ status: false, message: 'An approved deletion request is required.' });
      }

      // Soft-delete: mark status = 0
      await encroachmentModel.update(
        { status: requestObject.status },
        { where: { id: requestObject.qId } }
      );
      return res.status(200).send({ status: true, message: 'Encroachment deleted successfully.' });
    } catch (err) {
      return dbError(res, err);
    }
  },

  async getEncroachmentDeleteRequests(req, res) {
    try {
      const requestObject = req.body.requestObject || {};
      const reviewer = await usersModel.findOne({ where: { id: requestObject.userId }, raw: true });
      if (!reviewer || reviewer.role !== 'admin' || reviewer.accessKeyword !== 'SuperAdmin') {
        return res.status(403).send({ status: false, message: 'Only SuperAdmin can view deletion requests.' });
      }
      const requests = await encroachmentDeleteRequestModel.findAll({
        where: { status: 'Pending' }, order: [['createdAt', 'DESC']], raw: true
      });
      const results = await Promise.all(requests.map(async (deleteRequest) => {
        const encroachment = await encroachmentModel.findOne({
          where: { id: deleteRequest.encroachmentId },
          include: [
            { model: sectorModel, required: false, attributes: ['sctr_name'] },
            { model: locationModel, required: false, attributes: ['loc_name'] }
          ],
          raw: true
        });
        return {
          ...deleteRequest,
          allotteeName: encroachment?.allotee_name || '-',
          encroacherName: encroachment?.name_of_encroacher || '-',
          locationName: encroachment?.['location.loc_name'] || '-',
          sectorName: encroachment?.['sector.sctr_name'] || '-',
          quarterNo: encroachment?.qrtr_no || '-',
          quarterType: encroachment?.qrtr_type || '-'
        };
      }));
      return res.status(200).send(results);
    } catch (err) {
      return dbError(res, err);
    }
  },

  async reviewEncroachmentDeleteRequest(req, res) {
    try {
      const requestObject = req.body.requestObject || {};
      const reviewer = await usersModel.findOne({ where: { id: requestObject.userId }, raw: true });
      if (!reviewer || reviewer.role !== 'admin' || reviewer.accessKeyword !== 'SuperAdmin') {
        return res.status(403).send({ status: false, message: 'Only SuperAdmin can approve or reject deletion requests.' });
      }
      if (!['Approved', 'Rejected'].includes(requestObject.decision)) {
        return res.status(400).send({ status: false, message: 'Invalid review decision.' });
      }
      const [updated] = await encroachmentDeleteRequestModel.update(
        { status: requestObject.decision, reviewedById: reviewer.id, reviewedAt: new Date() },
        { where: { id: requestObject.requestId, status: 'Pending' } }
      );
      if (!updated) return res.status(404).send({ status: false, message: 'Pending deletion request not found.' });
      if (requestObject.decision === 'Rejected') {
        return res.status(200).send({ status: true, message: 'Deletion request rejected.' });
      }

      const deleteRequest = await encroachmentDeleteRequestModel.findByPk(requestObject.requestId, { raw: true });
      req.body.requestObject = { qId: deleteRequest.encroachmentId, status: 0, approvedRequestId: deleteRequest.id };
      return module.exports.deleteEncroach(req, res);
    } catch (err) {
      return dbError(res, err);
    }
  }
};
