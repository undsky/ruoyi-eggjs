const Controller = require("egg").Controller;
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
  }

  return IndexController;
};
