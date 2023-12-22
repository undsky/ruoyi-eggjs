module.exports = (options, app) => {
  return async function formatBody(ctx, next) {
    await next();

    if (ctx.response.type && "application/json" != ctx.response.type) return;

    if (ctx.body) {
      if (!ctx.body.code) {
        ctx.body = {
          code: ctx.status,
          msg: "",
          data: ctx.body,
        };
      }
    } else {
      ctx.body = {
        code: ctx._matchedRoute ? 200 : ctx.status,
        msg: "",
        data: null,
      };
    }
  };
};
