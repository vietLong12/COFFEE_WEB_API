const { isValidObjectId } = require("mongoose");
const { generateRandomToken } = require("../../util/util");
const Account = require("../models/account");
const Category = require("../models/categoryProduct");
const Product = require("../models/product");
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
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const filter = {
            createdAt: { $gte: startOfToday, $lt: endOfToday }
        };
        const order = await Order.find()
        const r = []
        for (const o of order) {
            r.push(...o.items)
        }

        const productQuantities = r.reduce((accumulator, currentValue) => {
            const { productId, quantity } = currentValue;
            accumulator[productId] = (accumulator[productId] || 0) + quantity;
            return accumulator;
        }, {});

        const orderArray = Object.entries(productQuantities);
        const top5 = orderArray.sort((a, b) => b[1] - a[1]);
        const result = top5.map(async (i) => {
            const data = await Product.findById(i[0])
            if (data) {
                const category = await Category.findById(data.categoryId)
                return {
                    ...i, productName: data.productName, category: category.category
                }
            } else {
                return {
                    ...i, productName: "Chưa rõ sản phẩm", category: "Không rõ"
                }
            }
        })
        const a = await Promise.all(result)

        const categoryQuantities = a.reduce((accumulator, currentValue) => {
            const { category, quantity } = currentValue;
            accumulator[category] = (accumulator[category] || 0) + currentValue[1];
            return accumulator;
        }, {});
        // const orderToday = await Order.find(filter)
        const dataOldMonth = [];
        const dataPresent = [];
        const day = new Date().getDate() + 1
        const dayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
        for (let i = 1; i <= dayOfMonth; i++) {
            if (i < day) {
                dataPresent.push(Math.floor(Math.random() * 100));
            }
            dataOldMonth.push(Math.floor(Math.random() * 100));
        }


        const orderNew = await Order.find().sort({ createdAt: -1 }).limit(5);
        const o = orderNew.map(o => {
            return {
                username: o.customer.username,
                totalBill: o.totalAmount
            }
        })
        const result2 = await Promise.all(o)
        res.json({
            status: "success",
            code: 200,
            data: {
                bestSeller: a.slice(0, 5), productToday: categoryQuantities, chart: {
                    dataOldMonth, dataPresent
                }, notification: result2
            },
            timestamp: new Date().toLocaleString()
        })
    }

}

module.exports = new DashboardController();
