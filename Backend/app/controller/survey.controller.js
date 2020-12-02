const db = require("../config/db.config.js");
const Survey = db.survey;
const Form = db.form;
var async = require("async");

/**
 * Save a Survey object to database MySQL/PostgreSQL
 * @param {*} req
 * @param {*} res
 */
exports.create = (req, res) => {
  let survey = {};
  let forms = [];
  let promises = [];
  try {
    // Building Survey object from upoading request's body
    survey.name = req.body.surveyName;

    // Save to MySQL database
    Survey.create(survey).then((result) => {
      // binding forms and saving to forms database
      forms = req.body.forms;
      console.log("FORMS---", forms);
      forms.forEach((element) => {
        promises.push(
          Form.create({
            name: element.name,
            label: element.label,
            surveyId: result.id,
            type: element.type,
            options: element.options,
            required: element.required,
            value: element.value,
          })
        );
      });
      Promise.all(promises)
        .then((form) => {
          console.log(">> Created form: " + JSON.stringify(form, null, 4));
          res.status(200).json({
            message: "Survey created = " + result.id,
            Survey: [result],
            form: form,
            error: "",
          });
        })
        .catch((err) => {
          console.log(">> Error while creating form: ", err);
        });
    });
  } catch (error) {
    res.status(500).json({
      message: "Fail!",
      customers: [],
      error: error.message,
    });
  }
};

/**
 * Retrieve Survey information from database
 * @param {*} req
 * @param {*} res
 */
exports.retrieveAllSurveys = (req, res) => {
  // find all Survey information from
  try {
    Survey.findAll({
      attributes: ["id", "name"],
    }).then((surveys) => {
      res.status(200).json({
        message: "Get all Surveys' Infos Successfully!",
        surveys: surveys,
        error: "",
      });
    });
  } catch (error) {
    // log on console
    console.log(error);

    res.status(500).json({
      message: "Error!",
      customers: [],
      error: error,
    });
  }
};

/**
 * Updating a Survey
 * @param {*} req
 * @param {*} res
 */
exports.updateById = async (req, res) => {
  try {
    let surveyId = req.params.id;
    let forms = [];
    let promises = [];
    let survey = await Survey.findByPk(surveyId);

    if (!survey) {
      // return a response to client
      res.status(404).json({
        message: "Not Found for updating a survey with id = " + surveyId,
        customers: [],
        error: "404",
      });
    } else {
      // update new change to database
      let updatedObject = {
        name: req.body.surveyName,
      };
      let result = await Survey.update(updatedObject, {
        returning: true,
        where: { id: surveyId },
      });
      if (!result) {
        res.status(500).json({
          message:
            "Error -> Can not update a survey with id = " + req.params.id,
          error: "Can NOT Updated",
          customers: [],
        });
      }
      forms = req.body.forms;
      console.log("FORMS---", forms);
      async.forEachOf(
        forms,
        async (element) => {
          let form = await Form.findByPk(element.id);
          if (form) {
            let x = await updateForm(element);
          }
        },
        (err) => {
          res.status(200).json({
            message: "Update successfully a Survey with id = " + surveyId,
            customers: [updatedObject],
            error: err,
          });
        }
      );
      async function updateForm(element) {
        console.log(element.id);
        var fobj = {
          name: element.name,
          label: element.label,
          surveyId: result.id,
          type: element.type,
          options: element.options,
          required: element.required,
          value: element.value,
        };
        await Form.update(fobj, {
          returning: true,
          where: { id: element.id },
        });
      }
      // return the response to client
      //   if (!result) {
      //     res.status(500).json({
      //       message:
      //         "Error -> Can not update a survey with id = " + req.params.id,
      //       error: "Can NOT Updated",
      //       customers: [],
      //     });
      //   }

      //   res.status(200).json({
      //     message: "Update successfully a Survey with id = " + surveyId,
      //     customers: [updatedObject],
      //     error: "",
      //   });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error -> Can not update a survey with id = " + req.params.id,
      error: error.message,
      customers: [],
    });
  }
};

/**
 *  Delete a Survey by ID
 * @param {*} req
 * @param {*} res
 */
exports.deleteById = async (req, res) => {
  try {
    let surveyId = req.params.id;
    let survey = await Survey.findByPk(surveyId);

    if (!survey) {
      res.status(404).json({
        message: "Does Not exist a Survey with id = " + surveyId,
        error: "404",
        customers: [],
      });
    } else {
      await survey.destroy();
      res.status(200).json({
        message: "Delete Successfully a Survey with id = " + surveyId,
        customers: [survey],
        error: "",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error -> Can NOT delete a survey with id = " + req.params.id,
      error: error.message,
      customers: [],
    });
  }
};

exports.retrieveFormsFromSurvey = (req, res) => {
  // find all Survey information from

  var surveyId = req.params.id;
  return Survey.findByPk(surveyId, { include: ["form"] })
    .then((survey) => {
      res.status(200).json({
        message: "Get  survey's Infos Successfully!",
        survey: survey,
        error: "",
      });
    })
    .catch((err) => {
      console.log(">> Error while finding survey: ", err);
      res.status(500).json({
        message: "Error while Get  survey's Infos Successfully!",
        error: err,
      });
    });
};
