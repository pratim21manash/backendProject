const { Schema, model, default: mongoose, Types} = require("mongoose");

const saleItemSchema = new Schema({
    product: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    total: {
        type: Number,
        required: true,
        min: 0
    }
})


const saleSchema = new Schema(
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true
        },
        invoiceNumber: {
            type: String,
            unique: true,
            required: true
        },
        isItem: [saleItemSchema],
        subTotal: {
            type: Number,
            required: true,
            min: 0
        }, 
        tax: {
            type: Number,
            default: 0,
            min: 0
        },
        total: {
            type: Number,
            required: true,
            min: 0
        },
        paymentMethod: {
            type: String,
            enum: ["cash", "card", "upi", "credit"],
            default: cash
        },
        customerName: {
            type: String,
            trim: true
        },
        customerEmail: {
            type: String,
            trim: true
        },
        notes: {
            type: String,
            trim: true
        }
    },
    { timestamps: true }
)


saleSchema.pre("save", async function(next){
    if (!this.isNew) return next()

    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(
        now.getMonth() + 1
    ).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`

    const count = await model("Sale").countDocuments({
        createdAt: {
            $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
        }
    });

    this.invoiceNumber = `INV-${dateStr}-${String(count + 1).padStart(4, "0")}`
    next()
})


const saleModel = model("Sale", saleSchema)
module.exports = saleModel