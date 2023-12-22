const Service = require('egg').Service;

class SysRoleMenuService extends Service {
    mapper(sqlid, values, params) {
        return this.app.mapper('mapper\common\sysRoleMenu.xml', sqlid, values, params)
    }

    db() {
        return this.app.mysql.get('common');
    }
}

module.exports = SysRoleMenuService;