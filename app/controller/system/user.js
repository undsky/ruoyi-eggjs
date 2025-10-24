/*
 * @Description: 用户管理控制器
 * @Author: AI Assistant
 * @Date: 2025-10-24
 */

const Controller = require('egg').Controller;
const { Route, HttpGet, HttpPost, HttpPut, HttpDelete } = require('egg-decorator-router');

module.exports = app => {

  @Route('/api/system/user')
  class UserController extends Controller {

    /**
     * 获取用户列表（分页）
     * GET /api/system/user/list
     */
    @HttpGet('/list')
    async list() {
      const { ctx, service } = this;
      
      try {
        const params = ctx.query;
        
        // 分页参数
        const pageNum = parseInt(params.pageNum) || 1;
        const pageSize = parseInt(params.pageSize) || 10;
        
        // 查询用户列表
        const list = await service.system.user.selectUserList(params);
        
        // 手动分页
        const total = list.length;
        const start = (pageNum - 1) * pageSize;
        const rows = list.slice(start, start + pageSize);
        
        ctx.body = {
          code: 200,
          msg: '查询成功',
          rows,
          total
        };
      } catch (err) {
        ctx.logger.error('查询用户列表失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '查询用户列表失败'
        };
      }
    }

    /**
     * 获取用户详情
     * GET /api/system/user/:userId
     */
    @HttpGet('/:userId')
    async getInfo() {
      const { ctx, service } = this;
      
      try {
        const { userId } = ctx.params;
        
        if (!userId) {
          // 获取新增用户时需要的数据
          const roles = await service.system.role.selectRoleAll();
          const posts = await service.system.post.selectPostAll();
          
          ctx.body = {
            code: 200,
            msg: '操作成功',
            data: null,
            roles,
            posts
          };
          return;
        }
        
        // 校验数据权限
        await service.system.user.checkUserDataScope(parseInt(userId));
        
        // 查询用户信息
        const user = await service.system.user.selectUserById(parseInt(userId));
        
        if (!user) {
          ctx.body = {
            code: 500,
            msg: '用户不存在'
          };
          return;
        }
        
        // 查询用户的岗位ID列表
        const postIds = await service.system.post.selectPostListByUserId(parseInt(userId));
        
        // 查询用户的角色ID列表
        const userRoles = user.roles || [];
        const roleIds = userRoles.map(r => r.roleId);
        
        // 查询所有角色和岗位
        const roles = await service.system.role.selectRoleAll();
        const posts = await service.system.post.selectPostAll();
        
        // 过滤掉管理员角色（非管理员用户不能分配管理员角色）
        const isAdmin = ctx.helper.isAdmin(parseInt(userId));
        const filteredRoles = isAdmin ? roles : roles.filter(r => !ctx.helper.isAdmin(r.roleId));
        
        ctx.body = {
          code: 200,
          msg: '操作成功',
          data: user,
          postIds,
          roleIds,
          roles: filteredRoles,
          posts
        };
      } catch (err) {
        ctx.logger.error('查询用户详情失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '查询用户详情失败'
        };
      }
    }

    /**
     * 新增用户
     * POST /api/system/user
     */
    @HttpPost('/')
    async add() {
      const { ctx, service } = this;
      
      try {
        const user = ctx.request.body;
        
        // 校验部门数据权限
        await service.system.dept.checkDeptDataScope(user.deptId);
        
        // 校验用户名是否唯一
        const isUserNameUnique = await service.system.user.checkUserNameUnique(user);
        if (!isUserNameUnique) {
          ctx.body = {
            code: 500,
            msg: `新增用户'${user.userName}'失败，登录账号已存在`
          };
          return;
        }
        
        // 校验手机号是否唯一
        if (user.phonenumber) {
          const isPhoneUnique = await service.system.user.checkPhoneUnique(user);
          if (!isPhoneUnique) {
            ctx.body = {
              code: 500,
              msg: `新增用户'${user.userName}'失败，手机号码已存在`
            };
            return;
          }
        }
        
        // 校验邮箱是否唯一
        if (user.email) {
          const isEmailUnique = await service.system.user.checkEmailUnique(user);
          if (!isEmailUnique) {
            ctx.body = {
              code: 500,
              msg: `新增用户'${user.userName}'失败，邮箱账号已存在`
            };
            return;
          }
        }
        
        // 加密密码
        user.password = await ctx.helper.security.encryptPassword(user.password);
        
        // 新增用户
        const rows = await service.system.user.insertUser(user);
        
        ctx.body = {
          code: 200,
          msg: rows > 0 ? '新增成功' : '新增失败'
        };
      } catch (err) {
        ctx.logger.error('新增用户失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '新增用户失败'
        };
      }
    }

    /**
     * 修改用户
     * PUT /api/system/user
     */
    @HttpPut('/')
    async edit() {
      const { ctx, service } = this;
      
      try {
        const user = ctx.request.body;
        
        // 校验用户是否允许操作
        service.system.user.checkUserAllowed(user);
        
        // 校验数据权限
        await service.system.user.checkUserDataScope(user.userId);
        
        // 校验部门数据权限
        await service.system.dept.checkDeptDataScope(user.deptId);
        
        // 校验用户名是否唯一
        const isUserNameUnique = await service.system.user.checkUserNameUnique(user);
        if (!isUserNameUnique) {
          ctx.body = {
            code: 500,
            msg: `修改用户'${user.userName}'失败，登录账号已存在`
          };
          return;
        }
        
        // 校验手机号是否唯一
        if (user.phonenumber) {
          const isPhoneUnique = await service.system.user.checkPhoneUnique(user);
          if (!isPhoneUnique) {
            ctx.body = {
              code: 500,
              msg: `修改用户'${user.userName}'失败，手机号码已存在`
            };
            return;
          }
        }
        
        // 校验邮箱是否唯一
        if (user.email) {
          const isEmailUnique = await service.system.user.checkEmailUnique(user);
          if (!isEmailUnique) {
            ctx.body = {
              code: 500,
              msg: `修改用户'${user.userName}'失败，邮箱账号已存在`
            };
            return;
          }
        }
        
        // 修改用户
        const rows = await service.system.user.updateUser(user);
        
        ctx.body = {
          code: 200,
          msg: rows > 0 ? '修改成功' : '修改失败'
        };
      } catch (err) {
        ctx.logger.error('修改用户失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '修改用户失败'
        };
      }
    }

    /**
     * 删除用户
     * DELETE /api/system/user/:userIds
     */
    @HttpDelete('/:userIds')
    async remove() {
      const { ctx, service } = this;
      
      try {
        const { userIds } = ctx.params;
        
        // 解析用户ID数组
        const userIdArray = userIds.split(',').map(id => parseInt(id));
        
        // 检查是否包含当前用户
        if (userIdArray.includes(ctx.state.user.userId)) {
          ctx.body = {
            code: 500,
            msg: '当前用户不能删除'
          };
          return;
        }
        
        // 删除用户
        const rows = await service.system.user.deleteUserByIds(userIdArray);
        
        ctx.body = {
          code: 200,
          msg: rows > 0 ? '删除成功' : '删除失败'
        };
      } catch (err) {
        ctx.logger.error('删除用户失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '删除用户失败'
        };
      }
    }

    /**
     * 重置密码
     * PUT /api/system/user/resetPwd
     */
    @HttpPut('/resetPwd')
    async resetPwd() {
      const { ctx, service } = this;
      
      try {
        const user = ctx.request.body;
        
        // 校验用户是否允许操作
        service.system.user.checkUserAllowed(user);
        
        // 校验数据权限
        await service.system.user.checkUserDataScope(user.userId);
        
        // 加密密码
        user.password = await ctx.helper.security.encryptPassword(user.password);
        
        // 重置密码
        const rows = await service.system.user.resetPwd(user);
        
        ctx.body = {
          code: 200,
          msg: rows > 0 ? '重置成功' : '重置失败'
        };
      } catch (err) {
        ctx.logger.error('重置密码失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '重置密码失败'
        };
      }
    }

    /**
     * 修改状态
     * PUT /api/system/user/changeStatus
     */
    @HttpPut('/changeStatus')
    async changeStatus() {
      const { ctx, service } = this;
      
      try {
        const user = ctx.request.body;
        
        // 校验用户是否允许操作
        service.system.user.checkUserAllowed(user);
        
        // 校验数据权限
        await service.system.user.checkUserDataScope(user.userId);
        
        // 修改状态
        const rows = await service.system.user.updateUserStatus(user);
        
        ctx.body = {
          code: 200,
          msg: rows > 0 ? '修改成功' : '修改失败'
        };
      } catch (err) {
        ctx.logger.error('修改用户状态失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '修改用户状态失败'
        };
      }
    }

    /**
     * 查询授权角色
     * GET /api/system/user/authRole/:userId
     */
    @HttpGet('/authRole/:userId')
    async authRole() {
      const { ctx, service } = this;
      
      try {
        const { userId } = ctx.params;
        
        // 查询用户信息
        const user = await service.system.user.selectUserById(parseInt(userId));
        
        if (!user) {
          ctx.body = {
            code: 500,
            msg: '用户不存在'
          };
          return;
        }
        
        // 查询用户角色
        const roles = await service.system.role.selectRolesByUserId(parseInt(userId));
        
        // 过滤掉管理员角色（非管理员用户不能分配管理员角色）
        const isAdmin = ctx.helper.isAdmin(parseInt(userId));
        const filteredRoles = isAdmin ? roles : roles.filter(r => !ctx.helper.isAdmin(r.roleId));
        
        ctx.body = {
          code: 200,
          msg: '操作成功',
          user,
          roles: filteredRoles
        };
      } catch (err) {
        ctx.logger.error('查询授权角色失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '查询授权角色失败'
        };
      }
    }

    /**
     * 用户授权
     * PUT /api/system/user/authRole
     */
    @HttpPut('/authRole')
    async insertAuthRole() {
      const { ctx, service } = this;
      
      try {
        const { userId, roleIds } = ctx.request.body;
        
        // 校验数据权限
        await service.system.user.checkUserDataScope(userId);
        
        // 解析角色ID数组
        const roleIdArray = typeof roleIds === 'string' 
          ? roleIds.split(',').map(id => parseInt(id))
          : roleIds;
        
        // 用户授权
        await service.system.user.insertUserAuth(userId, roleIdArray);
        
        ctx.body = {
          code: 200,
          msg: '授权成功'
        };
      } catch (err) {
        ctx.logger.error('用户授权失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '用户授权失败'
        };
      }
    }

    /**
     * 获取部门树选择
     * GET /api/system/user/deptTree
     */
    @HttpGet('/deptTree')
    async deptTree() {
      const { ctx, service } = this;
      
      try {
        const params = ctx.query;
        
        // 查询部门树
        const deptTree = await service.system.dept.selectDeptTreeList(params);
        
        ctx.body = {
          code: 200,
          msg: '操作成功',
          data: deptTree
        };
      } catch (err) {
        ctx.logger.error('查询部门树失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '查询部门树失败'
        };
      }
    }

    /**
     * 导出用户
     * POST /api/system/user/export
     */
    @HttpPost('/export')
    async export() {
      const { ctx, service } = this;
      
      try {
        const params = ctx.request.body;
        
        // 查询用户列表
        const list = await service.system.user.selectUserList(params);
        
        // TODO: 实现 Excel 导出功能
        // 目前返回 JSON 数据
        ctx.body = {
          code: 200,
          msg: '导出成功',
          data: list
        };
      } catch (err) {
        ctx.logger.error('导出用户失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '导出用户失败'
        };
      }
    }

    /**
     * 导入用户
     * POST /api/system/user/import
     */
    @HttpPost('/import')
    async importData() {
      const { ctx, service } = this;
      
      try {
        const { updateSupport } = ctx.request.body;
        
        // TODO: 实现 Excel 导入功能
        // 目前返回示例数据
        const userList = []; // 解析 Excel 文件得到的用户列表
        
        const operName = ctx.state.user.userName;
        const message = await service.system.user.importUser(userList, updateSupport === 'true', operName);
        
        ctx.body = {
          code: 200,
          msg: message
        };
      } catch (err) {
        ctx.logger.error('导入用户失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '导入用户失败'
        };
      }
    }

    /**
     * 下载导入模板
     * POST /api/system/user/importTemplate
     */
    @HttpPost('/importTemplate')
    async importTemplate() {
      const { ctx } = this;
      
      try {
        // TODO: 实现模板下载功能
        ctx.body = {
          code: 200,
          msg: '下载成功'
        };
      } catch (err) {
        ctx.logger.error('下载模板失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '下载模板失败'
        };
      }
    }
  }

  return UserController;
};

