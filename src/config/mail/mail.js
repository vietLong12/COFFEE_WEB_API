const nodemailer = require('nodemailer');


// var mainOptions = {
//     from: 'Monster Coffee  <longnv.coffee.monster@gmail.com>',
//     to: customer.email,
//     subject: "Thông Báo: Đơn Hàng Mới Đã Đặt - #" + billCode,
//     text: 'Cảm ơn ' + customer.username + ' đã đặt hàng tại Monster Coffee! Đơn hàng của bạn đã được xác nhận và đang được xử lý.',
//     html: '<h3>Cảm ơn bạn đã đặt hàng tại Monster Coffee!</h3><h4>Đơn hàng của bạn đã được xác nhận và đang được xử lý. Dưới đây là chi tiết đơn hàng:</h4><ul style="font-size: 18px;"><li>Mã đơn hàng: #' + billCode + '</li><li>Ngày đặt hàng:' + createdAt + '</li><li>Tổng giá trị đơn hàng: ' + totalPrice + '.000đ </li></ul><h6>Chúng tôi sẽ thông báo cho bạn khi đơn hàng được gửi đi. Cảm ơn bạn đã lựa chọn Monster Coffee!</h6>'
// };

function sendEmail(mainOptions) {
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'longnv.coffee.monster@gmail.com',
            pass: 'rvis yyxv lyup ntex'
        }
    });

    transporter.sendMail(mainOptions, function (err, info) {
        if (err) {
            throw {
                code: 400,
                message: err.message
            };
        } else {
            console.log('Message sent: ' + info.response);
        }
    });
}

module.exports = { sendEmail };
