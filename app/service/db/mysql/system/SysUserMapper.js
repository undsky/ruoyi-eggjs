const Service = require('egg').Service;

class ComRuoyiSystemMapperService extends Service {
    mapper(sqlid, values, params) {
        return this.app.mapper('com.ruoyi.system.mapper.SysUserMapper', sqlid, values, params)
    }

    db() {
        return this.app.mysql.get('system');
    }

    sysUserResultMapper(values, params) {
        return this.mapper('SysUserResult', values, params);
    }

    async sysUserResult(values, params) {
        return await this.db().resultMap(this.sysUserResultMapper(values, params));
    }

    deptResultMapper(values, params) {
        return this.mapper('deptResult', values, params);
    }

    async deptResult(values, params) {
        return await this.db().resultMap(this.deptResultMapper(values, params));
    }

    roleResultMapper(values, params) {
        return this.mapper('RoleResult', values, params);
    }

    async roleResult(values, params) {
        return await this.db().resultMap(this.roleResultMapper(values, params));
    }

    selectUserVoMapper(values, params) {
        return this.mapper('selectUserVo', values, params);
    }

    async selectUserVo(values, params) {
        return await this.db().run(this.selectUserVoMapper(values, params));
    }

    selectUserListMapper(values, params) {
        return this.mapper('selectUserList', values, params);
    }

    async selectUserList(values, params) {
        return await this.db().select(this.selectUserListMapper(values, params));
    }

    selectAllocatedListMapper(values, params) {
        return this.mapper('selectAllocatedList', values, params);
    }

    async selectAllocatedList(values, params) {
        return await this.db().select(this.selectAllocatedListMapper(values, params));
    }

    selectUnallocatedListMapper(values, params) {
        return this.mapper('selectUnallocatedList', values, params);
    }

    async selectUnallocatedList(values, params) {
        return await this.db().select(this.selectUnallocatedListMapper(values, params));
    }

    selectUserByUserNameMapper(values, params) {
        return this.mapper('selectUserByUserName', values, params);
    }

    async selectUserByUserName(values, params) {
        return await this.db().select(this.selectUserByUserNameMapper(values, params));
    }

    selectUserByIdMapper(values, params) {
        return this.mapper('selectUserById', values, params);
    }

    async selectUserById(values, params) {
        return await this.db().select(this.selectUserByIdMapper(values, params));
    }

    checkUserNameUniqueMapper(values, params) {
        return this.mapper('checkUserNameUnique', values, params);
    }

    async checkUserNameUnique(values, params) {
        return await this.db().select(this.checkUserNameUniqueMapper(values, params));
    }

    checkPhoneUniqueMapper(values, params) {
        return this.mapper('checkPhoneUnique', values, params);
    }

    async checkPhoneUnique(values, params) {
        return await this.db().select(this.checkPhoneUniqueMapper(values, params));
    }

    checkEmailUniqueMapper(values, params) {
        return this.mapper('checkEmailUnique', values, params);
    }

    async checkEmailUnique(values, params) {
        return await this.db().select(this.checkEmailUniqueMapper(values, params));
    }

    insertUserMapper(values, params) {
        return this.mapper('insertUser', values, params);
    }

    async insertUser(values, params) {
        return await this.db().insert(this.insertUserMapper(values, params));
    }

    updateUserMapper(values, params) {
        return this.mapper('updateUser', values, params);
    }

    async updateUser(values, params) {
        return await this.db().update(this.updateUserMapper(values, params));
    }

    updateUserStatusMapper(values, params) {
        return this.mapper('updateUserStatus', values, params);
    }

    async updateUserStatus(values, params) {
        return await this.db().update(this.updateUserStatusMapper(values, params));
    }

    updateUserAvatarMapper(values, params) {
        return this.mapper('updateUserAvatar', values, params);
    }

    async updateUserAvatar(values, params) {
        return await this.db().update(this.updateUserAvatarMapper(values, params));
    }

    updateLoginInfoMapper(values, params) {
        return this.mapper('updateLoginInfo', values, params);
    }

    async updateLoginInfo(values, params) {
        return await this.db().update(this.updateLoginInfoMapper(values, params));
    }

    resetUserPwdMapper(values, params) {
        return this.mapper('resetUserPwd', values, params);
    }

    async resetUserPwd(values, params) {
        return await this.db().update(this.resetUserPwdMapper(values, params));
    }

    deleteUserByIdMapper(values, params) {
        return this.mapper('deleteUserById', values, params);
    }

    async deleteUserById(values, params) {
        return await this.db().del(this.deleteUserByIdMapper(values, params));
    }

    deleteUserByIdsMapper(values, params) {
        return this.mapper('deleteUserByIds', values, params);
    }

    async deleteUserByIds(values, params) {
        return await this.db().del(this.deleteUserByIdsMapper(values, params));
    }
}

module.exports = ComRuoyiSystemMapperService;