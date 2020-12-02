const verifySignUp = require("./verifySignUp");
const authJwt = require("./verifyJwtToken");

module.exports = function (app) {
  const controller = require("../controller/controller.js");
  const surveyController = require("../controller/survey.controller.js");

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUserNameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);
  app.post(
    "/api/survey/create",
    [authJwt.verifyToken],
    surveyController.create
  ); // Create Survey Form
  app.put("/api/survey/:id", surveyController.updateById); // update Survey Form
  app.get("/api/survey/:id", surveyController.retrieveFormsFromSurvey); // Retrive Form fields by survey id
  app.get("/api/surveys", surveyController.retrieveAllSurveys);
  app.get("/api/test/user", [authJwt.verifyToken], controller.userContent);

  app.get(
    "/api/test/pm",
    [authJwt.verifyToken, authJwt.isPmOrAdmin],
    controller.managementBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
};
