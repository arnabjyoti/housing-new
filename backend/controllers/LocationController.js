const async = require("async");
const locationModel = require("../models").location;
const Op = require("sequelize").Op;

module.exports = {
    getLocation(req, res){
        let query={
            where: {
                status: {
                    [Op.notIn]: ['0', 0]
                }
            },
            raw: true,
            order: [
                ['loc_name', 'ASC']
            ]
        };

        return locationModel
          .findAll(query)
          .then(location => {
            return res.status(200).send(location);
          })
          .catch(error => {
            console.log(error);
            return res.status(400).send(error);
          });
    },

    addLocation(req, res) {
        console.log("oooooooooooooooooooooooooo",req.body.requestObject);
        return locationModel
        .create({
          loc_name: req.body.requestObject,
          status: "1",
        })
        .then(project => res.status(200).send({ message: "success" }))
        .catch(error => res.status(400).send(error));
    },
  
    updateLocation(req, res) {
        console.log("++++++++++++++++++++++++++++++++",req.body.requestObject);
        const reqObj = (req.body && req.body.requestObject) || {};
        const newData = {
          loc_name: reqObj.location_name || reqObj.loc_name,
        };
        if (reqObj.status !== undefined) {
          newData.status = String(reqObj.status);
        }
        locationModel
        .update(newData, {
          where: {
            id: reqObj.ID || reqObj.id
          }
        })
        .then(p => {
          res.status(200).send(p);
        })
        .catch(err => res.status(400).send(err));
    },

    deleteLocation(req, res) {
        const reqObj = req.body && req.body.requestObject ? req.body.requestObject : req.body;
        const targetId = reqObj && (reqObj.id || reqObj.ID) ? (reqObj.id || reqObj.ID) : reqObj;
        if (!targetId) {
            return res.status(400).send({ status: false, message: 'Location ID is required' });
        }
        return locationModel
        .update({ status: '0' }, {
            where: {
                id: targetId
            }
        })
        .then(() => res.status(200).send({ status: true, message: 'Location deleted successfully' }))
        .catch(err => res.status(400).send(err));
    }
};