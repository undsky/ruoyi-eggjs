/*
 * @Description: 定时任务监控控制器
 * @Author: AI Assistant
 * @Date: 2025-10-24
 */

const Controller = require('egg').Controller;
const { Route, HttpGet, HttpPost, HttpPut, HttpDelete } = require('egg-decorator-router');
const { RequiresPermissions } = require('../../decorator/permission');

module.exports = app => {

  @Route('/api/monitor/job')
  class JobController extends Controller {

    /**
     * 获取定时任务列表（分页）
     * GET /api/monitor/job/list
     * 权限：monitor:job:list
     */
    @RequiresPermissions('monitor:job:list')
    @HttpGet('/list')
    async list() {
      const { ctx, service } = this;
      
      try {
        const params = ctx.query;
        
        // 分页参数
        const pageNum = parseInt(params.pageNum) || 1;
        const pageSize = parseInt(params.pageSize) || 10;
        
        // 查询定时任务列表
        const list = await service.monitor.job.selectJobList(params);
        
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
        ctx.logger.error('查询定时任务列表失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '查询定时任务列表失败'
        };
      }
    }

    /**
     * 获取定时任务详情
     * GET /api/monitor/job/:jobId
     * 权限：monitor:job:query
     */
    @RequiresPermissions('monitor:job:query')
    @HttpGet('/:jobId')
    async getInfo() {
      const { ctx, service } = this;
      
      try {
        const { jobId } = ctx.params;
        
        // 查询定时任务信息
        const job = await service.monitor.job.selectJobById(parseInt(jobId));
        
        if (!job) {
          ctx.body = {
            code: 500,
            msg: '定时任务不存在'
          };
          return;
        }
        
        ctx.body = {
          code: 200,
          msg: '操作成功',
          data: job
        };
      } catch (err) {
        ctx.logger.error('查询定时任务详情失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '查询定时任务详情失败'
        };
      }
    }

    /**
     * 新增定时任务
     * POST /api/monitor/job
     * 权限：monitor:job:add
     */
    @RequiresPermissions('monitor:job:add')
    @HttpPost('/')
    async add() {
      const { ctx, service } = this;
      
      try {
        const job = ctx.request.body;
        
        // 校验 cron 表达式
        if (!service.monitor.job.isValidCron(job.cronExpression)) {
          ctx.body = {
            code: 500,
            msg: `新增任务'${job.jobName}'失败，Cron表达式不正确`
          };
          return;
        }
        
        // 新增定时任务
        const rows = await service.monitor.job.insertJob(job);
        
        ctx.body = {
          code: 200,
          msg: rows > 0 ? '新增成功' : '新增失败',
          data: {
            note: '注意：定时任务功能需要完善，建议使用 Egg.js schedule 或集成 node-cron'
          }
        };
      } catch (err) {
        ctx.logger.error('新增定时任务失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '新增定时任务失败'
        };
      }
    }

    /**
     * 修改定时任务
     * PUT /api/monitor/job
     * 权限：monitor:job:edit
     */
    @RequiresPermissions('monitor:job:edit')
    @HttpPut('/')
    async edit() {
      const { ctx, service } = this;
      
      try {
        const job = ctx.request.body;
        
        // 校验 cron 表达式
        if (!service.monitor.job.isValidCron(job.cronExpression)) {
          ctx.body = {
            code: 500,
            msg: `修改任务'${job.jobName}'失败，Cron表达式不正确`
          };
          return;
        }
        
        // 修改定时任务
        const rows = await service.monitor.job.updateJob(job);
        
        ctx.body = {
          code: 200,
          msg: rows > 0 ? '修改成功' : '修改失败'
        };
      } catch (err) {
        ctx.logger.error('修改定时任务失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '修改定时任务失败'
        };
      }
    }

    /**
     * 删除定时任务
     * DELETE /api/monitor/job/:jobIds
     * 权限：monitor:job:remove
     */
    @RequiresPermissions('monitor:job:remove')
    @HttpDelete('/:jobIds')
    async remove() {
      const { ctx, service } = this;
      
      try {
        const { jobIds } = ctx.params;
        
        // 解析任务ID数组
        const jobIdArray = jobIds.split(',').map(id => parseInt(id));
        
        // 删除定时任务
        const rows = await service.monitor.job.deleteJobByIds(jobIdArray);
        
        ctx.body = {
          code: 200,
          msg: rows > 0 ? '删除成功' : '删除失败'
        };
      } catch (err) {
        ctx.logger.error('删除定时任务失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '删除定时任务失败'
        };
      }
    }

    /**
     * 修改任务状态
     * PUT /api/monitor/job/changeStatus
     * 权限：monitor:job:changeStatus
     */
    @RequiresPermissions('monitor:job:changeStatus')
    @HttpPut('/changeStatus')
    async changeStatus() {
      const { ctx, service } = this;
      
      try {
        const job = ctx.request.body;
        
        // 修改任务状态
        const rows = await service.monitor.job.changeStatus(job);
        
        ctx.body = {
          code: 200,
          msg: rows > 0 ? '修改成功' : '修改失败'
        };
      } catch (err) {
        ctx.logger.error('修改任务状态失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '修改任务状态失败'
        };
      }
    }

    /**
     * 立即执行任务
     * PUT /api/monitor/job/run
     * 权限：monitor:job:changeStatus
     */
    @RequiresPermissions('monitor:job:changeStatus')
    @HttpPut('/run')
    async run() {
      const { ctx, service } = this;
      
      try {
        const job = ctx.request.body;
        
        // 立即执行任务
        const result = await service.monitor.job.run(job);
        
        ctx.body = {
          code: 200,
          msg: result ? '执行成功' : '任务不存在或已过期！'
        };
      } catch (err) {
        ctx.logger.error('执行任务失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '执行任务失败'
        };
      }
    }

    /**
     * 导出定时任务
     * POST /api/monitor/job/export
     * 权限：monitor:job:export
     */
    @RequiresPermissions('monitor:job:export')
    @HttpPost('/export')
    async export() {
      const { ctx, service } = this;
      
      try {
        const params = ctx.request.body;
        
        // 查询定时任务列表
        const list = await service.monitor.job.selectJobList(params);
        
        // TODO: 实现 Excel 导出功能
        // 目前返回 JSON 数据
        ctx.body = {
          code: 200,
          msg: '导出成功',
          data: list
        };
      } catch (err) {
        ctx.logger.error('导出定时任务失败:', err);
        ctx.body = {
          code: 500,
          msg: err.message || '导出定时任务失败'
        };
      }
    }
  }

  return JobController;
};

