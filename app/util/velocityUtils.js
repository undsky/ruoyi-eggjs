/*
 * @Description: Velocity 模板工具类
 * @Author: 姜彦汐
 * @Date: 2025-11-08
 */

const Velocity = require('velocityjs');
const dayjs = require('dayjs');
const GenConstants = require('../constant/genConstants');
const GenUtils = require('./genUtils');

class VelocityUtils {
  /**
   * 设置模板变量信息
   * @param {object} genTable - 表信息
   * @return {object} 模板上下文
   */
  static prepareContext(genTable) {
    const moduleName = genTable.moduleName;
    const businessName = genTable.businessName;
    const packageName = genTable.packageName;
    const tplCategory = genTable.tplCategory;
    const functionName = genTable.functionName;

    const context = {
      tplCategory: genTable.tplCategory,
      tableName: genTable.tableName,
      functionName: functionName || '【请填写功能名称】',
      ClassName: genTable.className,
      className: GenUtils.uncapitalize(genTable.className),
      moduleName: genTable.moduleName,
      BusinessName: GenUtils.capitalize(genTable.businessName),
      businessName: genTable.businessName,
      basePackage: VelocityUtils.getPackagePrefix(packageName),
      packageName: packageName,
      author: genTable.functionAuthor,
      datetime: dayjs().format('YYYY-MM-DD'),
      pkColumn: genTable.pkColumn,
      importList: VelocityUtils.getImportList(genTable),
      permissionPrefix: VelocityUtils.getPermissionPrefix(moduleName, businessName),
      columns: genTable.columns,
      table: genTable,
      dicts: VelocityUtils.getDicts(genTable)
    };

    VelocityUtils.setMenuVelocityContext(context, genTable);
    
    if (tplCategory === GenConstants.TPL_TREE) {
      VelocityUtils.setTreeVelocityContext(context, genTable);
    }
    
    if (tplCategory === GenConstants.TPL_SUB) {
      VelocityUtils.setSubVelocityContext(context, genTable);
    }

    return context;
  }

  /**
   * 设置菜单上下文
   * @param {object} context - 上下文
   * @param {object} genTable - 表信息
   */
  static setMenuVelocityContext(context, genTable) {
    const options = genTable.options;
    let paramsObj = {};
    if (options) {
      try {
        paramsObj = typeof options === 'string' ? JSON.parse(options) : options;
      } catch (e) {
        paramsObj = {};
      }
    }
    const parentMenuId = VelocityUtils.getParentMenuId(paramsObj);
    context.parentMenuId = parentMenuId;
  }

  /**
   * 设置树表上下文
   * @param {object} context - 上下文
   * @param {object} genTable - 表信息
   */
  static setTreeVelocityContext(context, genTable) {
    const options = genTable.options;
    let paramsObj = {};
    if (options) {
      try {
        paramsObj = typeof options === 'string' ? JSON.parse(options) : options;
      } catch (e) {
        paramsObj = {};
      }
    }
    const treeCode = VelocityUtils.getTreecode(paramsObj);
    const treeParentCode = VelocityUtils.getTreeParentCode(paramsObj);
    const treeName = VelocityUtils.getTreeName(paramsObj);

    context.treeCode = treeCode;
    context.treeParentCode = treeParentCode;
    context.treeName = treeName;
    context.expandColumn = VelocityUtils.getExpandColumn(genTable);
    
    if (paramsObj[GenConstants.TREE_PARENT_CODE]) {
      context.tree_parent_code = paramsObj[GenConstants.TREE_PARENT_CODE];
    }
    if (paramsObj[GenConstants.TREE_NAME]) {
      context.tree_name = paramsObj[GenConstants.TREE_NAME];
    }
  }

