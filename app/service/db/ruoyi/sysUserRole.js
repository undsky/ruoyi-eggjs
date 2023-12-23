const Service = require('egg').Service;

class SysUserRoleService extends Service {
    mapper(sqlid, values, params) {
        return this.app.mapper('mapper/ruoyi/sysUserRole.xml', sqlid, values, params)
    }

    db() {
        return this.app.mysql.get('ruoyi');
    }

    sysUserRoleResultMapper(values, params) {
        return this.mapper('SysUserRoleResult', values, params);
    }

    async sysUserRoleResult(values, params) {
        return await this.db().resultMap(this.sysUserRoleResultMapper(values, params));
    }

    deleteUserRoleByUserIdMapper(values, params) {
        return this.mapper('deleteUserRoleByUserId', values, params);
    }

    async deleteUserRoleByUserId(values, params) {
        return await this.db().del(this.deleteUserRoleByUserIdMapper(values, params));
    }

    countUserRoleByRoleIdMapper(values, params) {
        return this.mapper('countUserRoleByRoleId', values, params);
    }

    async countUserRoleByRoleId(values, params) {
        return await this.db().select(this.countUserRoleByRoleIdMapper(values, params));
    }

    deleteUserRoleMapper(values, params) {
        return this.mapper('deleteUserRole', values, params);
    }

    async deleteUserRole(values, params) {
        return await this.db().del(this.deleteUserRoleMapper(values, params));
    }

    batchUserRoleMapper(values, params) {
        return this.mapper('batchUserRole', values, params);
    }

    async batchUserRole(values, params) {
        return await this.db().insert(this.batchUserRoleMapper(values, params));
    }

    deleteUserRoleInfoMapper(values, params) {
        return this.mapper('deleteUserRoleInfo', values, params);
    }

    async deleteUserRoleInfo(values, params) {
        return await this.db().del(this.deleteUserRoleInfoMapper(values, params));
    }

    deleteUserRoleInfosMapper(values, params) {
        return this.mapper('deleteUserRoleInfos', values, params);
    }

    async deleteUserRoleInfos(values, params) {
        return await this.db().del(this.deleteUserRoleInfosMapper(values, params));
    }
}

module.exports = SysUserRoleService;