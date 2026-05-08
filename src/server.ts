import app from "./app.js";
import dotenv from 'dotenv';
dotenv.config();

console.log('Database URL:', process.env.DATABASE_URL)

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
