const Service = require('egg').Service;

class SysRoleMenuService extends Service {
    mapper(sqlid, values, params) {
        return this.app.mapper('mapper/ruoyi/sysRoleMenu.xml', sqlid, values, params)
    }

    db() {
        return this.app.mysql.get('ruoyi');
    }

    sysRoleMenuResultMapper(values, params) {
        return this.mapper('SysRoleMenuResult', values, params);
    }

    async sysRoleMenuResult(values, params) {
        return await this.db().resultMap(this.sysRoleMenuResultMapper(values, params));
    }

    checkMenuExistRoleMapper(values, params) {
        return this.mapper('checkMenuExistRole', values, params);
    }

    async checkMenuExistRole(values, params) {
        return await this.db().select(this.checkMenuExistRoleMapper(values, params));
    }

    deleteRoleMenuByRoleIdMapper(values, params) {
        return this.mapper('deleteRoleMenuByRoleId', values, params);
    }

    async deleteRoleMenuByRoleId(values, params) {
        return await this.db().del(this.deleteRoleMenuByRoleIdMapper(values, params));
    }

    deleteRoleMenuMapper(values, params) {
        return this.mapper('deleteRoleMenu', values, params);
    }

    async deleteRoleMenu(values, params) {
        return await this.db().del(this.deleteRoleMenuMapper(values, params));
    }

    batchRoleMenuMapper(values, params) {
        return this.mapper('batchRoleMenu', values, params);
    }

    async batchRoleMenu(values, params) {
        return await this.db().insert(this.batchRoleMenuMapper(values, params));
    }
}

module.exports = SysRoleMenuService;