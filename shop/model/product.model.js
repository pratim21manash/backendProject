const { Schema, model, default: mongoose } = require("mongoose")

const  productSchema = new Schema(
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true
        },
        name: {
            type: String,
            trim: true,
            required: true
        },
        sku: {
            type: String,
            trim: true,
            unique: true,
            required: true
        },
        category: {
            type: String,
            trim: true,
            required: true
        },
        description: {
            type: String,
            trim: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        cost: {
            type: Number,
            required: true,
            min: 0
        },
        quantity: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },
        image: {
            type: String,
            trim: true
        },
        lowStockThreshold: {
            type: Number,
            default: 10
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
)


//Auto-generated SKU
productSchema.pre("save", async function(next){
    if(!this.isNew) return next()

    const count = await model("Product").countDocuments()
    this.sku = `PROD-${String(count + 1).padStart(5, '0')}`
    next()
})


const ProductModel = model("Product", productSchema)
module.exports = ProductModel