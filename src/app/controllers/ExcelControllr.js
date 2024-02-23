const ExcelJS = require('exceljs');
const Product = require("../models/product");
const Account = require("../models/account");
const Order = require("../models/order");
const Category = require("../models/categoryProduct");
const fs = require('fs');
const moment = require('moment');

class ExcelController {
    exportProducts = async (req, res, next) => {
        try {
            const products = await Product.find();
            const jsonData = [];

            for (const product of products) {
                const category = await Category.findById(product.categoryId);
                const productData = {
                    _id: product._id,
                    productName: product.productName,
                    desc: product.desc,
                    category: category.category
                };
                product.sizes.forEach(size => {
                    jsonData.push({
                        ...productData,
                        size_name: size.name,
                        price: size.price
                    });
                });
            }

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Data');

            worksheet.addRow(["Danh sách sản phẩm"]);
            worksheet.mergeCells('A1', 'F1');
            worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
            worksheet.getCell('A1').font = { bold: true, size: 20 };

            worksheet.addRow([]);

            worksheet.addRow([
                'ID',
                'Tên sản phẩm',
                'Mô tả sản phẩm',
                'Phân loại',
                'Tên size',
                'Giá'
            ]);



            worksheet.getCell("A3").font = { bold: true }
            worksheet.getCell("B3").font = { bold: true }
            worksheet.getCell("C3").font = { bold: true }
            worksheet.getCell("D3").font = { bold: true }
            worksheet.getCell("E3").font = { bold: true }
            worksheet.getCell("F3").font = { bold: true }

            worksheet.getColumn('A').width = 40;
            worksheet.getColumn('B').width = 30;
            worksheet.getColumn('C').width = 20;
            worksheet.getColumn('D').width = 15;
            worksheet.getColumn('E').width = 10;
            worksheet.getColumn('F').width = 14;
            worksheet.getColumn('G').width = 20;
            worksheet.getColumn('H').width = 20;
            worksheet.getColumn('I').width = 20;
            worksheet.getColumn('J').width = 25;

            jsonData.forEach(data => {
                worksheet.addRow([
                    data._id,
                    data.productName,
                    data.desc,
                    data.category,
                    data.size_name,
                    data.price
                ]);
            });

            const filePath = 'data.xlsx';
            await workbook.xlsx.writeFile(filePath);

            return res.download(filePath, 'Danh_sach_san_pham_' + moment().format('DDMMYYYY') + '.xlsx');
        } catch (error) {
            return res.status(500).json({ error: 'Đã có lỗi xảy ra khi xuất dữ liệu ra file Excel' });
        }
    }

    exportAccounts = async (req, res, next) => {
        try {
            const accounts = await Account.find();
            const jsonData = [];

            for (const account of accounts) {
                let address = account.address.filter(address => address.defaultAddress === true)
                address[0] = address[0]?.homeAddress + " - " + address[0]?.ward.name + " - " + address[0]?.district.name + " - " + address[0]?.city.name
                const accountData = {
                    _id: account._id,
                    username: account.username,
                    email: account.email,
                    phone: account.phone,
                    address: address[0],
                    createdAt: account.createdAt
                };
                jsonData.push(accountData)
            }

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Nguoi_dung');

            worksheet.addRow(["Danh sách người dùng"]);
            worksheet.mergeCells('A1', 'F1');
            worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
            worksheet.getCell('A1').font = { bold: true, size: 20 };

            worksheet.addRow([]);

            worksheet.addRow([
                'ID',
                'Tên người dùng',
                'Email',
                'Số điện thoại',
                'Địa chỉ',
                'Ngày tạo tài khoản'
            ]);



            worksheet.getCell("A3").font = { bold: true }
            worksheet.getCell("B3").font = { bold: true }
            worksheet.getCell("C3").font = { bold: true }
            worksheet.getCell("D3").font = { bold: true }
            worksheet.getCell("E3").font = { bold: true }
            worksheet.getCell("F3").font = { bold: true }

            worksheet.getColumn('A').width = 35;
            worksheet.getColumn('B').width = 30;
            worksheet.getColumn('C').width = 25;
            worksheet.getColumn('D').width = 15;
            worksheet.getColumn('E').width = 50;
            worksheet.getColumn('F').width = 20;
            worksheet.getColumn('G').width = 20;
            worksheet.getColumn('H').width = 20;
            worksheet.getColumn('I').width = 20;
            worksheet.getColumn('J').width = 25;

            jsonData.forEach(data => {
                worksheet.addRow([
                    data._id,
                    data.username,
                    data.email,
                    data.phone,
                    data.address,
                    data.createdAt
                ]);
            });

            const filePath = 'data.xlsx';
            await workbook.xlsx.writeFile(filePath);

            return res.download(filePath, 'Danh_sach_nguoi_dung_' + moment().format('DDMMYYYY') + '.xlsx');
        } catch (error) {
            console.log('error: ', error);
            return res.status(500).json({ error: 'Đã có lỗi xảy ra khi xuất dữ liệu ra file Excel' });
        }
    }

