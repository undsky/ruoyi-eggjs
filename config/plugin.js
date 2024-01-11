/*
 * @Author: 姜彦汐
 * @Date: 2023-12-22 20:01:21
 * @LastEditors: 姜彦汐
 * @LastEditTime: 2023-12-23 22:00:22
 * @Description:
 * @Site: https://www.undsky.com
 */
/** @type Egg.EggPlugin */
module.exports = {
  cache: {
    enable: true,
    package: "egg-psyduck-cache",
  },
  cors: {
    enable: true,
    package: "egg-cors",
  },
  decoratorRouter: {
    enable: true,
    package: "egg-decorator-router",
  },
  jwt: {
    enable: true,
    package: "egg-jwt",
  },
  mybatis: {
    enable: true,
    package: "egg-psyduck-mybatis",
  },
  mysql: {
    enable: true,
    package: "egg-psyduck-mysql",
  },
  ratelimiter: {
    enable: true,
    package: "egg-psyduck-ratelimiter",
  },
  sqlite: {
    enable: true,
    package: "egg-psyduck-sqlite",
  },
  static: {
    enable: true,
  },
};
