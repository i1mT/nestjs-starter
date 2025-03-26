# 使用前更新 docker 挂载路径 和 SERVER_NAME

# 构建 SERVER_NAME 镜像
docker build -t SERVER_NAME . \
  --platform linux/amd64

# 停止 SERVER_NAME 容器
docker stop SERVER_NAME-server

# 删除 SERVER_NAME 容器
docker rm SERVER_NAME-server

# 使用 SERVER_NAME 镜像创建名称为 SERVER_NAME-server 的容器
# 将宿主机的 80 的端口映射到本机 6003 端口
# 将宿主机的 /LOCAL_PATH/web 挂载到容器的 /home/web 上
docker run \
  -v /LOCAL_PATH/web:/home/web \
  --name SERVER_NAME-server \
  -p 6003:80 \
  -d SERVER_NAME

# stop
# pm2 stop SERVER_NAME-server
