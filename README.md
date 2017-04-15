# classhelper
## Created by [express-generator](http://expressjs.com/en/starter/generator.html)
```
# npm install express-generator -g
$ express --view=hbs --git classhelper
```

## Install and Run
node_modules文件夹不包括在项目文件中（gitignore），pull下来后需要执行`npm install`安装依赖。
### install
```
$ npm install
```

### Linux or MacOS run
```
$ DEBUG=classhelper:* npm start
```

### Windows run
```
set DEBUG=classhelper:* & npm start
```

## Mongodb (run before app)
Mongodb configuration file: data/mongodb.conf
dbpath data/db
```
$ mongod --config data/mongodb.conf
```

## 注意事项
### 【重要】使用npm安装第三方包
项目中使用到的包，应该使用以下方式安装（使用--save将自动把这个包添加到package.json的依赖库。
```
$ npm install <package name> --save
```

