const { isValidObjectId } = require("mongoose");
const { generateRandomToken } = require("../../util/util");
const account = require("../models/account");
const Account = require("../models/account");
const { validationResult } = require("express-validator");
const cloudinary = require("cloudinary")

cloudinary.config({
  cloud_name: 'dxx3yfsyc',
  api_key: '425859424738119',
  api_secret: "FZ8jNTX8hNj9rJbIUAPb6d_H-lY"
});
class AccountController {
  // [GET] /accounts
  listAccount = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5
    const keyword = req.query.keyword || ""
    const startIndex = (page - 1) * limit;
    const filter = {
      $or: [
        { username: { $regex: keyword, $options: 'i' } },
        { email: { $regex: keyword, $options: 'i' } },
        { phone: { $regex: keyword, $options: 'i' } },
      ],
    };
    const data = await Account.find(filter).skip(startIndex).limit(limit)
    const pageCount = await Account.countDocuments(filter);
    res.json({
      status: 'success',
      code: 200,
      accounts: data,
      timeStamp: new Date(),
      pagination: {
        currentPage: data.length == 0 ? 1 : page,
        totalDocuments: pageCount,
        totalPages: Math.ceil(pageCount / limit)
      }
    })
  }

  //[GET] /acounts/:id
  getAccount = async (req, res) => {
    const startTime = new Date().getTime();
    const account_id = req.params.id;
    try {
      if (!isValidObjectId(account_id)) {
        throw {
          message: "ID is not valid", code: 400
        }
      }
      const account = await Account.findById(account_id)
      if (!account) {
        throw {
          message: "Account not found",
          code: 404
        }
      }
      const endTime = new Date().getTime() - startTime;
      return res.json({
        status: "success",
        code: 200,
        data: {
          user_id: account._id,
          username: account.username,
          avatar: account.avatar,
          email: account.email,
          phone: account.phone,
          created_at: account.createdAt,
          updated_at: account.updatedAt,
          address: account.address,
          cart: account.cart
        },
        timeStamp: new Date().toLocaleString(),
        processingTime: endTime + "ms"

      });
    } catch (error) {
      return res.status(error.code).json({
        status: "error",
        code: error.code,
        msg: error.message,
        createdAt: new Date().toLocaleString(),
      })
    }
  };

  // [POST] /accounts
  async createAccount(req, res, next) {
    const reqBody = req.body

    //Xoá mọi token đẩy lên từ req
    reqBody.token = ""

    const account = new Account(reqBody);
    if (reqBody.email) {
      const accountExist = await Account.find({ email: reqBody.email })
      if (accountExist.length > 0) {
        return res.status(400).json({ status: 'error', code: 400, msg: "Email is exist", createdAt: new Date().toLocaleString() })
      }
    }
    const accountResult = await account.save()
    return res.json({
      status: 'success', code: 200, msg: "Created account successfully", account: {
        username: accountResult.username,
        email: accountResult.email,
        phone: accountResult.phone
      },
      timeStamp: accountResult.createdAt.toLocaleString()
    })
  }

  // [PUT] /accounts
  editAccount = async (req, res, next) => {
    const accountReq = req.body;
    const account = await Account.findById(accountReq.user_id)
    if (accountReq.password && accountReq.newPassword) {
      if (accountReq.password === account.password) {
        Object.assign(account, accountReq)
        account.password = accountReq.newPassword;
        account.updatedAt = new Date()
        const accountSaved = await account.save()
        return res.json({
          status: 'success', code: 200, msg: "Updated account successfully", account: {
            username: accountSaved.username,
            email: accountSaved.email,
            phone: accountSaved.phone
          },
          timeStamp: accountSaved.createdAt.toLocaleString()
        })

      } else {
        return res.status(400).json({
          status: 'error',
          code: 400,
          msg: "Change password failed",
          timestamp: new Date().toLocaleString()
        })
      }
    } else {
      if (account.password == accountReq.password) {
        Object.assign(account, accountReq)
        account.updatedAt = new Date()
        const accountSaved = await account.save()
        return res.json({
          status: 'success', code: 200, msg: "Updated account successfully", account: {
            username: accountSaved.username,
            email: accountSaved.email,
            phone: accountSaved.phone
          },
          timeStamp: accountSaved.createdAt.toLocaleString()
        })
      } else {
        if (!accountReq.password && accountReq.address) {
          account.address = accountReq.address
          account.updatedAt = new Date()
          const accountSaved = await account.save()
          return res.json({
            status: 'success', code: 200, msg: "Updated account successfully", account: {
              username: accountSaved.username,
              email: accountSaved.email,
              phone: accountSaved.phone
            },
            timeStamp: accountSaved.createdAt.toLocaleString()
          })
        } else {
          return res.status(400).json({
            status: 'error',
            code: 400,
            msg: "Password is wrong",
            timestamp: new Date().toLocaleString()
          })
        }



      }
    }
  }


  //[DELETE] /accounts/:id
  deleteAccount = async (req, res) => {
    const userId = req.params.id;
    const accountDeleted = await Account.findByIdAndDelete(userId) || { _id: null, username: null, email: null };

    return res.status(200).json({
      status: 'success', code: 200, msg: "Account deleted successfully", account: {
        userId: accountDeleted._id,
        username: accountDeleted.username,
        email: accountDeleted.email,
      },
      timeStamp: new Date().toLocaleString()
    })


  }
}

module.exports = new AccountController();