  /**
   * 设置主子表上下文
   * @param {object} context - 上下文
   * @param {object} genTable - 表信息
   */
  static setSubVelocityContext(context, genTable) {
    const subTable = genTable.subTable;
    const subTableName = genTable.subTableName;
    const subTableFkName = genTable.subTableFkName;
    const subClassName = genTable.subTable.className;
    const subTableFkClassName = GenUtils.convertToCamelCase(subTableFkName);

    context.subTable = subTable;
    context.subTableName = subTableName;
    context.subTableFkName = subTableFkName;
    context.subTableFkClassName = subTableFkClassName;
    context.subTableFkclassName = GenUtils.uncapitalize(subTableFkClassName);
    context.subClassName = subClassName;
    context.subclassName = GenUtils.uncapitalize(subClassName);
    context.subImportList = VelocityUtils.getImportList(genTable.subTable);
  }

  /**
   * 获取模板列表
   * @param {string} tplCategory - 模板类型
   * @param {string} tplWebType - 前端类型
   * @return {array} 模板列表
   */
  static getTemplateList(tplCategory, tplWebType) {
    let useWebType = 'vm/vue';
    if (tplWebType === 'element-plus') {
      useWebType = 'vm/vue/v3';
    }
    
    const templates = [];
    templates.push('vm/eggjs/controller.js.vm');
    templates.push('vm/eggjs/service.js.vm');
    templates.push('vm/xml/mapper.xml.vm');
    templates.push('vm/sql/sql.vm');
    templates.push('vm/js/api.js.vm');
    
    if (tplCategory === GenConstants.TPL_CRUD) {
      templates.push(`${useWebType}/index.vue.vm`);
    } else if (tplCategory === GenConstants.TPL_TREE) {
      templates.push(`${useWebType}/index-tree.vue.vm`);
    } else if (tplCategory === GenConstants.TPL_SUB) {
      templates.push(`${useWebType}/index.vue.vm`);
    }
    
    return templates;
  }

  /**
   * 获取文件名
   * @param {string} template - 模板路径
   * @param {object} genTable - 表信息
   * @return {string} 文件名
   */
  static getFileName(template, genTable) {
    let fileName = '';
    const packageName = genTable.packageName;
    const moduleName = genTable.moduleName;
    const className = genTable.className;
    const businessName = genTable.businessName;

    if (template.includes('controller.js.vm')) {
      fileName = `app/controller/${moduleName}/${businessName}.js`;
    } else if (template.includes('service.js.vm')) {
      fileName = `app/service/${moduleName}/${businessName}.js`;
    } else if (template.includes('mapper.xml.vm')) {
      fileName = `mapper/mysql/ruoyi/${className}Mapper.xml`;
    } else if (template.includes('sql.vm')) {
      fileName = `sql/${businessName}Menu.sql`;
    } else if (template.includes('api.js.vm')) {
      fileName = `api/${moduleName}/${businessName}.js`;
    } else if (template.includes('index.vue.vm')) {
      fileName = `views/${moduleName}/${businessName}/index.vue`;
    } else if (template.includes('index-tree.vue.vm')) {
      fileName = `views/${moduleName}/${businessName}/index.vue`;
    }
    
    return fileName;
  }

  /**
   * 获取包前缀
   * @param {string} packageName - 包名称
   * @return {string} 包前缀
   */
  static getPackagePrefix(packageName) {
    const lastIndex = packageName.lastIndexOf('.');
    return lastIndex !== -1 ? packageName.substring(0, lastIndex) : packageName;
  }

  /**
   * 获取导入列表
   * @param {object} genTable - 表信息
   * @return {array} 导入列表
   */
  static getImportList(genTable) {
    const columns = genTable.columns || [];
    const subGenTable = genTable.subTable;
    const importList = [];

    if (subGenTable) {
      importList.push('Array');
    }

    for (const column of columns) {
      if (!VelocityUtils.isSuperColumn(column.javaField) && 
          column.javaType === GenConstants.TYPE_DATE) {
        if (!importList.includes('Date')) {
          importList.push('Date');
        }
      }
    }

    return importList;
  }

  /**
   * 获取字典组
   * @param {object} genTable - 表信息
   * @return {string} 字典组
   */
  static getDicts(genTable) {
    const columns = genTable.columns || [];
    const dicts = new Set();
    
    VelocityUtils.addDicts(dicts, columns);
    
    if (genTable.subTable) {
      const subColumns = genTable.subTable.columns || [];
      VelocityUtils.addDicts(dicts, subColumns);
    }
    
    return Array.from(dicts).join(', ');
  }

