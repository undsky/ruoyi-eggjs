const Service = require('egg').Service;

class SysUserService extends Service {
    mapper(sqlid, values, params) {
        return this.app.mapper('mapper\common\sysUser.xml', sqlid, values, params)
    }

    db() {
        return this.app.mysql.get('common');
    }
}

module.exports = SysUserService;