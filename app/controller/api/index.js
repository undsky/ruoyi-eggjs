/*
 * @Author: 姜彦汐
 * @Date: 2023-12-22 20:01:21
 * @LastEditors: 姜彦汐
 * @LastEditTime: 2023-12-23 21:34:08
 * @Description:
 * @Site: https://www.undsky.com
 */
const Controller = require("egg").Controller;
const dayjs = require("dayjs");

const {
  Route,
  HttpGet,
  HttpPost,
  HttpAll,
  Middleware,
} = require("egg-decorator-router");

module.exports = (app) => {
  @Route("/api")
  class IndexController extends Controller {
    @HttpAll("/version")
    async version() {
      const { ctx } = this;

      ctx.body = {
        ip: ctx.request.ip,
        version: "1.0.0",
      };
    }

    @HttpPost("/login")
    async login() {
      const { ctx, service } = this;
    }

    @HttpPost("/logout")
    async logout() {
      const { ctx, service } = this;

      const { exp, jti } = ctx.state.user;

      const ttl = exp - dayjs().unix();
      if (ttl > 1) {
        await app.cache.default.set(jti, "revoked", {
          ttl,
        });
      }
    }
  }

  return IndexController;
};
