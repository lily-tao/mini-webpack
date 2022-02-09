/*
 * @Description: Description
 * @Author: lily
 * @Date: 2022-02-09 17:26:48
 */
const fs = require('fs')
const path = require('path')
// 将模块代码解析为AST树
const parser = require('@babel/parser')
// 查询AST树中对应类型的节点，如模块导入节点ImportDeclaration
const traverse = require('@babel/traverse').default
// 使用@babel/core，@babel/preset-env等，转换为浏览器上可执行的代码，将ast转换为合适的代码格式
const { transformFromAst } = require('@babel/core')
module.exports = class webpack {
  constructor(options) {
    this.entry = options.entry
    this.output = options.output
    this.modules = []
  }
  run() {
    const info = this.parseFile(this.entry)
    //递归处理所有依赖
    this.modules.push(info)
    for (let i = 0; i < this.modules.length; i++) {
      const dependencies = this.modules[i].dependencies
      Object.values(dependencies).forEach(filePath => {
        this.modules.push(this.parseFile(filePath))
      })
    }
    // 修改数据结构 数组转对象
    const obj = {}
    this.modules.forEach((item) => {
      obj[item.moduleId] = {
        dependencies: item.dependencies,
        code: item.code,
      }
    })
    // 代码生成，文件生成
    this.bundleFile(obj)
  }
  /**
   * @description: 解析模块文件，分析依赖/处理内容
   * @param {string} filePath 文件路径，相对于根目录==》’./src/index.js‘
   * @return {object} 模块信息
   */  
  parseFile(filePath) {
    // 如何读取模块的内容
    const content = fs.readFileSync(filePath, 'utf-8')
    const ast = parser.parse(content, {
      sourceType: 'module',
    })
    const dependencies = {}
    traverse(ast, {
      ImportDeclaration({ node }) {
        const newPathName =
          './' + path.join(path.dirname(filePath), node.source.value)
        dependencies[node.source.value] = newPathName
      },
    })
    const { code } = transformFromAst(ast, null, {
      presets: ['@babel/preset-env'],
    })
    return {
      moduleId: filePath,
      dependencies,
      code,
    }
  }
  /**
   * @description: 文件生成
   * @param {object} modules 模块集合
   */  
  bundleFile(modules) {
    console.log(modules)
    const modulesStr = JSON.stringify(modules)
    // 生成 bundle代码
    const content = `(function(modules){
        function require(module){
            function newRequire(relativePath){
              return require(modules[module].dependencies[relativePath])
            }    
            var exports = {};
            (function(require,exports,code){
                eval(code)
            })(newRequire,exports,modules[module].code)
            return exports
        }
        require('${this.entry}')
    })(${modulesStr})`

    const filePath = path.join(this.output.path, this.output.filename)
    fs.writeFileSync(filePath, content, 'utf-8')
  }
}
