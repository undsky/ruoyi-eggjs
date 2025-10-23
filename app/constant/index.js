/*
 * @Description: 常量定义
 * @Author: AI Assistant
 * @Date: 2025-10-23
 */

/**
 * 通用常量
 */
module.exports.Constants = {
  // 成功标记
  SUCCESS: '0',
  // 失败标记
  FAIL: '1',
  
  // 登录成功
  LOGIN_SUCCESS: '0',
  // 登录失败
  LOGIN_FAIL: '1',
  
  // 正常状态
  NORMAL: '0',
  // 停用状态
  DISABLE: '1',
  
  // 删除标志
  DEL_FLAG_EXIST: '0',
  DEL_FLAG_DELETE: '2',
  
  // 是否
  YES: 'Y',
  NO: 'N',
  
  // 菜单类型
  TYPE_DIR: 'M',   // 目录
  TYPE_MENU: 'C',  // 菜单
  TYPE_BUTTON: 'F' // 按钮
};

/**
 * 用户常量
 */
module.exports.UserConstants = {
  // 用户名长度限制
  USERNAME_MIN_LENGTH: 2,
  USERNAME_MAX_LENGTH: 20,
  
  // 密码长度限制
  PASSWORD_MIN_LENGTH: 5,
  PASSWORD_MAX_LENGTH: 20,
  
  // 管理员ID
  ADMIN_ID: 1,
  
  // 用户类型
  USER_TYPE_SYSTEM: '00',  // 系统用户
  
  // 用户性别
  SEX_MALE: '0',    // 男
  SEX_FEMALE: '1',  // 女
  SEX_UNKNOWN: '2'  // 未知
};

/**
 * HTTP 状态码
 */
module.exports.HttpStatus = {
  SUCCESS: 200,           // 成功
  BAD_REQUEST: 400,       // 错误请求
  UNAUTHORIZED: 401,      // 未授权
  FORBIDDEN: 403,         // 禁止访问
  NOT_FOUND: 404,         // 未找到
  INTERNAL_ERROR: 500     // 服务器错误
};

/**
 * 业务操作类型
 */
module.exports.BusinessType = {
  OTHER: 0,      // 其它
  INSERT: 1,     // 新增
  UPDATE: 2,     // 修改
  DELETE: 3,     // 删除
  GRANT: 4,      // 授权
  EXPORT: 5,     // 导出
  IMPORT: 6,     // 导入
  FORCE: 7,      // 强退
  CLEAN: 8       // 清空数据
};

/**
 * 操作人类别
 */
module.exports.OperatorType = {
  OTHER: 0,      // 其它
  MANAGE: 1,     // 后台用户
  MOBILE: 2      // 手机端用户
};

/**
 * 数据范围
 */
module.exports.DataScope = {
  ALL: '1',              // 全部数据权限
  CUSTOM: '2',           // 自定数据权限
  DEPT: '3',             // 本部门数据权限
  DEPT_AND_CHILD: '4',   // 本部门及以下数据权限
  SELF: '5'              // 仅本人数据权限
};

