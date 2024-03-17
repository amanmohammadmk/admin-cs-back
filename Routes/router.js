
const express=require('express')



const userController=require('../controllers/userController')

const multerConfig=require('../middleware/multermiddileware')



const router= new express.Router()






router.post('/add', multerConfig.single("profile"),userController.addUser)



router.get('/get/allusers',userController.getallUsers)


// delete

router.delete('/delete/user/:id',userController.deleteUser)

// edit

router.put('/edit/user/:id',multerConfig.single("profile"),userController.editUser)

module.exports=router

