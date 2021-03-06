const {Material} = require("../models");
const {CustomError} = require("../helpers");

module.exports = {
  getMaterials: async(req, res, next)=>{
    const materials = await Material.find();
    
    return res.status(200).json(
        materials
    );
  },
  addMaterial: async(req, res, next)=>{
    const {name, unitType, unitPrice} = req.body;
    const material = await Material.findOne({
      name: name
    })

  if(material){
      return next(new CustomError("Material name already in use", 400))
  }
    let newMaterial = new Material({
      name,
      unitType,
      unitPrice
    });
    newMaterial = await newMaterial.save();
    return res.status(200).json(
        newMaterial
      )
  },
  getSingleMaterial: async(req, res, next)=>{
    const material = await Material.findById(req.params.id);
    if(!material){
      return next(new CustomError("Cannot find the given material", 404))
    }

    return res.status(200).json(
        material
    )
  },
  updateMaterial: async(req, res, next)=>{
    let material = await Material.findById(req.params.id);
    if(!material){
      return next(new CustomError("Cannot find the given material", 404))
    }
    const {name, unitType, unitPrice} = req.body;

    name? material.name = name: null;
    unitType? material.unitType = unitType: null;
    unitPrice? material.unitPrice = unitPrice: null;

    material = await material.save();

    return res.status(200).json(material)
  },
  deleteMaterial: async(req, res, next)=>{
    let material = await Material.findById(req.params.id);
    if(!material){
      return next(new CustomError("Cannot find the given material", 404))
    }
    await material.remove();
    return res.status(200).json({
      status:"success",
      data: null
    })
  }
}