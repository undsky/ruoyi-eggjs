/*
 * @Description: 岗位管理控制器
 * @Author: AI Assistant
 * @Date: 2025-10-24
 */

const Controller = require('egg').Controller;
const { Route, HttpGet, HttpPost, HttpPut, HttpDelete } = require('egg-decorator-router');
const { RequiresPermissions } = require('../../decorator/permission');

module.exports = app => {

  @Route('/api/system/post')
  class PostController extends Controller {

    /**
     * 获取岗位列表（分页）
     * GET /api/system/post/list
     * 权限：system:post:list
     */
    @RequiresPermissions('system:post:list')
    @HttpGet('/list')
    async list() {
      const { ctx, service } = this;
      
      try {
        const params = ctx.query;
        
        // 分页参数
        const pageNum = parseInt(params.pageNum) || 1;
        const pageSize = parseInt(params.pageSize) || 10;
        
        // 查询岗位列表
        const list = await service.system.post.selectPostList(params);
        
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
        ctx.logger.error('查询岗位列表失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '查询岗位列表失败'
        };
      }
    }

    /**
     * 获取岗位详情
     * GET /api/system/post/:postId
     * 权限：system:post:query
     */
    @RequiresPermissions('system:post:query')
    @HttpGet('/:postId')
    async getInfo() {
      const { ctx, service } = this;
      
      try {
        const { postId } = ctx.params;
        
        // 查询岗位信息
        const post = await service.system.post.selectPostById(parseInt(postId));
        
        if (!post) {
          ctx.body = {
            code: 500,
            msg: '岗位不存在'
          };
          return;
        }
        
        ctx.body = {
          code: 200,
          msg: '操作成功',
          data: post
        };
      } catch (err) {
        ctx.logger.error('查询岗位详情失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '查询岗位详情失败'
        };
      }
    }

    /**
     * 新增岗位
     * POST /api/system/post
     * 权限：system:post:add
     */
    @RequiresPermissions('system:post:add')
    @HttpPost('/')
    async add() {
      const { ctx, service } = this;
      
      try {
        const post = ctx.request.body;
        
        // 校验岗位名称是否唯一
        const isPostNameUnique = await service.system.post.checkPostNameUnique(post);
        if (!isPostNameUnique) {
          ctx.body = {
            code: 500,
            msg: `新增岗位'${post.postName}'失败，岗位名称已存在`
          };
          return;
        }
        
        // 校验岗位编码是否唯一
        const isPostCodeUnique = await service.system.post.checkPostCodeUnique(post);
        if (!isPostCodeUnique) {
          ctx.body = {
            code: 500,
            msg: `新增岗位'${post.postName}'失败，岗位编码已存在`
          };
          return;
        }
        
        // 新增岗位
        const rows = await service.system.post.insertPost(post);
        
        ctx.body = {
          code: 200,
          msg: rows > 0 ? '新增成功' : '新增失败'
        };
      } catch (err) {
        ctx.logger.error('新增岗位失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '新增岗位失败'
        };
      }
    }

    /**
     * 修改岗位
     * PUT /api/system/post
     * 权限：system:post:edit
     */
    @RequiresPermissions('system:post:edit')
    @HttpPut('/')
    async edit() {
      const { ctx, service } = this;
      
      try {
        const post = ctx.request.body;
        
        // 校验岗位名称是否唯一
        const isPostNameUnique = await service.system.post.checkPostNameUnique(post);
        if (!isPostNameUnique) {
          ctx.body = {
            code: 500,
            msg: `修改岗位'${post.postName}'失败，岗位名称已存在`
          };
          return;
        }
        
        // 校验岗位编码是否唯一
        const isPostCodeUnique = await service.system.post.checkPostCodeUnique(post);
        if (!isPostCodeUnique) {
          ctx.body = {
            code: 500,
            msg: `修改岗位'${post.postName}'失败，岗位编码已存在`
          };
          return;
        }
        
        // 修改岗位
        const rows = await service.system.post.updatePost(post);
        
        ctx.body = {
          code: 200,
          msg: rows > 0 ? '修改成功' : '修改失败'
        };
      } catch (err) {
        ctx.logger.error('修改岗位失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '修改岗位失败'
        };
      }
    }

    /**
     * 删除岗位
     * DELETE /api/system/post/:postIds
     * 权限：system:post:remove
     */
    @RequiresPermissions('system:post:remove')
    @HttpDelete('/:postIds')
    async remove() {
      const { ctx, service } = this;
      
      try {
        const { postIds } = ctx.params;
        
        // 解析岗位ID数组
        const postIdArray = postIds.split(',').map(id => parseInt(id));
        
        // 删除岗位
        const rows = await service.system.post.deletePostByIds(postIdArray);
        
        ctx.body = {
          code: 200,
          msg: rows > 0 ? '删除成功' : '删除失败'
        };
      } catch (err) {
        ctx.logger.error('删除岗位失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '删除岗位失败'
        };
      }
    }

    /**
     * 导出岗位
     * POST /api/system/post/export
     * 权限：system:post:export
     */
    @RequiresPermissions('system:post:export')
    @HttpPost('/export')
    async export() {
      const { ctx, service } = this;
      
      try {
        const params = ctx.request.body;
        
        // 查询岗位列表
        const list = await service.system.post.selectPostList(params);
        
        // TODO: 实现 Excel 导出功能
        // 目前返回 JSON 数据
        ctx.body = {
          code: 200,
          msg: '导出成功',
          data: list
        };
      } catch (err) {
        ctx.logger.error('导出岗位失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '导出岗位失败'
        };
      }
    }
  }

  return PostController;
};

