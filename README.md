<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Description

A nest.js starter with MongoDB and some feature.

## Project setup

### requirement

- nodejs V20

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Structure

└── src
    ├── common                          # 公共资源
    │   ├── constants                   # 常量
    │   ├── decorator                   # 一些装饰器
    │   ├── interceptor                 # nesejs 的拦截器
    │   ├── interface                   # 公共的类型、接口定义
    │   └── libs                        # 公共函数封装
    │       ├── common                  # 通用函数
    │       ├── concurrency             # 并发相关
    │       ├── date                    # 日期相关
    │       ├── qiniu                   # 七牛云存储
    │       └── save-image              # 本地图片保存
    ├── config                          # 配置文件
    ├── database                        # 数据库
    │   ├── providers                   # 数据库用到的一些 provider 封装
    │   └── tables                      # 数据表
    └── modules                         # nestjs 模块
        ├── auth                        # 鉴权
        │   └── interface               # 鉴权相关接口定义
        ├── file                        # 文件
        ├── static                      # 静态资源托管
        └── user                        # 用户模块
            ├── dto
            └── interface

## Feature

### web 文件托管

1. 默认会将 ./web 目录下的文件托管到服务的 /web 路径上，详见静态资源托管模块。
2. 可以在配置文件中修改 web 目录的路径。

### 七牛云存储

使用步骤如下：
1. 在 `config/config.base.yaml` 下配置七牛云的 ak、sk
2. 在 `config/config.(dev|prod).yaml` 下配置 scope、host
  a. scope: 对应的bucket名
  b. host: 文件 cdn 的域名
3. 调用 `src/common/libs/qiniu` 中封装的 `uploadFile()` 上传即可

### MongoDB

使用步骤如下：
1. 在 `config/config.*.yaml` 下配置数据库的 host、user、password 等信息。可参考config中的示例
2. 在 `src/database/tables` 下定义表 Schema，导出一个 ITable 即可
  a. 支持添加自增id，设置counter即可
3. 支持多数据库，见 `src/database/db.providers.ts` 中的配置
  a. 使用多数据库时，在 table 中设置不同的 database provide 即可


### Docker Deploy

1. 支持 docker 部署，部署脚本封装在 `deploy.sh` 中，修改内部的挂载目录、服务名称、暴露的端口等即可。
2. 生产环境部署前，注意修改 Dockerfile 中的 WORKDIR。
3. 在生产环境服务器中，执行 `sh deploy.sh` 即可部署在 docker 中。

### HTTPS

1. 证书文件保存在 `src/assets/https` 文件夹下
2. 可以在 `config` 中配置 `enableHttps` 来开启或关闭 https
3. https 具体逻辑在 `main.ts` 中