    exportOrder = async (req, res, next) => {
        try {
            let today = new Date();
            const priorDate = new Date(new Date().setDate(today.getDate() - 90)).toISOString().slice(0, 10);
            today = today.toISOString().slice(0, 10);
            const filter = {
                $or: [
                    { createdAt: { $gte: priorDate, $lt: today } }
                    ,
                ],
            };
            const orders = await Order.find(filter)
            const jsonData = [];

            for (const order of orders) {
                const orderData = {
                    orderNumber: order.orderNumber,
                    customer: `${order.customer.username} - ${order.customer.phone}`,
                    address: order.customer.address,
                    totalAmount: order.totalAmount,
                    quantityProduct: order.items.length,
                    status: order.status,
                    paymentMethod: order.paymentMethod,
                    createdAt: order.createdAt
                };
                jsonData.push(orderData)
            }

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('order');

            worksheet.addRow(["Danh sách đơn hàng"]);
            worksheet.mergeCells('A1', 'H1');
            worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
            worksheet.getCell('A1').font = { bold: true, size: 20 };

            worksheet.addRow([]);

            worksheet.addRow([
                'ID',
                'Thông tin khách hàng',
                'Địa chỉ',
                'Tổng giá trị đơn hàng',
                'Số lượng sản phẩm',
                'Trạng thái đơn hàng',
                "Phương thức thanh toán",
                "Ngày tạo đơn"
            ]);



            worksheet.getCell("A3").font = { bold: true }
            worksheet.getCell("B3").font = { bold: true }
            worksheet.getCell("C3").font = { bold: true }
            worksheet.getCell("D3").font = { bold: true }
            worksheet.getCell("E3").font = { bold: true }
            worksheet.getCell("F3").font = { bold: true }
            worksheet.getCell("G3").font = { bold: true }
            worksheet.getCell("H3").font = { bold: true }

            worksheet.getColumn('A').width = 25;
            worksheet.getColumn('B').width = 30;
            worksheet.getColumn('C').width = 40;
            worksheet.getColumn('D').width = 15;
            worksheet.getColumn('E').width = 10;
            worksheet.getColumn('F').width = 20;
            worksheet.getColumn('G').width = 20;
            worksheet.getColumn('H').width = 20;
            worksheet.getColumn('I').width = 20;
            worksheet.getColumn('J').width = 25;

            jsonData.forEach(data => {
                worksheet.addRow([
                    data.orderNumber,
                    data.customer,
                    data.address,
                    data.totalAmount,
                    data.quantityProduct,
                    data.status,
                    data.paymentMethod,
                    data.createdAt
                ]);
            });

            const filePath = 'data.xlsx';
            await workbook.xlsx.writeFile(filePath);

            return res.download(filePath, 'Danh_sach_don_hang_' + moment().format('DDMMYYYY') + '.xlsx');
        } catch (error) {
            console.log('error: ', error);
            return res.status(500).json({ error: 'Đã có lỗi xảy ra khi xuất dữ liệu ra file Excel' });
        }
    }
}

module.exports = new ExcelController();
