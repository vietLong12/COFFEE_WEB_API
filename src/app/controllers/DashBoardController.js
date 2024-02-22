const { isValidObjectId } = require("mongoose");
const { generateRandomToken } = require("../../util/util");
const Account = require("../models/account");
const Contact = require("../models/contact");
const { validationResult } = require("express-validator");
const Order = require("../models/order");

class DashboardController {
    // [GET] /dashboard
    getDashboard = async (req, res, next) => {
        try {
            let today = new Date();
            const priorDate = new Date(new Date().setDate(today.getDate() - 30)).toISOString().slice(0, 10);
            today = today.toISOString().slice(0, 10);
            const filter = {
                $or: [
                    { createdAt: { $gte: priorDate, $lt: today } }
                    ,
                ],
            };
            const order = await Order.find(filter)
            console.log('order: ', order);
            const orderFilter = order.filter((order) => order.status != "Cancel")
            console.log('orderFilter: ', orderFilter);
            res.json({
                status: 'success',
                code: 200,
                data: {
                    orders: order.length,
                    revenue: 2516,
                    users: 39,
                    comment: 59,
                    prdPerDay: {
                        tra: 23,
                        caPhe: 40,
                        banhNgot: 80,
                        traSua: 50
                    },
                    notification: [
                        {
                            customer: "Nguyen Viet Long",
                            totalBill: 80
                        }
                    ],
                    bestSeller: []

                },
                timestamp: new Date().toLocaleString(),
            })
        } catch (error) {
            res.json({
                status: 'error',
                code: 500,
                msg: error.message,
                timestamp: new Date().toLocaleString()
            })
        }
    }

}

module.exports = new DashboardController();
