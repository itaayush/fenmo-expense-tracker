const express = require("express");
const cors = require("cors");
const expenseRoutes = require("./routes/expenseRoutes");
const { getDb } = require("./db/database");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", expenseRoutes);

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    await getDb();
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to initialize database", error);
    process.exit(1);
  }
}

startServer();
