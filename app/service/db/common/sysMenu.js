const Service = require('egg').Service;

class SysMenuService extends Service {
    mapper(sqlid, values, params) {
        return this.app.mapper('mapper\common\sysMenu.xml', sqlid, values, params)
    }

    db() {
        return this.app.mysql.get('common');
    }
}

module.exports = SysMenuService;