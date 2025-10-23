/*
 * @Description: 参数配置服务层
 * @Author: AI Assistant
 * @Date: 2025-10-23
 */

const Service = require('egg').Service;

class ConfigService extends Service {

  /**
   * 根据键名查询参数配置
   * @param {string} configKey - 参数键名
   * @return {string} 参数键值
   */
  async selectConfigByKey(configKey) {
    const { ctx, app } = this;
    
    // 先从缓存中获取
    const cacheKey = `config:${configKey}`;
    let configValue = await app.cache.default.get(cacheKey);
    
    if (configValue) {
      return configValue;
    }
    
    // 从数据库查询
    const sql = `
      SELECT config_value FROM sys_config
      WHERE config_key = ? AND del_flag = '0'
      LIMIT 1
    `;
    
    const rows = await ctx.app.mysql.get('ruoyi').query(sql, [configKey]);
    
    if (rows && rows.length > 0) {
      configValue = rows[0].config_value;
      
      // 存入缓存（1小时）
      await app.cache.default.set(cacheKey, configValue, { ttl: 3600 });
      
      return configValue;
    }
    
    return null;
  }
}

module.exports = ConfigService;

