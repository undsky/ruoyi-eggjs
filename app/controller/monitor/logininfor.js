/*
 * @Description: 登录日志监控控制器
 * @Author: AI Assistant
 * @Date: 2025-10-24
 */

const Controller = require('egg').Controller;
const { Route, HttpGet, HttpPost, HttpDelete } = require('egg-decorator-router');

module.exports = app => {

  @Route('/api/monitor/logininfor')
  class LogininforController extends Controller {

    /**
     * 获取登录日志列表（分页）
     * GET /api/monitor/logininfor/list
     */
    @HttpGet('/list')
    async list() {
      const { ctx, service } = this;
      
      try {
        const params = ctx.query;
        
        // 分页参数
        const pageNum = parseInt(params.pageNum) || 1;
        const pageSize = parseInt(params.pageSize) || 10;
        
        // 查询登录日志列表
        const list = await service.monitor.logininfor.selectLogininforList(params);
        
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
        ctx.logger.error('查询登录日志列表失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '查询登录日志列表失败'
        };
      }
    }

    /**
     * 删除登录日志
     * DELETE /api/monitor/logininfor/:infoIds
     */
    @HttpDelete('/:infoIds')
    async remove() {
      const { ctx, service } = this;
      
      try {
        const { infoIds } = ctx.params;
        
        // 解析日志ID数组
        const infoIdArray = infoIds.split(',').map(id => parseInt(id));
        
        // 删除登录日志
        const rows = await service.monitor.logininfor.deleteLogininforByIds(infoIdArray);
        
        ctx.body = {
          code: 200,
          msg: rows > 0 ? '删除成功' : '删除失败'
        };
      } catch (err) {
        ctx.logger.error('删除登录日志失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '删除登录日志失败'
        };
      }
    }

    /**
     * 清空登录日志
     * DELETE /api/monitor/logininfor/clean
     */
    @HttpDelete('/clean')
    async clean() {
      const { ctx, service } = this;
      
      try {
        // 清空登录日志
        await service.monitor.logininfor.cleanLogininfor();
        
        ctx.body = {
          code: 200,
          msg: '清空成功'
        };
      } catch (err) {
        ctx.logger.error('清空登录日志失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '清空登录日志失败'
        };
      }
    }

    /**
     * 解锁用户
     * GET /api/monitor/logininfor/unlock/:userName
     */
    @HttpGet('/unlock/:userName')
    async unlock() {
      const { ctx, service } = this;
      
      try {
        const { userName } = ctx.params;
        
        // 解锁用户
        await service.monitor.logininfor.unlockUser(userName);
        
        ctx.body = {
          code: 200,
          msg: '解锁成功'
        };
      } catch (err) {
        ctx.logger.error('解锁用户失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '解锁用户失败'
        };
      }
    }

    /**
     * 导出登录日志
     * POST /api/monitor/logininfor/export
     */
    @HttpPost('/export')
    async export() {
      const { ctx, service } = this;
      
      try {
        const params = ctx.request.body;
        
        // 查询登录日志列表
        const list = await service.monitor.logininfor.selectLogininforList(params);
        
        // TODO: 实现 Excel 导出功能
        // 目前返回 JSON 数据
        ctx.body = {
          code: 200,
          msg: '导出成功',
          data: list
        };
      } catch (err) {
        ctx.logger.error('导出登录日志失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '导出登录日志失败'
        };
      }
    }
  }

  return LogininforController;
};

