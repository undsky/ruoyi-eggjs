/*
 * @Author: 姜彦汐
 * @Date: 2021-04-22 15:39:34
 * @LastEditors: 姜彦汐
 * @LastEditTime: 2021-07-13 14:13:16
 * @Description: 
 * @Site: https://www.undsky.com
 * @FilePath: /mc-egg-admin/.dtpl/dtpl.js
 */
module.exports = function (source) {
    return {
        templates: [{
            name: 'template/plugin',
            matches: 'lib/plugin/*'
        }, {
            name: 'template/controller.js.njk',
            matches: 'app/controller/**/*.js',
            related: function (data) { // 创建关联 HTML：cmd+k cmd+s
                if (data.filePath.indexOf('/api/') > -1) return null
                const viewPath = data.relativeFilePath.replace('controller', 'view')
                return {
                    relativePath: viewPath.substr(0, viewPath.lastIndexOf('.')) + '.html'
                };
            }
        }, {
            name: 'template/mapper.xml.dtpl',
            matches: 'mapper/**/*.xml'
        }, {
            name: 'template/middleware.js.dtpl',
            matches: 'app/middleware/**/*.js'
        }, {
            name: 'template/queue.js.dtpl',
            matches: 'app/queue/**/*.js'
        }, {
            name: 'template/schedule.js.dtpl',
            matches: 'app/schedule/**/*.js'
        }, {
            name: 'template/service.js.dtpl',
            matches: 'app/service/**/*.js'
        }, {
            name: 'template/view.html.njk',
            matches: 'app/view/**/*.html'
        }],
        globalData: {
            projectName: 'mc-egg-admin'
        }
    };
}