<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Description

A nest.js starter that provides encapsulation of common functions such as MongoDB, Docker, user authentication, Swagger, Docker, Qiniu Cloud, HTTPS, etc.

一个 nest.js 的初始化模板，提供了 MongoDB、Docker、用户鉴权、Swagger、Docker、七牛云、HTTPS 等常用功能的封装。

## Project setup

### requirement

- nodejs V20
- pnpm

### install depedencies

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

then visite: `http://localhost:8002`

## Structure

```
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
```

## Database

使用 mongodb 数据库。使用步骤如下：
1. 在 `config/config.*.yaml` 下配置数据库的 host、user、password 等信息。可参考 `config` 中的示例
2. 在 `src/database/tables` 下定义表 Schema，导出一个 ITable 即可
  - 支持添加自增id，设置counter即可
3. 支持多数据库，见 `src/database/db.providers.ts` 中的配置
  - 使用多数据库时，在 table 中设置不同的 database provide 即可
4. 支持自增id，在 `table` 中配置 `counterModel` 即可

## Feature

### http response 统一处理

1. 拦截器处理实现见 `src/common/interceptor/response.interceptor.ts`
2. 统一 swagger response 定义见：`src/common/decorator/swagger/content.ts` 中的 `ResponseDto`

### 用户鉴权

1. 默认支持 jwt 规范的用户鉴权
2. 提供 `@PublicRoute()` 装饰器用于无需鉴权的接口，example: `src/modules/user/user.controller.ts`
3. token payload、token expiretime 可以在 `src/modules/auth/auth.service.ts` 修改
4. 提供 `@GetUser()` 装饰器获取当前鉴权下的用户信息，example: `src/modules/user/user.controller.ts`

### Swagger

1. 在 `main.ts` 中配置了 `swagger` 生成
2. 访问 [localhost:8002/swagger](localhost:8002/swagger) 查看接口定义
3. dev环境下，生成了 [openapi](https://swagger.io/specification/) 规范的接口定义文件，保存在 `src/assets/open-api/my_server.openapi.json`
4. `swagger` 描述 `example` 可以参考 `src/modules/user/user.controller.ts`
5. 针对分页、泛型等场景，提供了对应的装饰器，定义：`src/common/decorator/swagger`，使用：`src/modules/todo-list/todo-list.controller.ts`
6. 对于生成的 openapi.json 文件，可以很方便地在前端用于生成ts类型定义，fetch 代码等。例如：hey-api，官网[使用教程](https://heyapi.dev/openapi-ts/get-started)

### web 静态文件托管

1. 默认会将 ./web 目录下的文件托管到服务的 /web 路径上，详见静态资源托管模块: `src/modules/static/static.module.ts`。
2. 可以在配置文件中修改 web 目录的路径: `webPath`。

### 七牛云存储

使用步骤如下：
1. 在 `config/config.base.yaml` 下配置七牛云的 ak、sk
2. 在 `config/config.(dev|prod).yaml` 下配置 scope、host
  - scope: 对应的bucket名
  - host: 文件 cdn 的域名
3. 调用 `src/common/libs/qiniu` 中封装的 `uploadFile()` 上传即可

### Docker Deploy

1. 支持 docker 部署，部署脚本封装在 `deploy.sh` 中，修改内部的挂载目录、服务名称、暴露的端口等即可。
2. 生产环境部署前，注意修改 Dockerfile 中的 WORKDIR。
3. 在生产环境服务器中，执行 `sh deploy.sh` 即可部署在 docker 中。

### HTTPS

1. 证书文件保存在 `src/assets/https` 文件夹下
2. 可以在 `config` 中配置 `feature.https` 来开启或关闭 https
3. https 具体逻辑在 `main.ts` 中

# TODO

- [x] 支持 swagger
- [x] swagger 生成前端fetch模板代码的方案，提供文档
- [ ] PM2 部署支持
- [ ] Prometheus 服务监控数据上报
