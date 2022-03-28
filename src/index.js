const core = require("@serverless-devs/core");
const path = require("path");
const { lodash, fse, rimraf } = core;

/**
 * Plugin 插件入口
 * @param inputs 组件的入口参数
 * @param args 插件的自定义参数
 * @return inputs
 */

module.exports = async function index(inputs, args) {
  const codeUri = lodash.get(inputs, "props.function.codeUri");
  if (lodash.isEmpty(codeUri)) return;
  const bashPath = path.dirname(lodash.get(inputs, "path.configPath"));
  const newCodeUri = path.isAbsolute(codeUri)
    ? codeUri
    : path.join(bashPath, codeUri);
  const publicPath = path.join(__dirname, "./code/public");
  rimraf.sync(publicPath);
  fse.ensureDirSync(publicPath);
  fse.copySync(newCodeUri, publicPath);
  const index = lodash.get(args, "index", "index.html");
  const str = `
  const express = require("express");
  const path = require("path");
  const app = express();
  const port = 9000;

  app.use(express.static(path.join(__dirname, "public")));

  app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "public", "${index}"));
  });

  app.listen(port);
  `;
  fse.writeFileSync(path.join(__dirname, "./code/index.js"), str);
  return lodash.merge(inputs, {
    props: {
      function: {
        runtime: "custom",
        codeUri: path.join(__dirname, "./code"),
        customRuntimeConfig: {
          command: ["node"],
          args: ["/code/index.js"],
        },
      },
    },
  });
};
