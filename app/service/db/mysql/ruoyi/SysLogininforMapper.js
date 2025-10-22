const Service = require('egg').Service;

class SysLogininforMapperService extends Service {
    mapper(sqlid, values, params) {
        return this.app.mapper('mapper/mysql/ruoyi/SysLogininforMapper.xml', sqlid, values, params)
    }

    db() {
        return this.app.mysql.get('ruoyi');
    }

    sysLogininforResultMapper(values, params) {
        return this.mapper('SysLogininforResult', values, params);
    }

    async sysLogininforResult(values, params) {
        return await this.db().resultMap(this.sysLogininforResultMapper(values, params));
    }

    insertLogininforMapper(values, params) {
        return this.mapper('insertLogininfor', values, params);
    }

    async insertLogininfor(values, params) {
        return await this.db().insert(this.insertLogininforMapper(values, params));
    }

    selectLogininforListMapper(values, params) {
        return this.mapper('selectLogininforList', values, params);
    }

    async selectLogininforList(values, params) {
        return await this.db().select(this.selectLogininforListMapper(values, params));
    }

    deleteLogininforByIdsMapper(values, params) {
        return this.mapper('deleteLogininforByIds', values, params);
    }

    async deleteLogininforByIds(values, params) {
        return await this.db().del(this.deleteLogininforByIdsMapper(values, params));
    }

    cleanLogininforMapper(values, params) {
        return this.mapper('cleanLogininfor', values, params);
    }

    async cleanLogininfor(values, params) {
        return await this.db().update(this.cleanLogininforMapper(values, params));
    }
}

module.exports = SysLogininforMapperService;