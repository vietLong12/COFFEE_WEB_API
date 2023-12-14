module.exports = {
  multipleMongooseToObject: (mongooseArray) => {
    return mongooseArray.map((mongoose) => {
      return mongoose.toObject();
    });
  },
  mongooseToObject: (mongoose) => (mongoose ? mongoose.toObject() : mongoose),
  formatMongoDate: (mongoDate) => {
    if (!mongoDate) {
      return null;
    }

    try {
      const dateObject = new Date(mongoDate);

      const year = dateObject.getFullYear();
      const month = String(dateObject.getMonth() + 1).padStart(2, "0");
      const day = String(dateObject.getDate()).padStart(2, "0");
      const hours = String(dateObject.getHours()).padStart(2, "0");
      const minutes = String(dateObject.getMinutes()).padStart(2, "0");
      const seconds = String(dateObject.getSeconds()).padStart(2, "0");

      const formattedDate = ` ${hours}:${minutes}:${seconds} -/- ${day}/${month}/${year}`;

      return formattedDate;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },
};
