const { isValidObjectId } = require("mongoose");
const { generateRandomToken } = require("../../util/util");
const Account = require("../models/account");
const Contact = require("../models/contact");
const Comment = require("../models/rateProduct");
const { validationResult } = require("express-validator");
const Order = require("../models/order");

class DashboardController {
    // [GET] /dashboard/infor
    getDashboard = async (req, res, next) => {
        try {

            // Orders
            let today = new Date();
            const prior1MonthDate = new Date(new Date().setDate(today.getDate() - 30)).toISOString().slice(0, 10);

            const filter = {
                $or: [
                    { createdAt: { $gte: prior1MonthDate, $lt: today } }
                    ,
                ],
            };
            const order = await Order.find(filter)
            const totalOrder = await Order.find().countDocuments()
            const orderFilter = order.filter((order) => order.status != "Cancel")

            //Revenue
            const revenue = orderFilter.reduce((sum, o) => sum + o.totalAmount, 0)
            const prior2MonthDate = new Date(new Date().setDate(today.getDate() - 60)).toISOString().slice(0, 10);
            const filter2 = {
                $or: [
                    { createdAt: { $gte: prior2MonthDate, $lt: prior1MonthDate } }
                    ,
                ],
            };
            const order2 = await Order.find(filter2)
            const order2Revenue = order2.reduce((s, o) => s + o.totalAmount, 0)
            let percent = 0
            if (revenue > order2Revenue || order2Revenue > 0) {
                percent = Math.floor((revenue / order2Revenue) * 100)
            } else {
                if (revenue < order2Revenue || revenue > 0) {
                    percent = Math.floor((order2Revenue / revenue) * 100)
                }
            }

            //account
            const account = await Account.find().countDocuments()
            const prior1WeekDate = new Date(new Date().setDate(today.getDate() - 8)).toISOString().slice(0, 10);

            const filter3 = {
                $or: [
                    { createdAt: { $gte: prior1WeekDate, $lt: today } }
                    ,
                ],
            };
            const accountNew = await Account.find(filter3).countDocuments()

            //Comment

            const filter4 = {
                $or: [
                    {
                        createdAt: {
                            $gte: new Date(today.getFullYear(), today.getMonth(), 1),
                            $lt: new Date(today.getFullYear(), today.getMonth() + 1, 1)
                        }
                    }
                    ,
                ],
            };
            const filter5 = {
                $or: [
                    {
                        createdAt: {
                            $gte: new Date(today.getFullYear(), today.getMonth() - 1, 1),
                            $lt: new Date(today.getFullYear(), today.getMonth(), 1)
                        }
                    }
                    ,
                ],
            };
            const cmt = await Comment.find(filter4).countDocuments()
            const cmt2 = await Comment.find(filter5).countDocuments()

            res.json({
                status: 'success',
                code: 200,
                data: {
                    orders: {
                        total: totalOrder,
                        new: order.length
                    },
                    revenue: {
                        data: revenue,
                        increase: revenue > order2Revenue,
                        percent: percent
                    },
                    users: {
                        total: account,
                        new: accountNew

                    },
                    comment: {
                        present: cmt,
                        old: cmt2
                    },
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
    getChart = async (req, res) => {
        const filter = {
            $or: [
                { createdAt: { $gte: prior1MonthDate, $lt: new Date() } }
                ,
            ],
        };
        const order = await Order.find({ createdAt: new Date() })
        console.log('order: ', order);
    }

}

module.exports = new DashboardController();
