const db = require("../config/db.config.js");
const config = require("../config/config.js");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database
  console.log("Processing func -> SignUp");

  User.create({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  })
    .then((user) => {
      console.log("2222", req.body.roles);
      Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles,
          },
        },
      })
        .then((roles) => {
          console.log("1111", roles);
          user.setRoles(roles).then(() => {
            res.send({ msg: "User registered successfully!" });
          });
        })
        .catch((err) => {
          res.status(500).send("Error -> " + err);
        });
    })
    .catch((err) => {
      res.status(500).send("Fail! Error -> " + err);
    });
};
// Log in api controller
exports.signin = (req, res) => {
  console.log("Sign-In");

  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send("User Not Found.");
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          auth: false,
          accessToken: null,
          reason: "Invalid Password!",
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // expires in 24 hours
      });
      user.getRoles().then((role) => {
        console.log(role);
        res.status(200).send({
          auth: true,
          accessToken: token,
          username: user.username,
          authorities: [role[0].name],
        });
      });
    })
    .catch((err) => {
      res.status(500).send("Error -> " + err);
    });
};

// Get User content
exports.userContent = (req, res) => {
  User.findOne({
    where: { id: req.userId },
    attributes: ["name", "username", "email"],
    include: [
      {
        model: Role,
        attributes: ["id", "name"],
        through: {
          attributes: ["userId", "roleId"],
        },
      },
    ],
  })
    .then((user) => {
      res.status(200).json({
        description: "User Content Page",
        user: user,
      });
    })
    .catch((err) => {
      res.status(500).json({
        description: "Can not access User Page",
        error: err,
      });
    });
};

exports.adminBoard = (req, res) => {
  User.findOne({
    where: { id: req.userId },
    attributes: ["name", "username", "email"],
    include: [
      {
        model: Role,
        attributes: ["id", "name"],
        through: {
          attributes: ["userId", "roleId"],
        },
      },
    ],
  })
    .then((user) => {
      res.status(200).json({
        description: "Admin Board",
        user: user,
      });
    })
    .catch((err) => {
      res.status(500).json({
        description: "Can not access Admin Board",
        error: err,
      });
    });
};

exports.managementBoard = (req, res) => {
  User.findOne({
    where: { id: req.userId },
    attributes: ["name", "username", "email"],
    include: [
      {
        model: Role,
        attributes: ["id", "name"],
        through: {
          attributes: ["userId", "roleId"],
        },
      },
    ],
  })
    .then((user) => {
      res.status(200).json({
        description: "Management Board",
        user: user,
      });
    })
    .catch((err) => {
      res.status(500).json({
        description: "Can not access Management Board",
        error: err,
      });
    });
};
