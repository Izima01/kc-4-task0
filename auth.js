// CommonJS module syntax
const username = 'admin';
const password = 'password';

function checkAuth(req, res, next) {
  const user = req.headers.authorization;
  if (!user || user.split(' ')[0] !== 'Basic') {
    return res.status(401).send('Authentication required');
  }

  const [authUsername, authPassword] = Buffer.from(user.split(' ')[1], 'base64').toString().split(':');

  if (authUsername === username && authPassword === password) {
    return next();
  } else {
    return res.status(401).send('Invalid username or password');
  }
}

module.exports = checkAuth; // Exporting the middleware function
