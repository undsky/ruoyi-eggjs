/*
 * @Author: 姜彦汐
 * @Date: 2023-12-22 20:01:21
 * @LastEditors: 姜彦汐
 * @LastEditTime: 2023-12-23 21:23:47
 * @Description:
 * @Site: https://www.undsky.com
 */
module.exports = function (source) {
  return {
    templates: [
      {
        name: "template/plugin",
        matches: "lib/plugin/*",
      },
      {
        name: "template/controller.js.njk",
        matches: "app/controller/**/*.js",
        related: function (data) {
          // 创建关联 HTML：cmd+k cmd+s
          if (data.filePath.indexOf("/api/") > -1) return null;
          const viewPath = data.relativeFilePath.replace("controller", "view");
          return {
            relativePath:
              viewPath.substr(0, viewPath.lastIndexOf(".")) + ".html",
          };
        },
      },
      {
        name: "template/mapper.xml.njk",
        matches: "mapper/**/*.xml",
      },
      {
        name: "template/middleware.js.dtpl",
        matches: "app/middleware/**/*.js",
      },
      {
        name: "template/queue.js.dtpl",
        matches: "app/queue/**/*.js",
      },
      {
        name: "template/schedule.js.dtpl",
        matches: "app/schedule/**/*.js",
      },
      {
        name: "template/service.js.dtpl",
        matches: "app/service/**/*.js",
      },
      {
        name: "template/view.html.njk",
        matches: "app/view/**/*.html",
      },
    ],
    globalData: {
      projectName: "ruoyi-eggjs",
    },
  };
};
