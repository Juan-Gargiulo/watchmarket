var express = require('express');
var router = express.Router();
var cloudinaryConfig = require('../config/cloudinaryCong.json')
var Cloudinary = require('cloudinary');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' })
Cloudinary.config(cloudinaryConfig);

const malla = require('../models/malla');

// READ ALL
router.get('/mallas', (req, res,next) => { 
  malla.find({},function(err,response){
    if(err) res.status(500).json(err);
    res.status(200).json(response);
  });
});

// READ BY TYPE
router.get('/mallas/:type',(req,res,next)=> {
  malla.find({type: req.params.type},function(err,response){
    if(err) res.status(500).json(err);
    res.status(200).json(response);
  })
})

// CREATE
router.post('/mallas', upload.single('images') ,(req,res)=>{
  var img;
  Cloudinary.v2.uploader.upload(req.file.path, function(err,result) {

    if(err) res.status(500).json(err);

    var nuevaMalla = malla({
      type: req.body.type,
      subtype: req.body.subtype,
      code: req.body.code,
      length: req.body.length,
      color: req.body.color,
      origin: req.body.origin,
      description: req.body.description,
      price_dolar: req.body.price_dolar,
      price_args: req.body.price_args,
      active: true,
      imgurl: result.url    
    });

    nuevaMalla.save(function(err,response){
      if(err) res.status(500).json(err);
      res.status(200).json(response);
    }) 
  })
});

// UPDATE
router.put('/mallas/:_id',upload.single('images') ,(req,res)=>{
  // UPDATE DE IMG URL EN EL SERVIDOR DE IMAGENES
  const img = "";
  const oldimgUrl = malla.find({_id : id },{imgUrl:1 , _id:0});
  if(oldimgUrl != req.params.imgUrl){
    Cloudinary.v2.uploader.upload(req.file.path,(err,result)=>{
      if(err) res.status(500).json(err);
      res.status(200).json(result);
      img = result;
    })
  }
  var nuevaMalla = new malla({
      type: req.body.type,
      subtype: req.body.subtype,
      code: req.body.code,
      length: req.body.length,
      color: req.body.color,
      origin: req.body.origin,
      description: req.body.description,
      price_dolar: req.body.price_dolar,
      price_args: req.body.price_args,
      active: req.body.active,
      imgurl: img      
  });
  malla.findByIdAndUpdate(req.params._id, {$set:nuevaMalla}, function(err, response) {
    if(err) res.status(500).json(err);
    res.status(200).json(response);
  });
})

module.exports = router;
