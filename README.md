# classhelper 课堂助手 (Developing)

## Online Version（supports Github Webhook）
[https://classhelper.ml](https://classhelper.ml) (user&pass: test)

## Install and Run MySQL
### install
Follow these instruments [Installing MySQL on Linux](https://dev.mysql.com/doc/refman/5.7/en/linux-installation.html)

### config
Edit `dao/dao.js` and put your MySql config hear.
```
var pool  = mysql.createPool({
    host: 'your.host',
    user: 'username',
    password: 'password',
    database: 'databasename',
    charset: 'utf8mb4_unicode_ci'
});
```

## Install requirements and Run classhelper
### install requirements
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

## Enjoy it
Open `http://localhost:3000`, recommended with Google Chrome.

The first account registered will be the administrator who has all permissions of the system.

It's strongly recommended to create a teacher's account as "standard account".


# 简体中文说明
## 在线版本 （支持 Github Webhooks）
[https://classhelper.ml](https://classhelper.ml) (用户名和密码: test)

## 安装和运行MySQL
### 安装
从这个教程学习 [Installing MySQL on Linux](https://dev.mysql.com/doc/refman/5.7/en/linux-installation.html)

### 配置
编辑 `dao/dao.js` 并将你的MySQL配置填入.
```
var pool  = mysql.createPool({
    host: '域名或ip',
    user: '用户名',
    password: '密码',
    database: 'databasename',
    charset: 'utf8mb4_unicode_ci'
});
```

## 安装依赖并运行“课堂助手”
### 安装依赖
```
$ npm install
```

### Linux 或 MacOS 执行
```
$ DEBUG=classhelper:* npm start
```

### Windows 执行
```
set DEBUG=classhelper:* & npm start
```

## 开始使用
打开 `http://localhost:3000`, 建议使用 Google Chrome.

第一个注册的账户将成为“超级管理员”，拥有系统的所有权限。

强烈建议将教师使用的账户创建成为“标准用户”。

