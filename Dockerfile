FROM node:18

WORKDIR /usr/src/app/YOUR_PROJECT_NAME

# 添加 cnpm 镜像
RUN npm config set registry https://registry.npmmirror.com

# 安装依赖
RUN npm i -g pnpm

RUN pnpm config set registry https://registry.npmmirror.com

# 复制代码到工作区
COPY . .

RUN pnpm i

# 编译线上版本
RUN pnpm run build

# 挂载本地文件
VOLUME /home/web

EXPOSE 3000

# 启动
CMD ["pnpm", "run", "start:prod"]