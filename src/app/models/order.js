const mongoose = require('mongoose');

function generateBillCode() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const milliseconds = now.getMilliseconds().toString().padStart(3, '0');

    const billCode = `${year}${month}${day}_${hours}${minutes}${seconds}_${milliseconds}`;

    return billCode;
}

// Define the Order model
const Order = mongoose.model("Order", new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true,
        default: generateBillCode,
    },
    customer: {
        username: { type: String, required: true },
        address: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true }
    },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            sizeId: { type: mongoose.Schema.Types.ObjectId, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'In progress', 'Completed', "Cancel"], default: 'Pending' },
    paymentMethod: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}), "coffee_order");

module.exports = Order;
