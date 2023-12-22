const Service = require('egg').Service;

class SysUserRoleService extends Service {
    mapper(sqlid, values, params) {
        return this.app.mapper('mapper\common\sysUserRole.xml', sqlid, values, params)
    }

    db() {
        return this.app.mysql.get('common');
    }
}

module.exports = SysUserRoleService;