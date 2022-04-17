const {Product, Material} = require("../models");

module.exports = {
    getProducts : async(req, res, next)=>{
        const query = await Product.buildFilterQuery(req);
        console.log(query);
        const product = await Product.find(query).populate("materials");
        return res.send(product);
    },
    postProducts: async(req,res,next)=>{
        const {title, description, materials, extraCharge, category, size} = req.body;
        let materialCharge = 0;

        for(let i = 0; i < materials.length; i++){
            let material = await Material.findById(materials[i].material);
            materialCharge = materialCharge + (material.unitPrice * materials[i].usedQuantity)
        }
        let totalPrice = materialCharge + parseInt(extraCharge);
        const newProduct = await Product.create({
            title,
            description,
            materials,
            category,
            totalPrice,
            extraCharge,
            size
        });
        return res.status(200).send(
                newProduct
        )
    },
    booksByUser: async(req,res,next)=>{
        return res.status(200).json(req.userBooks);
    },
    getSingleProduct: async(req,res,next)=>{
        return res.status(200).send(   
            req.product
        )
    },
    editProduct: async(req, res, next)=>{
        if(req.body.title){
            req.product.title = req.body.title
        }
        if(req.body.description){
            req.product.description = req.body.description
        }
        if(req.body.trackStock){
            req.product.trackStock = req.body.trackStock
        }
        if(req.body.inStock){
            req.product.inStock = req.body.inStock
        }
        if(req.body.size){
            req.product.size = req.body.size
        }
        const editedResult = await req.product.save();
        return res.status(200).json(editedResult)
    },
    deleteProduct: async(req, res, next)=>{
        await req.product.remove();
        return res.status(200).json({
            status:"success",
            message:"Product deleted successfully"
        });
    },
    myBooks: async(req, res, next)=>{
        const myBooks = await Book.find({postedBy: req.user._id}).populate("postedBy", {password:0});
        return res.status(200).json({
            status:"success",
            data:{
                books:myBooks
            }
        });
    }
}