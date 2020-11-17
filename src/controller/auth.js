const { user } = require("../../models");

//hasing or salting cridential data like password
const bycript = require("bcrypt");
//make token for auth
const jwt = require("jsonwebtoken");

//inport validator
const joi = require("@hapi/joi");

//key for decrypt jwt token
const jwtKey = process.env.JWT_KEY;


exports.checkAuth = async (req,res) =>{
  try {
    const users = await user.findOne({
      where:{
        id:req.user.id,
      },
      attributes:{
        exclude:["createdAt", "updatedAt", "password"]
      }
    })

    res.send({
      message:"User Valid",
      data: { users }
    })
  } catch (error) {
    console.log(err);
  
    res.status(500).send({
      error: {
        message: "Server ERROR",
      },
    });
  }
}


exports.register = async (req, res) => {
    try {
      const { fullName, email, password, phone, address, isadmin, gender } = req.body;
  
      //>>>>>>>>>>>>>>>>>>>>>>>VALIDATION START<<<<<<<<<<<<<<<<<<<<<<<
      const schema = joi.object({
        fullName: joi.string().min(3).required(),
        email: joi.string().email().min(10).required(),
        password: joi.string().min(8).required(),
        phone: joi.string().min(10).required(),
        gender: joi.string().min(1).required(),
        address: joi.string().min(8).required(),
        isadmin: joi.boolean().required(),
      });
  
      //get error from joi validation
      const { error } = schema.validate(req.body);
  
      //if error existed then throw validation error messages
      if (error) {
        return res.status(400).send({
          error: {
            message: error.details[0].message,
          },
        });
      }
  
      //>>>>>>>>>>>>>>>>>>>>>>>VALIDATION END<<<<<<<<<<<<<<<<<<<<<<<
  
      //check if email already been existed
      const checkEmail = await user.findOne({
        where: {
          email,
        },
      });
  
      //send response if email already been taken
      if (checkEmail) {
        return res.status(400).send({
          error: {
            message: "Email already been existed",
          },
        });
      }
  
      //salt strength
      const saltRounds = 10;
      //salting password
      const hashedPassword = await bycript.hash(password, saltRounds);
  
      //create user
      const users = await user.create({
        fullName,
        email,
        phone,
        address,
        gender,
        isadmin,
        password: hashedPassword,
      });
  
      //create new jwt token after register success
      const token = jwt.sign(
        {
          id: users.id
        },
        jwtKey
      );
  
      //send request with user data & jwt token
      res.send({
        message: "You has been registered",
        data: {
          email:users.email,
          fullName,
          phone,
          address,
          gender,
          isadmin,
          token,
        },
      });
    } catch (err) {
      console.log(err);
  
      res.status(500).send({
        error: {
          message: "Server ERROR",
        },
      });
    }
  };



exports.login = async (req, res) => {
  try {
    //get email dan password from body
    const { email, password } = req.body;

    //>>>>>>>>>>>>>>>>>>>>>>>VALIDATION START<<<<<<<<<<<<<<<<<<<<<<<

    //validate email and password with certain recruitment
    const schema = joi.object({
      email: joi.string().email().min(10).required(),
      password: joi.string().min(8).required(),
    });

    //get error from joi validation
    const { error } = schema.validate(req.body);

    //if error existed then throw validation error messages
    if (error) {
      return res.status(400).send({
        error: {
          message: error.details[0].message,
        },
      });
    }

    //>>>>>>>>>>>>>>>>>>>>>>>VALIDATION END<<<<<<<<<<<<<<<<<<<<<<<

    //check user in database
    const userz = await user.findOne({
      where: {
        email,
      },
    });

    //if user not existed then throw error
    if (!userz) {
      return res.status(400).send({
        error: {
          message: "Email or password invalid || Email not existed",
        },
      });
    }
    //if user existed
    //check password / compare password from req.body and password from database
    const validPassword = await bycript.compare(password, userz.password);
    //if password not valid then throw error
    if (!validPassword) {
      return res.status(400).send({
        error: {
          message: "Email or password invalid || password invalid",
        },
      });
    }

    //if email & password existed and valid then create new token
    const token = jwt.sign(
      {
        id: userz.id,
      },
      jwtKey
    );

    //send new response
    res.send({
      message: "Login Success",
      data: {
        email: userz.email,
        fullName: userz.fullName,
        token,
      },
    });
  } catch (err) {
    console.log(err);
  }
};
