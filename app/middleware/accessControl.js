/*
 * @Author: 姜彦汐
 * @Date: 2023-12-22 20:01:21
 * @LastEditors: 姜彦汐
 * @LastEditTime: 2023-12-23 21:59:21
 * @Description:
 * @Site: https://www.undsky.com
 */
const _ = require("lodash");

module.exports = (options, app) => {
  return async function accessControl(ctx, next) {
    let userInfo;
    if (ctx.state.user && ctx.state.user.uuid) {
      userInfo = await app.cache.default.wrap(ctx.state.user.uuid, async () => {
        return null; // 查询用户信息
      });
    }

    if (!userInfo) {
      throw new app.jwt.UnauthorizedError("unauthorized", {
        message: "unauthorized",
      });
    }

    if ("forbidden" == userInfo.status) {
      // 封号
      throw new app.jwt.UnauthorizedError("forbidden", {
        message: "forbidden",
      });
    }

    await next();
  };
};
