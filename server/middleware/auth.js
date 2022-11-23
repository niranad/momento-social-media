import jwt from 'jsonwebtoken';
import customEnv from 'custom-env';

customEnv.env(true);

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    let decodedData;

    if (token) {
      decodedData = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decodedData?.id;
      return next();
    }
    
    next('route');
  } catch (error) {
    res.status(401).send({ message: 'Authentication Required'});
  }
}

export default auth;
