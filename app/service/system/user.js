/*
 * @Description: 用户服务层
 * @Author: AI Assistant
 * @Date: 2025-10-23
 */

const Service = require('egg').Service;

class UserService extends Service {

  /**
   * 查询用户列表（分页）
   * @param {object} params - 查询参数
   * @return {object} 用户列表和总数
   */
  async selectUserList(params = {}) {
    const { ctx } = this;
    
    // 查询条件
    const conditions = {
      userId: params.userId,
      userName: params.userName,
      phonenumber: params.phonenumber,
      status: params.status,
      deptId: params.deptId,
      params: {
        beginTime: params.beginTime,
        endTime: params.endTime,
        dataScope: '' // TODO: 实现数据权限过滤
      }
    };

    // 查询列表
    const users = await ctx.service.db.mysql.ruoyi.sysUserMapper.selectUserList([conditions]);
    
    return users || [];
  }

  /**
   * 根据用户ID查询用户
   * @param {number} userId - 用户ID
   * @return {object} 用户信息
   */
  async selectUserById(userId) {
    const { ctx } = this;
    
    const users = await ctx.service.db.mysql.ruoyi.sysUserMapper.selectUserById([userId]);
    
    return users && users.length > 0 ? users[0] : null;
  }

  /**
   * 根据用户名查询用户
   * @param {string} userName - 用户名
   * @return {object} 用户信息
   */
  async selectUserByUserName(userName) {
    const { ctx } = this;
    
    const users = await ctx.service.db.mysql.ruoyi.sysUserMapper.selectUserByUserName([userName]);
    
    return users && users.length > 0 ? users[0] : null;
  }

  /**
   * 校验用户名是否唯一
   * @param {object} user - 用户对象
   * @return {boolean} true-唯一 false-不唯一
   */
  async checkUserNameUnique(user) {
    const { ctx } = this;
    
    const userId = user.userId || -1;
    const users = await ctx.service.db.mysql.ruoyi.sysUserMapper.checkUserNameUnique([user.userName]);
    
    if (users && users.length > 0 && users[0].user_id !== userId) {
      return false;
    }
    
    return true;
  }

  /**
   * 校验手机号是否唯一
   * @param {object} user - 用户对象
   * @return {boolean} true-唯一 false-不唯一
   */
  async checkPhoneUnique(user) {
    const { ctx } = this;
    
    const userId = user.userId || -1;
    const users = await ctx.service.db.mysql.ruoyi.sysUserMapper.checkPhoneUnique([user.phonenumber]);
    
    if (users && users.length > 0 && users[0].user_id !== userId) {
      return false;
    }
    
    return true;
  }

  /**
   * 校验邮箱是否唯一
   * @param {object} user - 用户对象
   * @return {boolean} true-唯一 false-不唯一
   */
  async checkEmailUnique(user) {
    const { ctx } = this;
    
    const userId = user.userId || -1;
    const users = await ctx.service.db.mysql.ruoyi.sysUserMapper.checkEmailUnique([user.email]);
    
    if (users && users.length > 0 && users[0].user_id !== userId) {
      return false;
    }
    
    return true;
  }

  /**
   * 校验用户是否允许操作
   * @param {object} user - 用户对象
   */
  checkUserAllowed(user) {
    const { ctx } = this;
    
    if (user.userId && ctx.helper.isAdmin(user.userId)) {
      throw new Error('不允许操作超级管理员用户');
    }
  }

  /**
   * 校验用户是否有数据权限
   * @param {number} userId - 用户ID
   */
  async checkUserDataScope(userId) {
    const { ctx } = this;
    
    // 管理员拥有所有数据权限
    if (ctx.helper.isAdmin(ctx.state.user.userId)) {
      return;
    }
    
    // TODO: 实现数据权限校验
  }

  /**
   * 新增用户
   * @param {object} user - 用户对象
   * @return {number} 影响行数
   */
  async insertUser(user) {
    const { ctx } = this;
    
    // 设置创建信息
    user.createBy = ctx.state.user.userName;
    
    // 插入用户
    const result = await ctx.service.db.mysql.ruoyi.sysUserMapper.insertUser([user]);
    
    if (result && result.length > 0) {
      const userId = result[0].userId;
      
      // 插入用户与岗位关联
      if (user.postIds && user.postIds.length > 0) {
        await this.insertUserPost(userId, user.postIds);
      }
      
      // 插入用户与角色关联
      if (user.roleIds && user.roleIds.length > 0) {
        await this.insertUserRole(userId, user.roleIds);
      }
      
      return 1;
    }
    
    return 0;
  }

