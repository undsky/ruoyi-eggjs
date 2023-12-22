const Service = require('egg').Service;

class SysRoleService extends Service {
    mapper(sqlid, values, params) {
        return this.app.mapper('mapper\common\sysRole.xml', sqlid, values, params)
    }

    db() {
        return this.app.mysql.get('common');
    }
}

module.exports = SysRoleService;