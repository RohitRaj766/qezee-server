const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const {generateToken} = require('../config/jwt');
const { userMiddleware} = require('../middleware/authMiddleware');
const Quiz = require('../model/quiz')
const Quizlist = require('../model/quizlist')
const User = require('../model/user')

router.get('/quizzesList', userMiddleware, async (req, res) => {
    try {
        const quizzes = await Quizlist.find();
        res.status(200).json(quizzes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/quiz/:title',userMiddleware, async (req, res) => {
    try {
        const quiz = await Quiz.findOne({title:req.params.title});
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }
        res.status(200).json(quiz);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
        
    }
});

router.post('/registration',async(req,res)=>{
    try {
        const { firstname, lastname, email, password, course, branch, university, college, enrollment } = req.body;
      
        if (!firstname || !lastname || !email || !password || !course || !branch || !university || !college || !enrollment) {
            return res.status(400).json({ error: "All fields are required" });
        }
  
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            course,
            branch,
            university,
            college,
            enrollment
        });

        await newUser.save();
        res.status(201).json({ message: "User Registered Successfully" });
    }   catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
});

router.post('/login', async(req,res) => {
            try{
                const {email,password} = req.body;
                if(!email || !password) return res.status(400).json({ error: "All fields are required" });
                const userExsit = await User.findOne({email:email})
                if(!userExsit) return res.status(404).json({ error: "User Not Found" });
                const matchedPassword = await bcrypt.compare(password,userExsit.password)
                if(!matchedPassword) return res.status(401).json({ error: "invalid credentials" }); 
                const authtok = await generateToken(userExsit._id)
                res.status(200).json({ message: "login successfull", LoggedInUser: userExsit, authtoken: authtok});
            }catch(error){
                console.error(error);
                res.status(500).json({ error: "Internal Server Error" }); 
            }
});


module.exports = router;