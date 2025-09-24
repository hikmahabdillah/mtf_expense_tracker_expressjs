// import jwt from "jsonwebtoken";

// const authMiddleware = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   // Cek apakah ada header Authorization
//   if (!authHeader || !authHeader.startsWith("Bearer")) {
//     return res
//       .status(401)
//       .json({ message: "Akses ditolak, token tidak ditemukan" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     // Verifikasi token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Token tidak valid" });
//   }
// };

// export default authMiddleware;
