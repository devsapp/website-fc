import serverless from "@serverless-devs/fc-http";
import express from "express";
import path from "path";

const startServer = (args) => {
  const app = express();

  app.use(express.static(args.staticPath || path.join(__dirname, "public")));

  app.get("/user", (req, res) => {
    res.send("hello user!");
  });
  return serverless(app);
};

export default startServer;
