const User = require('../../models/user')
const bcrypt = require('bcrypt');
const passport = require('passport');
function authController(){
    const _getRedirectUrl = (req) => {
        return req.user.role === 'admin' ? '/admin/orders' : 'customer/orders'
    }
    return {
        login(req,res){
            res.render('auth/login');
        },
        postLogin(req,res,next){
            passport.authenticate('local', (err, user, info)=>{
                if(err){
                    req.flash('error', info.message)
                    return next(err)
                }
                if(!user){
                    req.flash('error', info.message)
                    return res.redirect('/login')
                }
                req.login(user, ()=>{
                    if(err){
                        req.flash('error', info.message)
                        return next(err)
                    }

                    return res.redirect(_getRedirectUrl(req))
                })
            })(req,res,next)
            
        },
        register(req,res){
            res.render('auth/register');
        },
        async postRegister(req,res){
            const { name, email, password } = req.body
            //Validate Request
            if(!name || !email || !password){
                req.flash('error', 'ALl fields are required')
                req.flash('name',name)
                req.flash('email',email)
                return res.redirect('/register')
            }
            //Check existance of email
            User.exists({ email: email}, (err,result)=>{
                if(result){
                    req.flash('error', 'Email Already taken!')
                    req.flash('name',name)
                    req.flash('email',email)
                    return res.redirect('/register')
                }
            })

            //Hash password
            const hashedPassword = await bcrypt.hash(password, 10)
            //Create User
            const user = new User({
                name,
                email,
                password: hashedPassword
            })
            user.save().then((user)=>{
                //login
                return res.redirect('/')
            }).catch(err =>{
                req.flash('error','Something went wrong')
                return res.redirect('/')
            })
            // res.render('auth/register')
            console.log(req.body)
            // res.status(404).json({user });
        },
        logout(req,res){
            req.logout()
            return res.redirect('/login')
        }
    }
}

module.exports = authController
