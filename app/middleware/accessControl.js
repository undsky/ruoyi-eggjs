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
    const { uuid } = ctx.state.user;

    let userInfo;
    if (uuid) {
      userInfo = await app.cache.default.wrap(uuid, async () => {
        return await ctx.service.db.common.adminuser.selectByUuid(uuid);
      });
    }

    if (!userInfo) {
      throw new app.jwt.UnauthorizedError("unauthorized", {
        message: "unauthorized",
      });
    }

    if ("forbidden" == userInfo) {
      // 封号
      throw new app.jwt.UnauthorizedError("forbidden", {
        message: "forbidden",
      });
    }

    ctx.state.user = _.assign({}, ctx.state.user, userInfo);

    await next();
  };
};
