const Product = require("../models/product");
const Account = require("../models/account");
const Order = require("../models/order");
const { generateRandomToken } = require("../../util/util");
const { sendEmail } = require("../../config/mail/mail");

function generateRandomString(num) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < num; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}

class OrderController {
    // [POST] /login
    login = async (req, res, next) => {
        const orderReq = req.body
        if (orderReq.token) {
            const account = await Account.findOne({ token: orderReq.token })
            if (account) {
                return res.json({ status: 'success', code: 200, account: { ...account._doc, password: null }, timestamp: new Date().toLocaleString() })
            } else {
                return res.json({ status: 'fail', code: 404, token: "token not found", timestamp: new Date().toLocaleString() })
            }
        }
        try {
            const account = await Account.findOne({ email: orderReq.email, password: orderReq.password })
            if (account) {
                if (orderReq.isRememberMe) {
                    account.token = generateRandomToken()
                    const accountSaved = await account.save()
                    return res.json({ status: 'success', code: 200, account: { ...accountSaved._doc, password: null }, timestamp: new Date().toLocaleString() })
                }
                return res.json({
                    status: 'success', code: 200, account: { ...account._doc, password: null }, timestamp: new Date().toLocaleString()
                })
            } else {
                throw {
                    code: 400,
                    message: "login failed"
                }
            }
        } catch (error) {
            return res.status(error.code || 400).json({
                status: 'error',
                code: error.code || 400,
                msg: error.message,
                timestamp: new Date().toLocaleString()
            })
        }
    }

    // [POST] /logout
    logout = async (req, res, next) => {
        const orderReq = req.body
        try {
            const account = await Account.findOne({ email: orderReq.email })
            if (account) {
                account.token = ""
                const accountSaved = await account.save()
            } else {
                throw {
                    code: 400,
                    message: "Bad request"
                }
            }
            return res.status(200).json({ status: 'success', code: 200, msg: "logout successfully", timestamp: new Date().toLocaleString() })
        } catch (error) {
            return res.status(error.code || 400).json({
                status: 'error',
                code: error.code || 400,
                msg: error.message,
                timestamp: new Date().toLocaleString()
            })
        }
    }

    // [POST] /find
    findPasswordByEmail = async (req, res) => {
        const email = req.body.email;
        const verifyCode = generateRandomString(6);
        //handle find password
        const account = await Account.findOne({ email: email });
        if (account) {
            account.verifyCode = verifyCode;
            account.save();
            const mainOptions = {
                from: 'Monster Coffee  <longnv.coffee.monster@gmail.com>',
                to: email,
                subject: "Monster Coffee thông báo - Yêu cầu đặt lại mật khẩu",
                text: `Mã xác nhận của bạn là: ${verifyCode.toUpperCase()}`,
                html: `<h2>Xác Nhận Khôi Phục Mật Khẩu</h2><p>Cảm ơn bạn đã yêu cầu khôi phục mật khẩu. Dưới đây là mã xác nhận của bạn:</p><p style="font-size: 24px; font-weight: bold;">${verifyCode}</p><p>Vui lòng nhập mã xác nhận này vào trang web để hoàn tất quá trình khôi phục mật khẩu.</p><p>Nếu bạn không yêu cầu khôi phục mật khẩu, hãy bỏ qua email này.</p><p>Trân trọng,<br>Đội ngũ hỗ trợ của chúng tôi</p>`
            };
            setTimeout(() => {
                account.verifyCode = ""
                account.save()
            }, (2 * 60 * 1000))
            sendEmail(mainOptions)
            return res.status(200).json({ status: 'success', code: 200, msg: "send mail successfully", timestamp: new Date().toLocaleString() })
        } else {
            return res.status(404).json({ status: 'fail', code: 404, msg: "account not found", timestamp: new Date().toLocaleString() })

        }
    }
    createNewPassword = async (req, res) => {
        const verifyCode = req.body.verifyCode;
        const email = req.body.email;
        try {
            const account = await Account.findOne({ email: email, verifyCode: verifyCode })
            if (account) {
                account.password = generateRandomString(12)
                const accountSaved = await account.save()
                const mainOptions = {
                    from: 'Monster Coffee  <longnv.coffee.monster@gmail.com>',
                    to: account.email,
                    subject: "Monster Coffee thông báo - Mật khẩu mới",
                    text: `Bạn đã thay đổi mật khẩu mới!`,
                    html: `<h2>Xác Nhận Thay Đổi Mật Khẩu</h2><p>Cảm ơn bạn đã yêu cầu khôi phục mật khẩu. Dưới đây là mật khẩu hiện tại của bạn:</p><p style="font-size: 24px; font-weight: bold;">${accountSaved.password}</p><p>Vui lòng đăng nhập vào website để đổi mật khẩu.</p><br><p>Trân trọng,<br>Đội ngũ hỗ trợ của chúng tôi</p>`
                };
                sendEmail(mainOptions)
                return res.status(200).json({ status: 'success', code: 200, msg: "send password to mail successfully", timestamp: new Date().toLocaleString() })
            } else {
                throw {
                    message: "verify code overtime"
                }
            }
        } catch (error) {
            return res.status(400).json({ status: 'error', code: 400, message: error.message, timestamp: new Date().toLocaleString() })
        }

    }
}

module.exports = new OrderController();
