const Service = require('egg').Service;

class SysJobLogMapperService extends Service {
    mapper(sqlid, values, params) {
        return this.app.mapper('mapper/mysql/ruoyi/SysJobLogMapper.xml', sqlid, values, params)
    }

    db() {
        return this.app.mysql.get('ruoyi');
    }

    selectJobLogListMapper(values, params) {
        return this.mapper('selectJobLogList', values, params);
    }

    async selectJobLogList(values, params) {
        return await this.db().select(this.selectJobLogListMapper(values, params));
    }

    countJobLogListMapper(values, params) {
        return this.mapper('countJobLogList', values, params);
    }

    async countJobLogList(values, params) {
        return await this.db().select(this.countJobLogListMapper(values, params));
    }

    selectJobLogByIdMapper(values, params) {
        return this.mapper('selectJobLogById', values, params);
    }

    async selectJobLogById(values, params) {
        return await this.db().select(this.selectJobLogByIdMapper(values, params));
    }

    insertJobLogMapper(values, params) {
        return this.mapper('insertJobLog', values, params);
    }

    async insertJobLog(values, params) {
        return await this.db().insert(this.insertJobLogMapper(values, params));
    }

    deleteJobLogByIdsMapper(values, params) {
        return this.mapper('deleteJobLogByIds', values, params);
    }

    async deleteJobLogByIds(values, params) {
        return await this.db().del(this.deleteJobLogByIdsMapper(values, params));
    }

    cleanJobLogMapper(values, params) {
        return this.mapper('cleanJobLog', values, params);
    }

    async cleanJobLog(values, params) {
        return await this.db().del(this.cleanJobLogMapper(values, params));
    }
}

module.exports = SysJobLogMapperService;