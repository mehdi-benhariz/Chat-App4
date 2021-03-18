const users = [];
const User =require('./User')
const Room = require('../room/Room')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const {getUserByToken} = require("../utils/auth")

exports.addUser = async ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();
 
  const existingUser = await User.find({name});

  if(!name || !room) return { error: 'Username and room are required.' };
  if(existingUser) return { error: 'Username is taken.' };

  let existedRoom = await Room.findOne({name:room})
  if(!existedRoom)
    existedRoom = new Room({name:room})
   await existedRoom.save()
   existingUser.login = true;
   existingUser.room = existedRoom; 
   await existingUser.save()

  return { user:existingUser };
}

exports.removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if(index !== -1) return users.splice(index, 1)[0];
}

exports.getUser = (id) => users.find((user) => user.id === id);

exports.getUsersInRoom = async(room) =>{
  try{
    let theRoom = await Room({name:room})
    var users = []
    if(theRoom)
     users= theRoom.filter(u=>u.room == room)
    return users;

  }catch(err){
    console.log(err)
  }

};

exports.login=async(req,res,next)=>{
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "All fields required" });
  try {
    // search for existing user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User dose not exist" });

    const isMatch = await bcrypt.compare(password.toString(), user.password.toString());
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {});
    if (!token) throw Error("Couldnt sign the token");

    user.login = true;
    await user.save();

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
      })
      .json({
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
        },
      });
  } catch (error) {
    next(error);
  }
}

 exports.register=async(req,res,next)=>{
   
  const { name, email, password, cPassword } = req.body;
  if (!name || !cPassword || !email || !password)
    return res.status(400).json({ message: "All fields required" });
  if (password !== cPassword)
    return res.status(400).json({ message: "Passwords don't matchs" });
  try {
    // search for existing user
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already used" });

    const salt = await bcrypt.genSalt(10);
    if (!salt) throw Error("Something went wrong with bcrypt");

    const hash = await bcrypt.hash(password.toString(), salt);
    if (!hash) throw Error("Something went wrong hashing the password");

    const newUser = new User({
      name,
      password: hash,
      email,
      login: true,
    });

    const savedUser = await newUser.save();
    if (!savedUser) throw Error("Something went wrong saving the user");

    const token = jwt.sign({ _id: savedUser._id },process.env.JWT_SECRET, {});
    if (!token) throw Error("Couldnt sign the token");

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
      })
      .json({
        user: {
          _id: savedUser._id,
          email: savedUser.email,
          name: savedUser.name,
        },
      });
  } catch (error) {
    next(error);
  }
 }
exports.logout=(req,res)=>{
  User.findByIdAndUpdate(req.body.id, { login: false });
  res.clearCookie("token");
  res.status(200).send("logout user");
}
exports.userInfo =async (req, res) => {
  const { token } = req.cookies;
  if (token) {
    var user = await getUserByToken(token);
    res.status(200).json({ isLogged: true });
  
  }
  else res.json({ isLogged: false });
};