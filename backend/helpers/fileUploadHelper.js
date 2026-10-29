/**
 * fileUploadHelper.js
 * Shared file upload utility — centralises multer config, MIME validation,
 * file-size limits, and directory helpers that were duplicated across controllers.
 */

'use strict';

const multer = require('multer');
const fs = require('fs');
const path = require('path');

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_EXTENSIONS = /\.(jpeg|jpg|png|pdf)$/i;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Ensure a directory exists; create it recursively if it does not.
 * @param {string} dirPath
 */
function ensureDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Create a per-entity upload directory under the configured base path.
 * @param {string|number} entityId
 * @param {string}        subFolder  e.g. 'user', 'encroachment'
 * @param {string}        basePath   config.FILE_UPLOAD_PATH
 * @returns {string}      The created directory path
 */
function createEntityDirectory(entityId, subFolder, basePath) {
  if (!entityId) throw new Error('createEntityDirectory: entityId is required');
  const dirName = String(entityId) + '_';
  const dest = subFolder
    ? path.join(basePath, subFolder, dirName)
    : path.join(basePath, dirName);
  ensureDirectory(dest);
  return dest;
}

// ─── Multer factory ───────────────────────────────────────────────────────────

/**
 * Build a multer instance with MIME-type validation and size limits.
 *
 * @param {object}  options
 * @param {string}  options.basePath   config.FILE_UPLOAD_PATH
 * @param {string}  [options.subFolder]  Top-level sub-folder under basePath ('user', 'encroachment', etc.)
 * @param {boolean} [options.useIdSubfolder=true]  When true, nest files in a per-id sub-directory.
 * @param {function} [options.getIdFromReq]  (req) => string — custom resolver for the record id.
 *                                           Defaults to req.body.dbid.
 * @returns {multer.Multer}
 */
function createUploadConfig({ basePath, subFolder = '', useIdSubfolder = true, getIdFromReq = null } = {}) {
  return multer({
    storage: multer.diskStorage({
      destination(req, file, cb) {
        try {
          let dest;
          if (useIdSubfolder) {
            const rawId = getIdFromReq
              ? String(getIdFromReq(req) || 'default')
              : String((req.body && req.body.dbid) ? req.body.dbid : 'default');
            const safeId = rawId.replace(/[^a-zA-Z0-9_-]/g, '') + '_';
            dest = subFolder
              ? path.join(basePath, subFolder, safeId)
              : path.join(basePath, safeId);
          } else {
            dest = subFolder
              ? path.join(basePath, subFolder)
              : basePath;
          }
          ensureDirectory(dest);
          cb(null, dest);
        } catch (err) {
          cb(err);
        }
      },

      filename(req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        const safeBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
        cb(null, `${Date.now()}_${safeBase}${ext}`);
      }
    }),

    /**
     * Reject files whose extension or MIME type is not in the allowed list.
     */
    fileFilter(req, file, cb) {
      const ext = path.extname(file.originalname).toLowerCase();
      const mimeOk = ALLOWED_MIME_TYPES.includes(file.mimetype);
      const extOk  = ALLOWED_EXTENSIONS.test(ext);

      if (!mimeOk || !extOk) {
        return cb(
          Object.assign(new Error('Only JPEG, PNG and PDF files are allowed.'), { code: 'INVALID_FILE_TYPE' })
        );
      }
      cb(null, true);
    },

    limits: {
      fileSize: MAX_FILE_SIZE_BYTES // 10 MB hard cap
    }
  });
}

// ─── Multer error handler middleware ─────────────────────────────────────────

/**
 * Express error-handling middleware for multer upload errors.
 * Attach after the multer middleware on any route that handles file uploads.
 *
 * Usage in routes:
 *   app.post('/api/upload', ctrl.upload_config.single('file'), handleUploadError, ctrl.uploadHandler);
 */
function handleUploadError(err, req, res, next) {
  if (!err) return next();

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).send({ status: false, message: 'File is too large. Maximum allowed size is 10 MB.' });
  }
  if (err.code === 'INVALID_FILE_TYPE') {
    return res.status(400).send({ status: false, message: err.message });
  }
  // Unexpected multer or filesystem error
  console.error('[fileUploadHelper] Unexpected upload error:', err.message);
  return res.status(500).send({ status: false, message: 'File upload failed due to a server error.' });
}

module.exports = {
  createUploadConfig,
  createEntityDirectory,
  ensureDirectory,
  handleUploadError,
  MAX_FILE_SIZE_BYTES,
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPES
};