  /**
   * 添加字典
   * @param {Set} dicts - 字典集合
   * @param {array} columns - 列集合
   */
  static addDicts(dicts, columns) {
    for (const column of columns) {
      if (!VelocityUtils.isSuperColumn(column.javaField) && 
          column.dictType &&
          [GenConstants.HTML_SELECT, GenConstants.HTML_RADIO, GenConstants.HTML_CHECKBOX].includes(column.htmlType)) {
        dicts.add(`'${column.dictType}'`);
      }
    }
  }

  /**
   * 获取权限前缀
   * @param {string} moduleName - 模块名
   * @param {string} businessName - 业务名
   * @return {string} 权限前缀
   */
  static getPermissionPrefix(moduleName, businessName) {
    return `${moduleName}:${businessName}`;
  }

  /**
   * 获取上级菜单ID
   * @param {object} paramsObj - 参数对象
   * @return {string} 上级菜单ID
   */
  static getParentMenuId(paramsObj) {
    if (paramsObj && paramsObj[GenConstants.PARENT_MENU_ID]) {
      return paramsObj[GenConstants.PARENT_MENU_ID];
    }
    return '3'; // 默认上级菜单为系统工具
  }

  /**
   * 获取树编码
   * @param {object} paramsObj - 参数对象
   * @return {string} 树编码
   */
  static getTreecode(paramsObj) {
    if (paramsObj && paramsObj[GenConstants.TREE_CODE]) {
      return GenUtils.toCamelCase(paramsObj[GenConstants.TREE_CODE]);
    }
    return '';
  }

  /**
   * 获取树父编码
   * @param {object} paramsObj - 参数对象
   * @return {string} 树父编码
   */
  static getTreeParentCode(paramsObj) {
    if (paramsObj && paramsObj[GenConstants.TREE_PARENT_CODE]) {
      return GenUtils.toCamelCase(paramsObj[GenConstants.TREE_PARENT_CODE]);
    }
    return '';
  }

  /**
   * 获取树名称
   * @param {object} paramsObj - 参数对象
   * @return {string} 树名称
   */
  static getTreeName(paramsObj) {
    if (paramsObj && paramsObj[GenConstants.TREE_NAME]) {
      return GenUtils.toCamelCase(paramsObj[GenConstants.TREE_NAME]);
    }
    return '';
  }

  /**
   * 获取展开按钮列序号
   * @param {object} genTable - 表信息
   * @return {number} 展开按钮列序号
   */
  static getExpandColumn(genTable) {
    const options = genTable.options;
    let paramsObj = {};
    if (options) {
      try {
        paramsObj = typeof options === 'string' ? JSON.parse(options) : options;
      } catch (e) {
        paramsObj = {};
      }
    }
    const treeName = paramsObj[GenConstants.TREE_NAME];
    let num = 0;
    
    for (const column of genTable.columns || []) {
      if (column.isList === '1') {
        num++;
        if (column.columnName === treeName) {
          break;
        }
      }
    }
    
    return num;
  }

  /**
   * 判断是否为基类字段
   * @param {string} javaField - 字段名
   * @return {boolean} 是否为基类字段
   */
  static isSuperColumn(javaField) {
    return GenConstants.BASE_ENTITY.includes(javaField) || 
           GenConstants.TREE_ENTITY.includes(javaField);
  }

  /**
   * 渲染模板
   * @param {string} template - 模板内容
   * @param {object} context - 上下文
   * @return {string} 渲染结果
   */
  static render(template, context) {
    try {
      // 使用 velocityjs 渲染模板
      const aster = new Velocity.Parser(template);
      const render = new Velocity.Compile(aster.parse());
      return render.render(context);
    } catch (error) {
      throw new Error(`模板渲染失败: ${error.message}`);
    }
  }
}

module.exports = VelocityUtils;

