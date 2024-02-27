const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];
  console.log('token: ', token);

  if (!token) {
    return res.sendStatus(401);
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SERCET);
    console.log("decoded: ", decoded);
    next();
  } catch (error) {
    console.log("!!!ERROR: ", error.message);
    return res.sendStatus(403);
  }
};

module.exports = verifyToken;
