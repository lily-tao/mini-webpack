(function(modules){
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
        require('./src/index.js')
    })({"./src/index.js":{"dependencies":{"./a.js":"./src/a.js"},"code":"\"use strict\";\n\nvar _a = require(\"./a.js\");\n\n/*\n * @Description: Description\n * @Author: lily\n * @Date: 2022-02-09 17:25:46\n */\nconsole.log(\"hellow \".concat(_a.a));"},"./src/a.js":{"dependencies":{"./b.js":"./src/b.js"},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.a = void 0;\n\nvar _b = require(\"./b.js\");\n\n/*\n * @Description: Description\n * @Author: lily\n * @Date: 2022-02-09 17:25:53\n */\nvar a = 'aaa' + _b.b;\nexports.a = a;"},"./src/b.js":{"dependencies":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.b = void 0;\n\n/*\n * @Description: Description\n * @Author: lily\n * @Date: 2022-02-09 17:25:59\n */\nvar b = 'bbbb';\nexports.b = b;"}})