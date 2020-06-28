const User = require("../models/User");
const { verify } = require("jsonwebtoken");
const { hash, compare } = require("bcryptjs");

//custom function to find user by email and password
const findByEmailAndPassword = async (email, password) => {
  try {
    // console.log("email", email, password); //to check if email password recieved
    const user = await User.findOne({ email: email });
    console.log("what did it find??>>", user);
    if (!user) throw new Error("incorrect email or password");

    const isMatched = await compare(password, user.password);
    if (!isMatched) throw new Error("incorrect email or password");

    return user;
  } catch (err) {
    throw err;
  }
};

//custom function to validate password
const validPassword = (password) => {
  if (password.length < 8)
    throw new Error("Password Minimum length should be 8 characters");
  // password has atleat one digit
  for (index in password) {
    if (isNaN(password[index]) && index == password.length - 1)
      throw new Error("Password should contain atleast one digit");
    if (!isNaN(password[index])) break;
  }
  //password has atleat one alphabet
  for (index in password) {
    if (!isNaN(password[index]) && index == password.length - 1)
      throw new Error("Password should contain atleast one alphabet");
    if (isNaN(password[index])) break;
  }
  //password has alteast one uppercase
  for (index in password) {
    if (
      (password[index] != password[index].toUpperCase() &&
        index == password.length - 1) ||
      (!isNaN(password[index]) && index == password.length - 1)
    )
      throw new Error("Password should contain atleast one uppercase char");
    if (!isNaN(password[index])) continue;
    if (password[index] == password[index].toUpperCase()) break;
  }
  //password has alteast one lowercase
  for (index in password) {
    if (
      (password[index] != password[index].toLowerCase() &&
        index == password.length - 1) ||
      (!isNaN(password[index]) && index == password.length - 1)
    )
      throw new Error("Password should contain atleast one lowercase char");
    if (!isNaN(password[index])) continue;
    if (password[index] == password[index].toLowerCase()) break;
  }
};

//custom function generatating secret key
const SecretKey = (email, createdAt) =>
  `${email}-${new Date(createdAt).getTime()}`;

module.exports = {
  async registerUser(req, res) {
    //asigning const of name, email, password, phoneNumber, gender for validation
    const { name, email, password, phoneNumber, gender, dob,address } = req.body;
    try {
      if (name.length < 4)
        throw new Error("length of name should be 4 or greater");
      // if email has @
      for (index in email) {
        if (email[index] !== "@" && index == email.length - 1)
          throw new Error("invalid email, please check again");
        if (email[index] === "@") break;
      }
      //check valid password by custom function
      validPassword(password);

      if (phoneNumber.toString().length != 10)
        throw new Error("enter a valid phone number");
      //phoneNumber has all digits
      for (number of phoneNumber.toString()) {
        if (isNaN(number)) throw new Error("enter a valid phone number");
      }
      if (gender === "male" || gender === "female" || gender === "others") {
      } else throw new Error("gender can be only male, female or others");
      //creating a new user with provided information
      const user = await User.create({ ...req.body });
      //generating email confirmation token
      await user.generateToken("confirm");
      //sending json response after completion
      res.status(200).json({
        confirmation_email_sent: true,
        message: "click link provided in email to register successfully",
      });
    } catch (err) {
      //filtering duplicacy error
      if (err.name === "MongoError")
        return res
          .status(400)
          .json({ Duplicacy_Error: `${email} is already registered` });
      //filtering token expiration error
      if (err.name === "ValidationError")
        return res.status(400).json({ Validation_Error: err.message });
      //sending error message if other errors
      console.log(err.message);
      res.status(400).json({ Error: err.message });
    }
  },

  async loginUser(req, res) {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ correct_credentials: false });
    try {
      //finding user data by email and password through custom function
      const user = await findByEmailAndPassword(email, password);
      //if user is confirmed then asigning session and sending response
      if (user.isConfirmed) {
        req.session.userId = user._id;
        return res.json({
          login_successfully: true,
          name: user.name,
          email: user.email,
          phonenumber: user.phoneNumber,
          gender: user.gender,
          dob: user.dob,
        });
      }
      //else returning error
      return res
        .status(403)
        .json({ account_confirmed: false, email_sent: true });
    } catch (err) {
      res.json({ Error: err.message });
    }
  },

  async changePassword(req, res) {
    const { email, oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword)
      return res.status(400).json({ correct_credentials: false });
    try {
      const user = await findByEmailAndPassword(email, oldPassword);
      // custom function
      validPassword(newPassword);
      //updating new password in database
      user.password = newPassword;
      await user.save();

      return res.json({ password_changed_successfully: true });
    } catch (err) {
      res.json({ Error: err.message });
    }
  },

  async deleteAccount(req, res) {
    const { email } = req.body;
    const userId = req.session.userId;
    if (!email) return res.status(400).json({ correct_credentials: false });
    try {
      const user = await User.findById(userId);

      if (user.email !== email)
        return res.status(401).json({ Error: "enter your correct email id" });

      await User.findOneAndDelete(
        { email: email },
        { useFindAndModify: false }
      );

      return res.json({ account_deleted_successfully: true });
    } catch (err) {
      console.log(err.message);

      res.status(500).json({ Error: "Server Error" });
    }
  },

  logout(req, res) {
    try {
      //check if user is logined
      if (req.session.userId) {
        //delete the session
        req.session.destroy();
        //send success response
        res.json({ logout_successfull: true });
      } else {
        //response if user is not logined
        res.status(401).json({ Error: "login first" });
      }
    } catch (err) {
      console.log(err.message);

      res.json({ Error: "server error" });
    }
  },

  async resetPassword(req, res) {
    const resetToken = req.headers.token;
    const { password, email } = req.body;
    try {
      const user = await User.findOne({ resetToken: resetToken });
      if (!user) {
        return res.status(401).json({ correct_credentials: false });
      }

      const secretKey = SecretKey(user.email, user.createdAt);

      const payload = await verify(resetToken, secretKey);
      if (payload) {
        validPassword(password);

        const hashedPassword = await hash(password, 10);

        await User.findOneAndUpdate(
          { email: email },
          { $set: { resetToken: "", password: hashedPassword } },
          { useFindAndModify: false }
        );

        return res.json({ password_changed_successfully: true });
      }

      res.status(401).json({ correct_credentials: false });
    } catch (err) {
      console.log(err);

      res.status(500).json({ Error: err.message });
    }
  },


  async userprofile(req,res){
    try {
      const user = await  User.findOne({_id:req.session.userId})
      if (user.isConfirmed && user._id ==req.session.userId) {
        req.session.userId = user._id;
        return res.json({
          login_successfully: true,
          name: user.name,
          email: user.email,
          phonenumber: user.phoneNumber,
          gender: user.gender,
          dob: user.dob,
          address: user.address
        });
      }
      return res
        .status(403)
        .json({ account_confirmed: false, email_sent: true });
    } catch (err) {
      res.json({ Error: err.message });
    }
  }
};