  /**
   * 修改用户
   * @param {object} user - 用户对象
   * @return {number} 影响行数
   */
  async updateUser(user) {
    const { ctx } = this;
    
    // 设置更新信息
    user.updateBy = ctx.state.user.userName;
    
    // 删除用户与角色关联
    await ctx.service.db.mysql.ruoyi.sysUserRoleMapper.deleteUserRoleByUserId([user.userId]);
    
    // 插入用户与角色关联
    if (user.roleIds && user.roleIds.length > 0) {
      await this.insertUserRole(user.userId, user.roleIds);
    }
    
    // 删除用户与岗位关联
    await ctx.service.db.mysql.ruoyi.sysUserPostMapper.deleteUserPostByUserId([user.userId]);
    
    // 插入用户与岗位关联
    if (user.postIds && user.postIds.length > 0) {
      await this.insertUserPost(user.userId, user.postIds);
    }
    
    // 更新用户
    const result = await ctx.service.db.mysql.ruoyi.sysUserMapper.updateUser([user]);
    
    return result && result.length > 0 ? 1 : 0;
  }

  /**
   * 修改用户状态
   * @param {object} user - 用户对象
   * @return {number} 影响行数
   */
  async updateUserStatus(user) {
    const { ctx } = this;
    
    const result = await ctx.service.db.mysql.ruoyi.sysUserMapper.updateUserStatus([user]);
    
    return result && result.length > 0 ? 1 : 0;
  }

  /**
   * 重置用户密码
   * @param {object} user - 用户对象
   * @return {number} 影响行数
   */
  async resetPwd(user) {
    const { ctx } = this;
    
    const result = await ctx.service.db.mysql.ruoyi.sysUserMapper.resetUserPwd([user]);
    
    return result && result.length > 0 ? 1 : 0;
  }

  /**
   * 删除用户
   * @param {array} userIds - 用户ID数组
   * @return {number} 影响行数
   */
  async deleteUserByIds(userIds) {
    const { ctx } = this;
    
    // 删除用户与角色关联
    await ctx.service.db.mysql.ruoyi.sysUserRoleMapper.deleteUserRole([userIds]);
    
    // 删除用户与岗位关联
    await ctx.service.db.mysql.ruoyi.sysUserPostMapper.deleteUserPost([userIds]);
    
    // 删除用户
    const result = await ctx.service.db.mysql.ruoyi.sysUserMapper.deleteUserByIds([userIds]);
    
    return result && result.length > 0 ? userIds.length : 0;
  }

  /**
   * 用户授权角色
   * @param {number} userId - 用户ID
   * @param {array} roleIds - 角色ID数组
   */
  async insertUserAuth(userId, roleIds) {
    const { ctx } = this;
    
    // 删除用户与角色关联
    await ctx.service.db.mysql.ruoyi.sysUserRoleMapper.deleteUserRoleByUserId([userId]);
    
    // 插入用户与角色关联
    await this.insertUserRole(userId, roleIds);
  }

  /**
   * 插入用户与角色关联
   * @param {number} userId - 用户ID
   * @param {array} roleIds - 角色ID数组
   */
  async insertUserRole(userId, roleIds) {
    const { ctx } = this;
    
    if (!roleIds || roleIds.length === 0) {
      return;
    }
    
    const userRoles = roleIds.map(roleId => ({
      userId,
      roleId
    }));
    
    await ctx.service.db.mysql.ruoyi.sysUserRoleMapper.batchUserRole([userRoles]);
  }

  /**
   * 插入用户与岗位关联
   * @param {number} userId - 用户ID
   * @param {array} postIds - 岗位ID数组
   */
  async insertUserPost(userId, postIds) {
    const { ctx } = this;
    
    if (!postIds || postIds.length === 0) {
      return;
    }
    
    const userPosts = postIds.map(postId => ({
      userId,
      postId
    }));
    
    await ctx.service.db.mysql.ruoyi.sysUserPostMapper.batchUserPost([userPosts]);
  }

  /**
   * 导入用户数据
   * @param {array} userList - 用户列表
   * @param {boolean} updateSupport - 是否更新已存在的用户
   * @param {string} operName - 操作人
   * @return {string} 导入结果信息
   */
  async importUser(userList, updateSupport = false, operName) {
    const { ctx } = this;
    
    if (!userList || userList.length === 0) {
      throw new Error('导入用户数据不能为空');
    }
    
    let successNum = 0;
    let failureNum = 0;
    const failureMsg = [];
    
    for (const user of userList) {
      try {
        // 校验用户名是否存在
        const existUser = await this.selectUserByUserName(user.userName);
        
        if (!existUser) {
          // 新增用户
          user.password = await ctx.helper.security.encryptPassword(user.password || '123456');
          user.createBy = operName;
          await this.insertUser(user);
          successNum++;
        } else if (updateSupport) {
          // 更新用户
          user.userId = existUser.userId;
          user.updateBy = operName;
          await this.updateUser(user);
          successNum++;
        } else {
          failureNum++;
          failureMsg.push(`用户 ${user.userName} 已存在`);
        }
      } catch (err) {
        failureNum++;
        failureMsg.push(`用户 ${user.userName} 导入失败：${err.message}`);
      }
    }
    
    if (failureNum > 0) {
      return `导入成功 ${successNum} 条，失败 ${failureNum} 条。${failureMsg.join('; ')}`;
    }
    
    return `导入成功 ${successNum} 条`;
  }
}

module.exports = UserService;

