/*
 * @Author: 姜彦汐
 * @Date: 2023-12-22 20:01:21
 * @LastEditors: 姜彦汐
 * @LastEditTime: 2023-12-23 22:00:16
 * @Description:
 * @Site: https://www.undsky.com
 */
/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // https://eggjs.org/zh-cn/tutorials/proxy.html
  config.proxy = true;
  config.ipHeaders = "X-Real-Ip, X-Forwarded-For";
  config.maxIpsCount = 1;

  config.mysql = {
    clients: {
      common: {
        host: "127.0.0.1",
        user: "ruoyi",
        password: "eZkBTE7HwtKmNnmJ",
        database: "ruoyi",
      },
    },
  };

  const redis = {
    port: 6379,
    host: "127.0.0.1",
    password: "",
    db: 1,
  };

  config.cache = { redis };

  config.ratelimiter = { redis };

  return config;
};
