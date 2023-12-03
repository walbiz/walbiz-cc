const logRequest = (req, res, next) => {
  console.log('Terjadi request ke PATH: ', req.path);
  next();
};

export default logRequest;
