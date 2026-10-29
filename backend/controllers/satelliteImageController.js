const multer = require('multer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const satelliteImageModel = require('../models').satelliteImage;
const usersModel = require('../models').users;
const sectorModel = require('../models').sector;
const locationModel = require('../models').location;
const env = process.env.NODE_ENV || 'production';
const config = require(__dirname + '/../config/config.json')[env];

const IMAGE_TYPES = ['image/jpeg', 'image/png'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_IMAGES = 5;

function satelliteDirectory(req) {
  if (!req._satelliteUploadDirectory) {
    const recordPart = req.body.recordId ? `${req.body.recordId}-upload` : `pending-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    req._satelliteUploadDirectory = path.join(config.FILE_UPLOAD_PATH, 'satellite-images', recordPart);
  }
  return req._satelliteUploadDirectory;
}

async function requireAdmin(userId) {
  if (!userId) return null;
  const user = await usersModel.findByPk(userId);
  return user && user.role === 'admin' ? user : null;
}

function removeFiles(record) {
  if (!record) return;
  const directory = path.join(config.FILE_UPLOAD_PATH, 'satellite-images', String(record.id));
  if (fs.existsSync(directory)) fs.rmSync(directory, { recursive: true, force: true });
}

module.exports = {
  upload: multer({
    storage: multer.diskStorage({
      destination(req, file, cb) {
        const directory = satelliteDirectory(req);
        fs.mkdir(directory, { recursive: true }, error => cb(error, directory));
      },
      filename(req, file, cb) {
        const extension = path.extname(file.originalname).toLowerCase();
        cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${extension}`);
      }
    }),
    limits: { fileSize: MAX_FILE_SIZE, files: MAX_IMAGES },
    fileFilter(req, file, cb) {
      if (!IMAGE_TYPES.includes(file.mimetype)) {
        return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Only JPG, JPEG, and PNG images are allowed.'));
      }
      cb(null, true);
    }
  }),

  async list(req, res) {
    try {
      if (!await requireAdmin(req.query.userId)) return res.status(403).send({ status: false, message: 'Only admin users can view satellite images.' });
      const images = await satelliteImageModel.findAll({
        include: [
          { model: locationModel, attributes: ['id', 'loc_name'] },
          { model: sectorModel, attributes: ['id', 'sctr_name'] }
        ],
        order: [['updatedAt', 'DESC']]
      });
      return res.status(200).send(images);
    } catch (error) {
      return res.status(500).send({ status: false, message: 'Unable to load satellite images.' });
    }
  },

  async file(req, res) {
    try {
      if (!await requireAdmin(req.query.userId)) return res.status(403).send({ status: false, message: 'Only admin users can view satellite images.' });
      const record = await satelliteImageModel.findByPk(req.params.recordId);
      const allowedFiles = record ? [record.photo_1, record.photo_2, record.photo_3, record.photo_4, record.photo_5] : [];
      if (!record || !allowedFiles.includes(req.params.filename)) return res.status(404).send({ status: false, message: 'Satellite image not found.' });
      return res.sendFile(path.join(config.FILE_UPLOAD_PATH, 'satellite-images', String(record.id), req.params.filename));
    } catch (error) {
      return res.status(500).send({ status: false, message: 'Unable to load satellite image.' });
    }
  },

  async save(req, res) {
    try {
      const admin = await requireAdmin(req.body.userId);
      if (!admin) return res.status(403).send({ status: false, message: 'Only admin users can upload satellite images.' });
      const { locationId, sectorId, recordId } = req.body;
      const uploadedFiles = req.files || {};
      const files = Object.keys(uploadedFiles).reduce((all, field) => all.concat(uploadedFiles[field]), []);
      if (!locationId || !sectorId) return res.status(400).send({ status: false, message: 'Location and sector are required.' });
      if ((!files.length && !recordId) || files.length > MAX_IMAGES) return res.status(400).send({ status: false, message: 'Upload between 1 and 5 images.' });
      const sector = await sectorModel.findOne({ where: { id: sectorId, locationId } });
      if (!sector) return res.status(400).send({ status: false, message: 'The selected sector does not belong to the selected location.' });

      let record = recordId
        ? await satelliteImageModel.findByPk(recordId)
        : await satelliteImageModel.findOne({ where: { locationId, sectorId } });
      const isUpdate = Boolean(record);
      if (recordId && !record) return res.status(404).send({ status: false, message: 'Satellite image record not found.' });
      const photos = {};
      for (let index = 1; index <= MAX_IMAGES; index += 1) {
        const uploaded = uploadedFiles[`image${index}`] && uploadedFiles[`image${index}`][0];
        photos[`photo_${index}`] = uploaded ? uploaded.filename : (record ? record[`photo_${index}`] : null);
      }

      if (record) {
        const stagedDirectory = satelliteDirectory(req);
        const finalDirectory = path.join(config.FILE_UPLOAD_PATH, 'satellite-images', String(record.id));
        fs.mkdirSync(finalDirectory, { recursive: true });
        files.forEach(file => fs.renameSync(path.join(stagedDirectory, file.filename), path.join(finalDirectory, file.filename)));
        if (fs.existsSync(stagedDirectory)) fs.rmdirSync(stagedDirectory);
        await record.update({ locationId, sectorId, ...photos });
      } else {
        record = await satelliteImageModel.create({ locationId, sectorId, created_by: admin.id, ...photos });
        const stagedDirectory = satelliteDirectory(req);
        const finalDirectory = path.join(config.FILE_UPLOAD_PATH, 'satellite-images', String(record.id));
        fs.mkdirSync(path.dirname(finalDirectory), { recursive: true });
        fs.renameSync(stagedDirectory, finalDirectory);
      }
      return res.status(200).send({ status: true, message: isUpdate ? 'Satellite images updated.' : 'Satellite images uploaded.', id: record.id });
    } catch (error) {
      return res.status(400).send({ status: false, message: error.message || 'Unable to save satellite images.' });
    }
  },

  async remove(req, res) {
    try {
      if (!await requireAdmin(req.body.userId)) return res.status(403).send({ status: false, message: 'Only admin users can delete satellite images.' });
      const record = await satelliteImageModel.findByPk(req.params.recordId);
      if (!record) return res.status(404).send({ status: false, message: 'Satellite image record not found.' });
      removeFiles(record);
      await record.destroy();
      return res.status(200).send({ status: true, message: 'Satellite image set deleted.' });
    } catch (error) {
      return res.status(400).send({ status: false, message: 'Unable to delete satellite images.' });
    }
  },

  uploadError(error, req, res, next) {
    if (!error) return next();
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') return res.status(400).send({ status: false, message: 'Each image must be 5 MB or smaller.' });
    return res.status(400).send({ status: false, message: error.message || 'Only JPG, JPEG, and PNG images are allowed.' });
  }
};
