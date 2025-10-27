/*
 * @Description: 定时任务调度日志控制器
 * @Author: AI Assistant
 * @Date: 2025-10-27
 */

const Controller = require('egg').Controller;
const { Route, HttpGet, HttpPost, HttpDelete } = require('egg-decorator-router');
const { RequiresPermissions } = require('../../decorator/permission');

module.exports = app => {

  @Route('/api/monitor/jobLog')
  class JobLogController extends Controller {

    /**
     * 查询调度日志列表
     * GET /api/monitor/jobLog/list
     * 权限：monitor:job:list
     */
    @RequiresPermissions('monitor:job:list')
    @HttpGet('/list')
    async list() {
      const { ctx, service } = this;
      
      try {
        const query = ctx.query;
        
        // 分页参数
        const pageNum = parseInt(query.pageNum) || 1;
        const pageSize = parseInt(query.pageSize) || 10;
        
        // 查询条件
        const params = {
          jobName: query.jobName,
          jobGroup: query.jobGroup,
          status: query.status,
          beginTime: query.beginTime,
          endTime: query.endTime
        };
        
        // 查询调度日志列表
        const list = await service.monitor.jobLog.selectJobLogList(
          { pageNum, pageSize },
          params
        );
        
        // 查询总数
        const total = await service.monitor.jobLog.selectJobLogCount(params);
        
        ctx.body = {
          code: 200,
          msg: '查询成功',
          rows: list,
          total
        };
      } catch (err) {
        ctx.logger.error('查询调度日志列表失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '查询失败'
        };
      }
    }

    /**
     * 删除调度日志
     * DELETE /api/monitor/jobLog/:jobLogIds
     * 权限：monitor:job:remove
     */
    @RequiresPermissions('monitor:job:remove')
    @HttpDelete('/:jobLogIds')
    async remove() {
      const { ctx, service } = this;
      
      try {
        const jobLogIds = ctx.params.jobLogIds.split(',').map(id => parseInt(id));
        
        // 删除调度日志
        const result = await service.monitor.jobLog.deleteJobLogByIds(jobLogIds);
        
        if (result > 0) {
          ctx.body = {
            code: 200,
            msg: '删除成功'
          };
        } else {
          ctx.body = {
            code: 500,
            msg: '删除失败'
          };
        }
      } catch (err) {
        ctx.logger.error('删除调度日志失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '删除失败'
        };
      }
    }

    /**
     * 清空调度日志
     * DELETE /api/monitor/jobLog/clean
     * 权限：monitor:job:remove
     */
    @RequiresPermissions('monitor:job:remove')
    @HttpDelete('/clean')
    async clean() {
      const { ctx, service } = this;
      
      try {
        // 清空调度日志
        await service.monitor.jobLog.cleanJobLog();
        
        ctx.body = {
          code: 200,
          msg: '清空成功'
        };
      } catch (err) {
        ctx.logger.error('清空调度日志失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '清空失败'
        };
      }
    }

    /**
     * 导出调度日志
     * POST /api/monitor/jobLog/export
     * 权限：monitor:job:export
     */
    @RequiresPermissions('monitor:job:export')
    @HttpPost('/export')
    async export() {
      const { ctx, service } = this;
      
      try {
        const params = ctx.request.body;
        
        // 查询所有符合条件的调度日志
        const list = await service.monitor.jobLog.selectJobLogList(
          { pageNum: 1, pageSize: 100000 },
          params
        );
        
        // 导出 Excel
        const buffer = await service.monitor.jobLog.exportJobLog(list);
        
        // 设置响应头
        ctx.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        ctx.set('Content-Disposition', `attachment; filename=job_log_${Date.now()}.xlsx`);
        
        ctx.body = buffer;
      } catch (err) {
        ctx.logger.error('导出调度日志失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '导出失败'
        };
      }
    }
  }

  return JobLogController;
};

