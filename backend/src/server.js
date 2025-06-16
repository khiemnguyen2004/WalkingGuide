const express = require("express");
const AppDataSource = require("./data-source");

const app = express();
const userRoutes = require("./routes/userRoutes");

app.use(express.json());
app.use("/api/users", userRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    app.listen(3000, () => console.log("Server is running on port 3000"));
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
