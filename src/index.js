import { loadComponent } from "@serverless-devs/core";

/**
 * Plugin 插件入口
 * @param inputs 组件的入口参数
 * @param args 插件的自定义参数
 * @return inputs
 */
export default async function (inputs, args) {
  const fc = await loadComponent("fc");
  await fc.deploy(inputs);
  return { ...inputs };
}
