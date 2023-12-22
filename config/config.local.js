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
      common: {
        host: "172.81.247.8",
        user: "undsky",
        password: "BXdAL568zSCD6ip5",
        database: "undsky",
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
