export const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,        // MUST be true on HTTPS
    sameSite: "none",    // MUST be 'none' for cross-site
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
