const { generateRandomToken } = require("../../util/util");
const account = require("../models/account");
const Account = require("../models/account");
const { validationResult } = require("express-validator");

class AccountController {
  // [GET] /accounts
  listAccount(req, res, next) {
    Account.find().then((data) => {
      let list = [];
      const result = data.map((user) => {
        list.push({ ...user._doc, password: null });
      });
      res.json({
        list: list,
        recordSize: list.length,
      });
    });
  }

  //[GET] /acounts/:id
  getAccount = (req, res) => {
    const account_id = req.params.id;
    Account.findById(account_id)
      .then((account) => {
        res.json({ ...account._doc, password: null });
      })
      .catch((error) => {
        if (!account._doc) {
          res.status(400);
          res.json({
            message: "Id not found",
            createdAt: new Date(),
          });
        } else {
          res.status(400);
          res.json({
            message: error.message,
            createdAt: new Date(),
          });
        }
      });
  };

  // [POST] /accounts
  async createAccount(req, res) {
    try {
      const accountRequest = req.body;
      if (
        !accountRequest.username ||
        !accountRequest.password ||
        !accountRequest.email ||
        !accountRequest.phone
      ) {
        throw new Error("Invalid account request");
      }
      const account = new Account(accountRequest);
      account.token = generateRandomToken()
      const accountDb = await Account.findOne({ username: account.username })
      if (accountDb != null) {
        throw new Error("Account is exist")
      }
      const accountSaved = await account.save()
      return res.status(201).json({
        username: accountSaved.username,
        email: accountSaved.email,
        phone: accountSaved.phone,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

    } catch (error) {
      res.status(400);
      res.json({
        message: error.message,
        createdAt: new Date(),
      });
    }
  }

  // [PUT] /accounts
  editAccount = (req, res, next) => {
    const accountReq = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    if (accountReq.password) {
      if (accountReq.password.length < 6 || accountReq.password.length > 20) {
        return res.status(400).json({
          message: "Invalid password",
          createdAt: new Date(),
        });
      }
    } else {
      Account.findById(accountReq.id)
        .then((account) => {
          if (!account) {
            return res.status(404).json({
              message: "Account not found",
              createdAt: new Date(),
            });
          } else {
            account.email = accountReq.email || account.email;
            account.password = accountReq.password || account.password;
            account.avatar = accountReq.avatar || account.avatar;
            account.phone = accountReq.phone || account.phone;
            const result = account.save();
            result.then((resultAccount) => {
              return res.status(200).json({
                ...resultAccount._doc,
                updatedAt: new Date(),
              });
            });
          }
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({
            message: "Internal server error",
            createdAt: new Date(),
          });
        });
    }
  };

  //[DELETE] /accounts/:id
  deleteAccount = (req, res) => {
    Account.findByIdAndDelete(req.params.id)
      .then((result) => {
        if (result) {
          res.status(200);
          res.json({
            message: "Account deleted",
            createdAt: new Date(),
          });
        } else {
          res.status(400);
          res.json({
            message: "Account not found",
            createdAt: new Date(),
          });
        }
      })
      .catch((err) => {
        res.status(400);
        res.json({ message: err.message, createdAt: new Date() });
      });
  };
}

module.exports = new AccountController();
