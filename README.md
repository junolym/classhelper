# classhelper 课堂助手 (new version)
Require `Node v8.0+`

## Online Version（supports Github Webhook）
[https://classhelper.ml](https://classhelper.ml) (user&pass: test)

## Install and Run MySQL
### install
Follow these instruments [Installing MySQL on Linux](https://dev.mysql.com/doc/refman/5.7/en/linux-installation.html)

### config
Edit `config.yml`

It's strongly recommended to read the whole config file and change the settings as you want.

MySQL config is required.
```yaml
host: ip or host
user: username
password: password
database: databasename
charset: utf8mb4_unicode_ci
```

## Install requirements and Run classhelper
### install requirements
```
$ npm install
```

### Linux or MacOS run (For debug)
```
$ DEBUG=classhelper:* npm start
```

### Windows run (For debug)
```
set DEBUG=classhelper:* & npm start
```

## Enjoy it
Open the address and port as you set in config file, default is `http://localhost:3000`, recommended with Google Chrome.

## Use as production
There are many ways to help you run this application as production.  
One of them is [forever](https://www.npmjs.com/package/forever)

Install it with npm run `npm install forever -g`.  
In classhelper's folder, run `forever -e error.log -o access.log start bin/www`.

The server will run in background and output the error log and access log to the files.

# 简体中文说明
## 在线版本 （支持 Github Webhooks）
[https://classhelper.ml](https://classhelper.ml) (用户名和密码: test)

## 安装和运行MySQL
### 安装
从这个教程学习 [Installing MySQL on Linux](https://dev.mysql.com/doc/refman/5.7/en/linux-installation.html)

### 配置
编辑 `dao/dao.js`

强烈建议你完整阅读配置文件，并修改其中你想要改变的设置。

MySQL配置是必需的
```yaml
host: ip or host
user: username
password: password
database: databasename
charset: utf8mb4_unicode_ci
```

## 安装依赖并运行“课堂助手”
### 安装依赖
```
$ npm install
```

### Linux 或 MacOS 执行 （debug模式）
```
$ DEBUG=classhelper:* npm start
```

### Windows 执行 （debug模式）
```
set DEBUG=classhelper:* & npm start
```

## 开始使用
打开你设置的监听地址和端口，默认是`http://localhost:3000`, 建议使用 Google Chrome.


## 作为产品使用
有许多方法可以让你运行这个应用，作为一个产品而不是调试模式。  
其中一个是 [forever](https://www.npmjs.com/package/forever)

用npm安装它，执行 `npm install forever -g`.  
在本应用的根目录，执行 `forever -e error.log -o access.log start bin/www`.

服务会在后台启动，并将错误记录和访问记录保存到文件。
