/*
 * @Description: 角色管理控制器
 * @Author: AI Assistant
 * @Date: 2025-10-24
 */

const Controller = require('egg').Controller;
const { Route, HttpGet, HttpPost, HttpPut, HttpDelete } = require('egg-decorator-router');
const { RequiresPermissions } = require('../../decorator/permission');

module.exports = app => {

  @Route('/api/system/role')
  class RoleController extends Controller {

    /**
     * 获取角色列表（分页）
     * GET /api/system/role/list
     * 权限：system:role:list
     */
    @RequiresPermissions('system:role:list')
    @HttpGet('/list')
    async list() {
      const { ctx, service } = this;
      
      try {
        const params = ctx.query;
        
        // 分页参数
        const pageNum = parseInt(params.pageNum) || 1;
        const pageSize = parseInt(params.pageSize) || 10;
        
        // 查询角色列表
        const list = await service.system.role.selectRoleList(params);
        
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
        ctx.logger.error('查询角色列表失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '查询角色列表失败'
        };
      }
    }

    /**
     * 获取角色详情
     * GET /api/system/role/:roleId
     * 权限：system:role:query
     */
    @RequiresPermissions('system:role:query')
    @HttpGet('/:roleId')
    async getInfo() {
      const { ctx, service } = this;
      
      try {
        const { roleId } = ctx.params;
        
        // 校验数据权限
        await service.system.role.checkRoleDataScope(parseInt(roleId));
        
        // 查询角色信息
        const role = await service.system.role.selectRoleById(parseInt(roleId));
        
        if (!role) {
          ctx.body = {
            code: 500,
            msg: '角色不存在'
          };
          return;
        }
        
        ctx.body = {
          code: 200,
          msg: '操作成功',
          data: role
        };
      } catch (err) {
        ctx.logger.error('查询角色详情失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '查询角色详情失败'
        };
      }
    }

    /**
     * 新增角色
     * POST /api/system/role
     * 权限：system:role:add
     */
    @RequiresPermissions('system:role:add')
    @HttpPost('/')
    async add() {
      const { ctx, service } = this;
      
      try {
        const role = ctx.request.body;
        
        // 校验角色名称是否唯一
        const isRoleNameUnique = await service.system.role.checkRoleNameUnique(role);
        if (!isRoleNameUnique) {
          ctx.body = {
            code: 500,
            msg: `新增角色'${role.roleName}'失败，角色名称已存在`
          };
          return;
        }
        
        // 校验角色权限字符是否唯一
        const isRoleKeyUnique = await service.system.role.checkRoleKeyUnique(role);
        if (!isRoleKeyUnique) {
          ctx.body = {
            code: 500,
            msg: `新增角色'${role.roleName}'失败，角色权限已存在`
          };
          return;
        }
        
        // 新增角色
        const rows = await service.system.role.insertRole(role);
        
        ctx.body = {
          code: 200,
          msg: rows > 0 ? '新增成功' : '新增失败'
        };
      } catch (err) {
        ctx.logger.error('新增角色失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '新增角色失败'
        };
      }
    }

    /**
     * 修改角色
     * PUT /api/system/role
     * 权限：system:role:edit
     */
    @RequiresPermissions('system:role:edit')
    @HttpPut('/')
    async edit() {
      const { ctx, service } = this;
      
      try {
        const role = ctx.request.body;
        
        // 校验角色是否允许操作
        service.system.role.checkRoleAllowed(role);
        
        // 校验数据权限
        await service.system.role.checkRoleDataScope(role.roleId);
        
        // 校验角色名称是否唯一
        const isRoleNameUnique = await service.system.role.checkRoleNameUnique(role);
        if (!isRoleNameUnique) {
          ctx.body = {
            code: 500,
            msg: `修改角色'${role.roleName}'失败，角色名称已存在`
          };
          return;
        }
        
        // 校验角色权限字符是否唯一
        const isRoleKeyUnique = await service.system.role.checkRoleKeyUnique(role);
        if (!isRoleKeyUnique) {
          ctx.body = {
            code: 500,
            msg: `修改角色'${role.roleName}'失败，角色权限已存在`
          };
          return;
        }
        
        // 修改角色
        const rows = await service.system.role.updateRole(role);
        
        ctx.body = {
          code: 200,
          msg: rows > 0 ? '修改成功' : '修改失败'
        };
      } catch (err) {
        ctx.logger.error('修改角色失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '修改角色失败'
        };
      }
    }

    /**
     * 删除角色
     * DELETE /api/system/role/:roleIds
     * 权限：system:role:remove
     */
    @RequiresPermissions('system:role:remove')
    @HttpDelete('/:roleIds')
    async remove() {
      const { ctx, service } = this;
      
      try {
        const { roleIds } = ctx.params;
        
        // 解析角色ID数组
        const roleIdArray = roleIds.split(',').map(id => parseInt(id));
        
        // 校验是否允许操作
        for (const roleId of roleIdArray) {
          service.system.role.checkRoleAllowed({ roleId });
        }
        
        // 删除角色
        const rows = await service.system.role.deleteRoleByIds(roleIdArray);
        
        ctx.body = {
          code: 200,
          msg: rows > 0 ? '删除成功' : '删除失败'
        };
      } catch (err) {
        ctx.logger.error('删除角色失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '删除角色失败'
        };
      }
    }

    /**
     * 修改状态
     * PUT /api/system/role/changeStatus
     */
    @HttpPut('/changeStatus')
    async changeStatus() {
      const { ctx, service } = this;
      
      try {
        const role = ctx.request.body;
        
        // 校验角色是否允许操作
        service.system.role.checkRoleAllowed(role);
        
        // 校验数据权限
        await service.system.role.checkRoleDataScope(role.roleId);
        
        // 修改状态
        const rows = await service.system.role.updateRoleStatus(role);
        
        ctx.body = {
          code: 200,
          msg: rows > 0 ? '修改成功' : '修改失败'
        };
      } catch (err) {
        ctx.logger.error('修改角色状态失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '修改角色状态失败'
        };
      }
    }

    /**
     * 修改数据权限
     * PUT /api/system/role/dataScope
     */
    @HttpPut('/dataScope')
    async dataScope() {
      const { ctx, service } = this;
      
      try {
        const role = ctx.request.body;
        
        // 校验角色是否允许操作
        service.system.role.checkRoleAllowed(role);
        
        // 校验数据权限
        await service.system.role.checkRoleDataScope(role.roleId);
        
        // 修改数据权限
        const rows = await service.system.role.authDataScope(role);
        
        ctx.body = {
          code: 200,
          msg: rows > 0 ? '修改成功' : '修改失败'
        };
      } catch (err) {
        ctx.logger.error('修改数据权限失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '修改数据权限失败'
        };
      }
    }

    /**
     * 查询已分配用户角色列表
     * GET /api/system/role/allocatedList
     * 权限：system:role:list
     */
    @RequiresPermissions('system:role:list')
    @HttpGet('/allocatedList')
    async allocatedList() {
      const { ctx, service } = this;
      
      try {
        const params = ctx.query;
        
        // 分页参数
        const pageNum = parseInt(params.pageNum) || 1;
        const pageSize = parseInt(params.pageSize) || 10;
        
        // 构造查询参数
        const userParams = {
          userName: params.userName,
          phonenumber: params.phonenumber,
          roleId: params.roleId
        };
        
        // 查询已分配用户列表
        const list = await service.system.user.selectUserList(userParams);
        
        // 过滤：只保留拥有该角色的用户
        const roleId = parseInt(params.roleId);
        const filteredList = [];
        for (const user of list) {
          const userRoles = await service.system.role.selectRolesByUserId(user.user_id);
          if (userRoles.some(r => r.role_id === roleId)) {
            filteredList.push(user);
          }
        }
        
        // 手动分页
        const total = filteredList.length;
        const start = (pageNum - 1) * pageSize;
        const rows = filteredList.slice(start, start + pageSize);
        
        ctx.body = {
          code: 200,
          msg: '查询成功',
          rows,
          total
        };
      } catch (err) {
        ctx.logger.error('查询已分配用户列表失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '查询已分配用户列表失败'
        };
      }
    }

    /**
     * 查询未分配用户角色列表
     * GET /api/system/role/unallocatedList
     * 权限：system:role:list
     */
    @RequiresPermissions('system:role:list')
    @HttpGet('/unallocatedList')
    async unallocatedList() {
      const { ctx, service } = this;
      
      try {
        const params = ctx.query;
        
        // 分页参数
        const pageNum = parseInt(params.pageNum) || 1;
        const pageSize = parseInt(params.pageSize) || 10;
        
        // 构造查询参数
        const userParams = {
          userName: params.userName,
          phonenumber: params.phonenumber
        };
        
        // 查询所有用户
        const list = await service.system.user.selectUserList(userParams);
        
        // 过滤：只保留没有该角色的用户
        const roleId = parseInt(params.roleId);
        const filteredList = [];
        for (const user of list) {
          const userRoles = await service.system.role.selectRolesByUserId(user.user_id);
          if (!userRoles.some(r => r.role_id === roleId)) {
            filteredList.push(user);
          }
        }
        
        // 手动分页
        const total = filteredList.length;
        const start = (pageNum - 1) * pageSize;
        const rows = filteredList.slice(start, start + pageSize);
        
        ctx.body = {
          code: 200,
          msg: '查询成功',
          rows,
          total
        };
      } catch (err) {
        ctx.logger.error('查询未分配用户列表失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '查询未分配用户列表失败'
        };
      }
    }

    /**
     * 取消授权用户
     * PUT /api/system/role/authUser/cancel
     * 权限：system:role:edit
     */
    @RequiresPermissions('system:role:edit')
    @HttpPut('/authUser/cancel')
    async cancelAuthUser() {
      const { ctx, service } = this;
      
      try {
        const userRole = ctx.request.body;
        
        // 取消授权
        const rows = await service.system.role.deleteAuthUser(userRole);
        
        ctx.body = {
          code: 200,
          msg: rows > 0 ? '取消授权成功' : '取消授权失败'
        };
      } catch (err) {
        ctx.logger.error('取消授权失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '取消授权失败'
        };
      }
    }

    /**
     * 批量取消授权用户
     * PUT /api/system/role/authUser/cancelAll
     * 权限：system:role:edit
     */
    @RequiresPermissions('system:role:edit')
    @HttpPut('/authUser/cancelAll')
    async cancelAuthUserAll() {
      const { ctx, service } = this;
      
      try {
        const { roleId, userIds } = ctx.request.body;
        
        // 解析用户ID数组
        const userIdArray = typeof userIds === 'string'
          ? userIds.split(',').map(id => parseInt(id))
          : userIds;
        
        // 批量取消授权
        const rows = await service.system.role.deleteAuthUsers(roleId, userIdArray);
        
        ctx.body = {
          code: 200,
          msg: rows > 0 ? '取消授权成功' : '取消授权失败'
        };
      } catch (err) {
        ctx.logger.error('批量取消授权失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '批量取消授权失败'
        };
      }
    }

    /**
     * 批量选择用户授权
     * PUT /api/system/role/authUser/selectAll
     * 权限：system:role:edit
     */
    @RequiresPermissions('system:role:edit')
    @HttpPut('/authUser/selectAll')
    async selectAuthUserAll() {
      const { ctx, service } = this;
      
      try {
        const { roleId, userIds } = ctx.request.body;
        
        // 校验数据权限
        await service.system.role.checkRoleDataScope(roleId);
        
        // 解析用户ID数组
        const userIdArray = typeof userIds === 'string'
          ? userIds.split(',').map(id => parseInt(id))
          : userIds;
        
        // 批量授权
        const rows = await service.system.role.insertAuthUsers(roleId, userIdArray);
        
        ctx.body = {
          code: 200,
          msg: rows > 0 ? '授权成功' : '授权失败'
        };
      } catch (err) {
        ctx.logger.error('批量授权失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '批量授权失败'
        };
      }
    }

    /**
     * 获取对应角色部门树列表
     * GET /api/system/role/deptTree/:roleId
     */
    @HttpGet('/deptTree/:roleId')
    async deptTree() {
      const { ctx, service } = this;
      
      try {
        const { roleId } = ctx.params;
        
        // 查询角色已分配的部门ID列表
        const checkedKeys = await service.system.dept.selectDeptListByRoleId(parseInt(roleId));
        
        // 查询所有部门树
        const depts = await service.system.dept.selectDeptTreeList({});
        
        ctx.body = {
          code: 200,
          msg: '操作成功',
          checkedKeys,
          depts
        };
      } catch (err) {
        ctx.logger.error('查询角色部门树失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '查询角色部门树失败'
        };
      }
    }

    /**
     * 导出角色
     * POST /api/system/role/export
     * 权限：system:role:export
     */
    @RequiresPermissions('system:role:export')
    @HttpPost('/export')
    async export() {
      const { ctx, service } = this;
      
      try {
        const params = ctx.request.body;
        
        // 查询角色列表
        const list = await service.system.role.selectRoleList(params);
        
        // TODO: 实现 Excel 导出功能
        // 目前返回 JSON 数据
        ctx.body = {
          code: 200,
          msg: '导出成功',
          data: list
        };
      } catch (err) {
        ctx.logger.error('导出角色失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '导出角色失败'
        };
      }
    }
  }

  return RoleController;
};

