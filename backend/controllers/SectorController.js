const async = require("async");
const sectorModel = require("../models").sector;
const locationModel = require("../models").location;

module.exports = {
    getSector(req, res){
        let query={
            raw: true,
            order: [
                ['locationId', 'ASC']
              ],
              include: [
                {
                  model: locationModel,
                  
                  required: false,
                  attributes: [
                    ["loc_name", "loc_name"],
                    ["id", "id"],
                  ]
                },
              ]
        }

    console.log("Query is==========> ",query);
    return sectorModel
      .findAll(query)
      .then(sector => {
        return res.status(200).send(sector);
      })
      .catch(error => {
        console.log(error);
        return res.status(400).send(error);
      });

    },

    addSector(req, res) {
        console.log("oooooooooooooooooooooooooo",req.body.requestObject);
        return sectorModel
        .create({
          sctr_name: req.body.requestObject.sector_name,
          locationId: req.body.requestObject.loc_name,
          status: "1",
        })
        .then(project => res.status(200).send({ message: "success" }))
        .catch(error => res.status(400).send(error));
      },
  
      updateSector(req, res) {
        const reqObj = (req.body && req.body.requestObject) || {};
        const newData = {
          sctr_name: reqObj.sector_name || reqObj.sctr_name,
        };
        if (reqObj.locationId || reqObj.loc_name) {
          newData.locationId = reqObj.locationId || reqObj.loc_name;
        }
        sectorModel
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


    getSectorData(req, res) {
      sectorModel
      .findAll({
        where: {
          locationId :req.params.req,
          status: 1
        },
        raw: true
      })
      .then(project => {
        console.log("hhhhhhhhhhhhhhh",project);
        return res.status(200).send(project);
    })
    .catch(error => res.status(400).send(error));
  }
};