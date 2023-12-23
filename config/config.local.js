/*
 * @Author: 姜彦汐
 * @Date: 2023-12-22 20:01:21
 * @LastEditors: 姜彦汐
 * @LastEditTime: 2023-12-23 22:00:09
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

  config.mysql = {
    clients: {
      ruoyi: {
        host: "172.81.247.8",
        user: "ruoyi",
        password: "eZkBTE7HwtKmNnmJ",
        database: "ruoyi",
      },
    },
  };

  const redis = {
    port: 6379,
    host: "172.81.247.8",
    password: "jyx_redis@12357",
    db: 0,
  };

  config.cache = { redis };

  config.ratelimiter = { redis };

  return config;
};
