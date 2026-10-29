const async = require("async");
const departmentModel = require("../models").department;

module.exports = {
    getDepartment(req, res){
        let query={
            raw: true,
            order: [
                ['createdAt', 'DESC']
              ]
        }

    console.log("Query is==========> ",query);
    return departmentModel
      .findAll(query)
      .then(department => {
        return res.status(200).send(department);
      })
      .catch(error => {
        console.log(error);
        return res.status(400).send(error);
      });

    },

    addDepartment(req, res) {
      console.log("oooooooooooooooooooooooooo",req.body.requestObject);
      return departmentModel
      .create({
        dept_name: req.body.requestObject,
      })
      .then(project => res.status(200).send({ message: "success" }))
      .catch(error => res.status(400).send(error));
    },

    updateDept(req, res) {
      console.log("++++++++++++++++++++++++++++++++",req.body.requestObject);
      const newData = {
        dept_name: req.body.requestObject.dept_name,
      };
      departmentModel
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