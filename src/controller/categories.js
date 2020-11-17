const { category, books } = require("../../models");

exports.getCategory = async (req,res) => {
    try {
        const categories = await category.findAll({
            include: books
        });
        res.status(200).send({
            message:"Response Successfull",
            data: {categories},
        })
    } catch (error) {
        res.status(500).send({
            message:"Server ERROR",
        })
    }
}

exports.createCategory = async (req,res) =>{
    try {
        const categoryCreated = await category.create(req.body)

        res.send({
            message:"Upload Successfull",
            data: { 
                category: categoryCreated, 
            }
        })

    } catch (error) {
        console.log(err);
        res.status(500);
        res.send({
            message:"Upload Failed",
        })
    }
}

exports.deleteCategory = async (req,res) =>{
    try {
        const { id } = req.params;
        await category.destroy({
            where:{
                id
            }
        });

        res.send({
            message: `Categories with ID ${id} was successfully deleted`
        })
    } catch (error) {
        
    }
}

exports.detailsCategory = async (req,res) => {
    try {
        const { id } = req.params;

        const details = await category.findOne({
            where:{
                id,
            },
            include: books
        })

        res.send({
            message: "Response Success",
            data: details
        })
        
    } catch (error) {
        console.log(err);
        res.status(500);
        res.send({
            message:"Upload Failed",
        }) 
    }
}
  
exports.updateCategory = async (req,res) => {
    try {
        const { id } = req.params;

        const detail = await category.findOne({
            where:{
                id,
            }
        })

        const updating = await detail.update(req.body)

        res.send({
            message: "Update Success",
            data: updating,
        })
        
    } catch (error) {
        console.log(err);
        res.status(500);
        res.send({
            message:"Update Failed",
        }) 
    }
}


