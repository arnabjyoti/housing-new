const async = require("async");
const locationModel = require("../models").location;

module.exports = {
    getLocation(req, res){
        let query={
            raw: true,
            order: [
                ['loc_name', 'ASC']
              ]
        }

    console.log("Query is==========> ",query);
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
        const newData = {
          loc_name: req.body.requestObject.location_name,
        };
        locationModel
        .update(newData, {
          where: {
            id: req.body.requestObject.ID
          }
        })
        .then(p => {
          res.status(200).send(p);
        })
        .catch(err => res.status(400).send(err));
    },
};