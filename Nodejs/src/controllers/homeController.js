import db from '../models/index'
import bcrypt from 'bcrypt';

const saltRounds = 9;
const salt = bcrypt.genSaltSync(saltRounds);

let getHomePage = async(req,res) => {
    return res.render('homepage.ejs')
}

let postCRUD = async(req,res) => {
    let email = req.body.email
    let password = req.body.password
    let hashPassword = await bcrypt.hash(password, salt);
    let user = await db.User.create({
        email:email,
        password:hashPassword,
    })
    res.status(200).json({
        data:user
    })
}


module.exports = {
    getHomePage :getHomePage,
    postCRUD:postCRUD,
}