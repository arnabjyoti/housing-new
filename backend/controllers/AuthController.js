const async = require("async");
const usersModel = require("../models").users;
const rolePrivilegeModel = require("../models").roles;
const privilegeModel = require("../models").privilege;
const bcrypt = require("bcrypt");
const Sequelize = require("sequelize");
var request = require('request');
const { generateToken, FIFTEEN_DAYS_IN_SECONDS } = require('../middleware/authMiddleware');

module.exports = {
  //Start: Method to authenticate a user
  authenticate(req, res) {
  const email = req.body.requestObject.email;
  const phone_no = req.body.requestObject.phone_no;

  let whereCondition = { active: true };

  // 🔹 Decide whether email or phone is sent
  if (phone_no && /^\d{10}$/.test(phone_no)) {
    whereCondition.phone_no = phone_no;
  } else if (email) {
    whereCondition.email = email;
  } else {
    return res.status(200).send({
      status: false,
      message: 'Email or phone number is required'
    });
  }

  return usersModel
    .findOne({ where: whereCondition })
    .then(userData => {
      if (!userData) {
        return res.status(200).send({
          status: false,
          message: 'Wrong email or phone number',
          type: phone_no ? 'phone' : 'email'
        });
      }

      userData = userData.get();

      // Create 15-day JWT token
      const jwtPayload = {
        id: userData.id,
        email: userData.email,
        phone_no: userData.phone_no,
        role: userData.role,
        f_name: userData.f_name,
        l_name: userData.l_name,
        aadhaar_number: userData.aadhaar_number || null
      };
      const token = generateToken(jwtPayload);

      let userObject = {};
      userObject.usr = userData;
      userObject.token = token;
      userObject.jwt_token = token;
      userObject.expiresIn = FIFTEEN_DAYS_IN_SECONDS; // 15 days in seconds
      userObject.expiresAt = Date.now() + (FIFTEEN_DAYS_IN_SECONDS * 1000); // 15 days in ms

      return rolePrivilegeModel.findAll({
        where: { role: userData.role },
        include: [
          {
            model: privilegeModel,
            attributes: ['id', 'slug']
          }
        ],
        raw: true
      })
      .then(perm => {
        userObject.privileges = perm;
        return res.status(200).send({
          status: true,
          message: userObject,
          token: token,
          jwt_token: token,
          expiresIn: '15d',
          expiresAt: userObject.expiresAt
        });
      });
    })
    .catch(error => {
      console.log(error);
      return res.status(500).send({
        status: false,
        message: error
      });
    });
},
  //End

  createUser(req, res) {
    console.log("jjjjjjjjjjjjjjjjj",req.body.requestObject);
    return usersModel
      .create({
        f_name: req.body.requestObject.f_name,
        m_name: req.body.requestObject.m_name,
        l_name: req.body.requestObject.l_name,
        email: req.body.requestObject.email,
        role: req.body.requestObject.role,
        phone_no: req.body.requestObject.phone_no,
        designation: req.body.requestObject.designation,
        department: req.body.requestObject.department,
        basic_pay: req.body.requestObject.basic_pay,
        service_status: req.body.requestObject.service_status,
        transferable: req.body.requestObject.transferable,
        doa: req.body.requestObject.doa,
        dor: req.body.requestObject.dor,
        dojs: req.body.requestObject.dojs,
        dos: req.body.requestObject.dos,
        spouse_f_name: req.body.requestObject.spouse_f_name,
        spouse_l_name: req.body.requestObject.spouse_l_name,
        spouse_occ: req.body.requestObject.spouse_occ,
        spouse_acco: req.body.requestObject.spouse_acco,
        resid_house: req.body.requestObject.resid_house,
        active: 1
      })
      .then(project => {
        return res.status(200).send({ message: project.id, status: true });
      })
      .catch(error => res.status(400).send(error));
  },

  verifyEmail(req, res) {
  var emailID = req.body.requestObject;

  console.log("vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv",emailID);
  

  if (emailID === null || emailID === '') {
    return res.status(400).send({ error: 'Something went wrong' });
  }

  return usersModel
    .findOne({
      where: {
        email: emailID,
      },
      attributes: ["email", "phone_no"] // Include phone in the response
    })
    .then(emailData => {
      if (!emailData) {
        return res.status(200).send({ message: "notExist" });
      } else {
        // Return email and phone in the response
        return res.status(200).send({ 
          message: "exist",
          data: {
            email: emailData.email,
            phone_no: emailData.phone_no || null // return null if phone is not available
          }
        });
      }
    })
    .catch(error => {
      console.log(error);
      return res.status(400).send(error);
    });
},


verifyPhone(req, res) {
  var phoneNo = req.body.requestObject;
  console.log("ccccccccccccccccccccc",phoneNo);
  

  if (phoneNo === null || phoneNo === '') {
    return res.status(400).send({ error: 'Something went wrong' });
  }

  return usersModel
    .findOne({
      where: {
        phone_no: phoneNo,
      },
      attributes: ["email", "phone_no"] // Include phone in the response
    })
    .then(emailData => {
      if (!emailData) {
        return res.status(200).send({ message: "notExist" });
      } else {
        // Return email and phone in the response
        return res.status(200).send({ 
          message: "exist",
          data: {
            email: emailData.email,
            phone_no: emailData.phone_no || null // return null if phone is not available
          }
        });
      }
    })
    .catch(error => {
      console.log(error);
      return res.status(400).send(error);
    });
},

  verifyAadhaar(req, res) {
    const rawVal = req.body.requestObject || req.body.aadhaar_number;
    const aadhaarNo = rawVal ? String(rawVal).trim() : '';

    if (!aadhaarNo) {
      return res.status(400).send({ status: false, message: 'Aadhaar number is required' });
    }

    const excludeUserId = req.body.userId || (req.body.requestObject && req.body.requestObject.userId) || null;
    const whereCondition = { aadhaar_number: aadhaarNo };
    if (excludeUserId) {
      whereCondition.id = { [Sequelize.Op.ne]: excludeUserId };
    }

    return usersModel
      .findOne({
        where: whereCondition,
        attributes: ['id', 'email', 'phone_no', 'aadhaar_number']
      })
      .then(user => {
        if (!user) {
          return res.status(200).send({ status: true, message: 'notExist' });
        } else {
          return res.status(200).send({
            status: false,
            message: 'exist',
            data: {
              email: user.email,
              phone_no: user.phone_no
            }
          });
        }
      })
      .catch(error => {
        console.error('[AuthController.verifyAadhaar] error:', error);
        return res.status(500).send({ status: false, message: error.message || error });
      });
  }
    
};
