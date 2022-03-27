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
  const publicPath = path.join(__dirname, "./server/public");
  fse.ensureDirSync(publicPath);
  rimraf.sync(publicPath);
  fse.copySync(newCodeUri, publicPath);
  return lodash.merge(inputs, {
    props: {
      function: {
        codeUri: path.join(__dirname, "./server"),
        customRuntimeConfig: {
          command: ["node"],
          args: ["/server/index.js"],
        },
      },
    },
  });
};
