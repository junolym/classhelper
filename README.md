# classhelper (Developing)

## 小纸条
### 【重要】使用npm安装第三方包
项目中使用到的包，应该使用以下方式安装（使用--save将自动把这个包添加到package.json的依赖库。
```
$ npm install <package name> --save
```


## Run Mongodb
自行安装Mongodb，在classhelper目录下执行
```
$ mongod --config data/mongodb.conf
```

## Install and Run classhelper
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

## Development process
### Created by [express-generator](http://expressjs.com/en/starter/generator.html) with [handlebarsjs](http://handlebarsjs.com/)
```
# npm install express-generator -g
$ express --view=hbs --git classhelper
```


