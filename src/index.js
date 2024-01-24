
const lodash = require("lodash");
const path = require("path");
const fse = require("fs-extra");
const rimraf = require("rimraf");

/**
 * Plugin 插件入口
 * @param inputs 组件的入口参数
 * @param args 插件的自定义参数
 * @return inputs
 */

module.exports = async function index(inputs, args, logger) {
  logger.debug(`inputs params: ${JSON.stringify(inputs)}`);
  logger.debug(`args params: ${JSON.stringify(args)}`);
  const codeUri = lodash.get(inputs, "props.code");
  if (lodash.isEmpty(codeUri)) return;
  const bashPath = lodash.get(inputs, "cwd");
  const newCodeUri = path.isAbsolute(codeUri)
    ? codeUri
    : path.join(bashPath, codeUri);
  const publicPath = path.join(__dirname, "./code/public");

  rimraf.sync(publicPath);
  fse.ensureDirSync(publicPath);
  fse.copySync(newCodeUri, publicPath);
  const index = lodash.get(args, "index", "index.html");
  if (!fse.existsSync(path.join(publicPath, index))) {
    throw new Error(`${index} file not found.`);
  }
  const indexData = fse.readFileSync(
    path.join(__dirname, "template.js"),
    "utf-8"
  );
  fse.writeFileSync(
    path.join(__dirname, "./code/index.js"),
    lodash.replace(indexData, "$index", index)
  );
  return lodash.merge(inputs, {
    props: {
      runtime: "custom",
      code: path.join(__dirname, "./code"), // 支持ZIP能力
      customRuntimeConfig: {
        command: ["node"],
        args: ["/code/index.js"],
      },
      caPort: 9000,
    },
  });
};
