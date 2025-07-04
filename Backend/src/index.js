import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookeiParser from 'cookie-parser';

dotenv.config();
const PORT = process.env.PORT;
const app = express();

app.use(cors({
  origin: "http://localhost:4000", // frontend origin
  credentials: true,              // allow credentials (cookies, auth)
}));
app.use(express.json({ limit: '5mb' }));
app.use(cookeiParser());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})