const { isValidObjectId } = require("mongoose");
const { generateRandomToken } = require("../../util/util");
const Account = require("../models/account");
const Contact = require("../models/contact");
const { validationResult } = require("express-validator");

class ContactController {
  // [GET] /contacts
  listContact = async (req, res, next) => {
    try {
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
      const data = await Contact.find(filter).skip(startIndex).limit(limit)
      const pageCount = await Contact.countDocuments(filter);
      res.json({
        status: 'success',
        code: 200,
        contacts: data,
        timeStamp: new Date().toLocaleString(),
        pagination: {
          currentPage: data.length == 0 ? 1 : page,
          totalDocuments: pageCount,
          totalPages: Math.ceil(pageCount / limit) == 0 ? 1 : Math.ceil(pageCount / limit)
        }
      })
    } catch (error) {
      console.log(error.message)
    }
  }
  createContact = async (req, res) => {
    const contactReq = req.body;
    const contact = new Contact()
    Object.assign(contact, contactReq)
    try {
      const contactSaved = await contact.save()
      return res.status(200).json({ status: 'success', code: 200, data: contactSaved, timestamp: new Date().toLocaleString() })
    } catch (error) {
      res.status(400).json({ status: 'error', code: 400, msg: error.message, timestamp: new Date().toLocaleString() })
    }


  }

}

module.exports = new ContactController();
