import rateLimit from "express-rate-limit";

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 min
  max: process.env.NODE_ENV !== "dev" ? 1000 : 20,
  message: { message: "Query limit reached. Please wait." },
});

export default rateLimiter;
