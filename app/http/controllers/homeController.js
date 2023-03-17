const Menu = require('../../models/menu')
function homeController(){
    return {
        async index(req,res){

            const cupcakes = await Menu.find();
            res.render('home',{cupcakes: cupcakes});
            
            
        }
    }
}

module.exports = homeController
