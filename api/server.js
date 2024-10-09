const app = require("./app");
require("dotenv").config();

app.get("/", async (req, res) => {
  res.send("This is Shiraz Subway api");
});

const port = process.env.PORT;
app.listen(port, () => console.log(`Listening on ${port}`));
