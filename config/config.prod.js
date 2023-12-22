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
        user: "undsky",
        password: "BXdAL568zSCD6ip5",
        database: "undsky",
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
