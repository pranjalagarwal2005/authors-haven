const protect = async (req, res, next) => {
  // Check for Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (Format: "Bearer <token>")
      const token = req.headers.authorization.split(' ')[1];

      // TODO: In a production environment, you MUST verify this token using valid Firebase Admin SDK credentials.
      // const decodedToken = await admin.auth().verifyIdToken(token);
      // req.user = { _id: decodedToken.uid, email: decodedToken.email };

      // MVP SHORTCUT: We are trusting the client to send their UID as the token for now.
      // Ideally, the frontend sends the UID, or we verify the actual JWT token if we had the private key.
      req.user = { _id: token };

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
