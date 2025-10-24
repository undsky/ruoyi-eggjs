/*
 * @Description: 字典数据服务层
 * @Author: AI Assistant
 * @Date: 2025-10-24
 */

const Service = require('egg').Service;

class DictDataService extends Service {

  /**
   * 查询字典数据列表
   * @param {object} dictData - 查询参数
   * @return {array} 字典数据列表
   */
  async selectDictDataList(dictData = {}) {
    const { ctx } = this;
    
    // 查询条件
    const conditions = {
      dictType: dictData.dictType,
      dictLabel: dictData.dictLabel,
      status: dictData.status
    };

    // 查询列表
    const dictDataList = await ctx.service.db.mysql.ruoyi.sysDictDataMapper.selectDictDataList([conditions]);
    
    return dictDataList || [];
  }

  /**
   * 根据字典数据ID查询字典数据
   * @param {number} dictCode - 字典数据ID
   * @return {object} 字典数据信息
   */
  async selectDictDataById(dictCode) {
    const { ctx } = this;
    
    const dictDataList = await ctx.service.db.mysql.ruoyi.sysDictDataMapper.selectDictDataById([dictCode]);
    
    return dictDataList && dictDataList.length > 0 ? dictDataList[0] : null;
  }

  /**
   * 根据字典类型查询字典数据
   * @param {string} dictType - 字典类型
   * @return {array} 字典数据列表
   */
  async selectDictDataByType(dictType) {
    const { ctx, app } = this;
    
    // 先从缓存获取
    const cacheKey = `dict_${dictType}`;
    const cacheData = await app.cache.default.get(cacheKey);
    
    if (cacheData) {
      try {
        return JSON.parse(cacheData);
      } catch (err) {
        ctx.logger.error('解析字典缓存失败:', err);
      }
    }
    
    // 从数据库查询
    const dictDataList = await ctx.service.db.mysql.ruoyi.sysDictDataMapper.selectDictDataByType([dictType]);
    
    // 存入缓存
    if (dictDataList && dictDataList.length > 0) {
      await app.cache.default.set(cacheKey, JSON.stringify(dictDataList), 0);
    }
    
    return dictDataList || [];
  }

  /**
   * 新增字典数据
   * @param {object} dictData - 字典数据对象
   * @return {number} 影响行数
   */
  async insertDictData(dictData) {
    const { ctx } = this;
    
    // 设置创建信息
    dictData.createBy = ctx.state.user.userName;
    
    // 插入字典数据
    const result = await ctx.service.db.mysql.ruoyi.sysDictDataMapper.insertDictData([dictData]);
    
    // 更新缓存
    if (result && result.length > 0) {
      await this.updateDictCache(dictData.dictType);
      return 1;
    }
    
    return 0;
  }

  /**
   * 修改字典数据
   * @param {object} dictData - 字典数据对象
   * @return {number} 影响行数
   */
  async updateDictData(dictData) {
    const { ctx } = this;
    
    // 设置更新信息
    dictData.updateBy = ctx.state.user.userName;
    
    // 更新字典数据
    const result = await ctx.service.db.mysql.ruoyi.sysDictDataMapper.updateDictData([dictData]);
    
    // 更新缓存
    if (result && result.length > 0) {
      await this.updateDictCache(dictData.dictType);
      return 1;
    }
    
    return 0;
  }

  /**
   * 删除字典数据
   * @param {array} dictCodes - 字典数据ID数组
   * @return {number} 影响行数
   */
  async deleteDictDataByIds(dictCodes) {
    const { ctx } = this;
    
    let deletedCount = 0;
    const dictTypes = new Set();
    
    for (const dictCode of dictCodes) {
      // 查询字典数据
      const dictData = await this.selectDictDataById(dictCode);
      
      if (!dictData) {
        continue;
      }
      
      // 删除字典数据
      await ctx.service.db.mysql.ruoyi.sysDictDataMapper.deleteDictDataById([dictCode]);
      
      // 记录需要更新缓存的字典类型
      dictTypes.add(dictData.dict_type);
      deletedCount++;
    }
    
    // 更新缓存
    for (const dictType of dictTypes) {
      await this.updateDictCache(dictType);
    }
    
    return deletedCount;
  }

  /**
   * 更新字典缓存
   * @param {string} dictType - 字典类型
   */
  async updateDictCache(dictType) {
    const { ctx, app } = this;
    
    // 重新查询该类型的所有字典数据
    const dictDataList = await ctx.service.db.mysql.ruoyi.sysDictDataMapper.selectDictDataByType([dictType]);
    
    // 更新缓存
    const cacheKey = `dict_${dictType}`;
    await app.cache.default.set(cacheKey, JSON.stringify(dictDataList || []), 0);
  }
}

module.exports = DictDataService;

