/*
 * @Author: 姜彦汐
 * @Date: 2021-04-23 11:44:23
 * @LastEditors: 姜彦汐
 * @LastEditTime: 2021-11-30 12:17:27
 * @Description: https://pm2.keymetrics.io/docs/usage/deployment/
 * @Site: https://www.undsky.com
 */
module.exports = {
  deploy: {
    production: {
      user: "root",
      host: "127.0.0.1", // 服务器 IP
      ref: "origin/master",
      repo: "git@gitee.com:mc-node/egg-psyduck-admin.git",
      path: "/www/wwwroot/psyduckadmin",
      "post-deploy":
        "npm install --production && npm run stop && npm run start",
      env: {
        NODE_ENV: "production",
      },
    },
  },
};
