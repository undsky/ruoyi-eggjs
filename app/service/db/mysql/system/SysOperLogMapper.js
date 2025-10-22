const Service = require('egg').Service;

class ComRuoyiSystemMapperService extends Service {
    mapper(sqlid, values, params) {
        return this.app.mapper('com.ruoyi.system.mapper.SysOperLogMapper', sqlid, values, params)
    }

    db() {
        return this.app.mysql.get('system');
    }

    sysOperLogResultMapper(values, params) {
        return this.mapper('SysOperLogResult', values, params);
    }

    async sysOperLogResult(values, params) {
        return await this.db().resultMap(this.sysOperLogResultMapper(values, params));
    }

    selectOperLogVoMapper(values, params) {
        return this.mapper('selectOperLogVo', values, params);
    }

    async selectOperLogVo(values, params) {
        return await this.db().run(this.selectOperLogVoMapper(values, params));
    }

    insertOperlogMapper(values, params) {
        return this.mapper('insertOperlog', values, params);
    }

    async insertOperlog(values, params) {
        return await this.db().insert(this.insertOperlogMapper(values, params));
    }

    selectOperLogListMapper(values, params) {
        return this.mapper('selectOperLogList', values, params);
    }

    async selectOperLogList(values, params) {
        return await this.db().select(this.selectOperLogListMapper(values, params));
    }

    deleteOperLogByIdsMapper(values, params) {
        return this.mapper('deleteOperLogByIds', values, params);
    }

    async deleteOperLogByIds(values, params) {
        return await this.db().del(this.deleteOperLogByIdsMapper(values, params));
    }

    selectOperLogByIdMapper(values, params) {
        return this.mapper('selectOperLogById', values, params);
    }

    async selectOperLogById(values, params) {
        return await this.db().select(this.selectOperLogByIdMapper(values, params));
    }

    cleanOperLogMapper(values, params) {
        return this.mapper('cleanOperLog', values, params);
    }

    async cleanOperLog(values, params) {
        return await this.db().update(this.cleanOperLogMapper(values, params));
    }
}

module.exports = ComRuoyiSystemMapperService;