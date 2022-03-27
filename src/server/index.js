const serve = require("koa-static");
const Koa = require("koa");
const app = new Koa();
const path = require("path");

app.use(serve(path.join(__dirname, "./public")));
app.listen(9000);
