const getIO = (req) => {
  return req.app.get("io");
};

module.exports = getIO;
