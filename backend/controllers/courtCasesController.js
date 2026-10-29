const async = require("async");
const quarterModel = require("../models").quarter;
const sectorModel = require("../models").sector;
const locationModel = require("../models").location;
const courtCaseModel = require("../models").courtCase;
const courtCaseImageModel = require("../models").courtCaseImage;
const departmentModel = require("../models").department;
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const request = require('request');
// const env = process.env.NODE_ENV || 'test';
const env = process.env.NODE_ENV || 'production';
const config = require(__dirname + '/../config/config.json')[env];


module.exports = {



  upload_config: multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        const rawId = (req.body && req.body.dbid ? String(req.body.dbid) : 'default').replace(/[^a-zA-Z0-9_-]/g, '');
        const dbID = rawId + '_';
        const userFolder = 'court_cases';
        const dest = path.join(config.FILE_UPLOAD_PATH, userFolder, dbID);
        try {
          if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
          }
          cb(null, dest);
        } catch (err) {
          cb(err, dest);
        }
      },
      filename: function (req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        const safeBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
        const safeName = `${Date.now()}_${safeBase}${ext}`;
        cb(null, safeName);
      }
    })
  }),

  checkDirectory(directory, callback) {
    try {
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }
      if (typeof callback === 'function') callback();
    } catch (err) {
      console.error('Directory check/create error: ', err);
      if (typeof callback === 'function') callback(err);
    }
  },


  createDirectory(project, callback) {
    const projectId = project && (project.id || project);
    if (!projectId) {
      if (typeof callback === 'function') callback({ status: false, message: 'Invalid ID' });
      return;
    }
    const dir = projectId + '_';
    const userFolder = 'court_cases';
    const dest = path.join(config.FILE_UPLOAD_PATH, userFolder, dir);
    try {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      if (typeof callback === 'function') callback({ status: true, path: dest });
    } catch (err) {
      console.error('Create court cases directory error:', err);
      if (typeof callback === 'function') callback({ status: false, error: err });
    }
  },


  // ***************************************************
  //                   court cases start
  // ***************************************************

  createCourtCase(req, res) {
    const reqObj = (req.body && req.body.requestObject) || {};
    const req1 = reqObj.req1 || {};
    const req2 = reqObj.req2 || {};

    return courtCaseModel
      .create({
        case_nature: req1.case_nature || null,
        case_no: req1.case_no || null,
        case_details: req1.case_details || null,
        start_date: req1.case_start || null,
        end_date: req1.end_date || null,
        case_status: req1.case_status || null,
        qrtr_no: req1.qtr_no || null,

        locationId: req2.loc_id || null,
        sectorId: req2.sec_id || null,
        status: "1",
      })
      .then(cases => {
        try {
          module.exports.createDirectory(cases);
        } catch (dirErr) {
          console.error("Court case directory error:", dirErr);
        }
        return res.status(200).send({ message: cases.id, status: true });
      })
      .catch(error => res.status(400).send(error));
  },


  updateCourtCase(req, res) {
    const reqObj = (req.body && req.body.requestObject) || {};
    const newData = {
      locationId: reqObj.locationId,
      sectorId: reqObj.sectorId,
      qrtr_no: reqObj.qrtr_no,
      case_nature: reqObj.case_nature,
      case_no: reqObj.case_no,
      case_details: reqObj.case_details,
      start_date: reqObj.start_date,
      end_date: reqObj.end_date,
      case_status: reqObj.case_status,
    };
    courtCaseModel
      .update(newData, {
        where: {
          id: reqObj.id
        }
      })
      .then(() => {
        return res.status(200).send({ message: reqObj.id, status: true });
      })
      .catch(error => res.status(400).send(error));
  },



  uploadCourtCase(req, res) {
    if (!req.file) {
      return res.status(400).send({ status: false, message: 'File not found' });
    } else {
      const savedName = req.file.filename || req.file.originalname;
      return courtCaseImageModel
        .create({
          image_name: savedName,
          courtCaseId: req.body.dbid
        })
        .then(project => {
          return res.status(200).send({ message: project.id, status: true, filename: savedName });
        })
        .catch(error => res.status(400).send(error));
    }
  },


  getCaseData(req, res) {
    let query = {
      where: {
        status: 1,
      },
      order: [['id', 'ASC']],
      include: [
        {
          model: courtCaseImageModel,
          required: false, // Left Join
        },
        {
          model: locationModel,
          required: false,
        },
        {
          model: sectorModel,
          required: false,
        },
      ],
    };


    return courtCaseModel
      .findAll(query)
      .then(location => {
        return res.status(200).send(location);
      })
      .catch(error => {
        console.log(error);
        return res.status(400).send(error);
      });

  },



  deleteCourtCase(req, res) {
    const targetId = req.body && req.body.requestObject ? (req.body.requestObject.id || req.body.requestObject) : null;
    if (!targetId) {
      return res.status(400).send({ status: false, message: 'Case ID is required' });
    }
    const newData = {
      status: 0,
    };
    courtCaseModel
      .update(newData, {
        where: {
          id: targetId
        }
      })
      .then(project => {
        return res.status(200).send({ message: project, status: true });
      })
      .catch(error => res.status(400).send(error));
  },

};