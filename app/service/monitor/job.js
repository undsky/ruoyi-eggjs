/*
 * @Description: 定时任务服务层
 * @Author: AI Assistant
 * @Date: 2025-10-24
 */

const Service = require('egg').Service;

class JobService extends Service {

  /**
   * 查询定时任务列表
   * @param {object} job - 查询参数
   * @return {array} 定时任务列表
   */
  async selectJobList(job = {}) {
    const { ctx } = this;
    
    // 从 schedule 配置中获取任务列表
    // 注意：这是简化实现，实际项目中可能需要使用数据库存储
    const schedules = ctx.app.schedules || {};
    const jobList = [];
    
    let jobId = 1;
    for (const [scheduleName, schedule] of Object.entries(schedules)) {
      const jobInfo = {
        jobId: jobId++,
        jobName: scheduleName,
        jobGroup: 'DEFAULT',
        invokeTarget: scheduleName,
        cronExpression: schedule.schedule?.cron || '0 0 0 * * ?',
        misfirePolicy: '1',
        concurrent: '1',
        status: schedule.schedule?.disable ? '1' : '0',
        createTime: new Date(),
        remark: schedule.schedule?.type || 'worker'
      };
      
      // 过滤条件
      if (job.jobName && !jobInfo.jobName.includes(job.jobName)) {
        continue;
      }
      
      if (job.jobGroup && jobInfo.jobGroup !== job.jobGroup) {
        continue;
      }
      
      if (job.status && jobInfo.status !== job.status) {
        continue;
      }
      
      jobList.push(jobInfo);
    }
    
    return jobList;
  }

  /**
   * 根据任务ID查询定时任务
   * @param {number} jobId - 任务ID
   * @return {object} 定时任务信息
   */
  async selectJobById(jobId) {
    const jobList = await this.selectJobList({});
    return jobList.find(job => job.jobId === jobId) || null;
  }

  /**
   * 新增定时任务
   * @param {object} job - 定时任务对象
   * @return {number} 影响行数
   */
  async insertJob(job) {
    // 注意：简化实现
    // 实际项目中需要：
    // 1. 将任务信息保存到数据库
    // 2. 动态创建 schedule 任务
    // 3. 使用 Quartz 或其他任务调度框架
    
    return 1;
  }

  /**
   * 修改定时任务
   * @param {object} job - 定时任务对象
   * @return {number} 影响行数
   */
  async updateJob(job) {
    // 注意：简化实现
    // 实际项目中需要：
    // 1. 更新数据库中的任务信息
    // 2. 重新调度任务
    
    return 1;
  }

  /**
   * 删除定时任务
   * @param {array} jobIds - 任务ID数组
   * @return {number} 影响行数
   */
  async deleteJobByIds(jobIds) {
    // 注意：简化实现
    // 实际项目中需要：
    // 1. 删除数据库中的任务
    // 2. 停止并移除任务调度
    
    return jobIds.length;
  }

  /**
   * 修改任务状态
   * @param {object} job - 定时任务对象
   * @return {number} 影响行数
   */
  async changeStatus(job) {
    // 注意：简化实现
    // 实际项目中需要：
    // 1. 更新数据库中的任务状态
    // 2. 启动或暂停任务
    
    return 1;
  }

  /**
   * 立即执行任务
   * @param {object} job - 定时任务对象
   * @return {boolean} 是否成功
   */
  async run(job) {
    const { ctx } = this;
    
    // 注意：简化实现
    // 实际项目中需要：
    // 1. 查找对应的任务
    // 2. 立即执行一次
    
    ctx.logger.info(`手动触发任务执行: ${job.jobName}`);
    
    return true;
  }

  /**
   * 校验 cron 表达式是否有效
   * @param {string} cronExpression - cron 表达式
   * @return {boolean} 是否有效
   */
  isValidCron(cronExpression) {
    // 简单校验 cron 表达式格式
    // 标准 cron: 秒 分 时 日 月 周
    const cronParts = cronExpression.trim().split(/\s+/);
    return cronParts.length === 6 || cronParts.length === 7;
  }
}

module.exports = JobService;

