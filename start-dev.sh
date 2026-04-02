#!/bin/bash

# ShopEase 一键启动脚本
# 该脚本同时启动 MongoDB、服务器和客户端

set -e

echo "🚀 ShopEase 启动中..."
echo ""

# 检查 MongoDB 是否运行
echo "📦 检查 MongoDB..."
if ! pgrep -x "mongod" > /dev/null; then
  echo "⚠️  MongoDB 未运行，尝试启动..."
  
  if command -v mongod &> /dev/null; then
    # 使用 Homebrew 启动
    brew services start mongodb-community 2>/dev/null || {
      echo "❌ 无法使用 brew 启动 MongoDB"
      echo "请手动运行: brew install mongodb-community && brew services start mongodb-community"
      exit 1
    }
    echo "✅ MongoDB 已启动"
  else
    echo "❌ 未检测到 MongoDB"
    echo "请安装: brew install mongodb-community"
    exit 1
  fi
else
  echo "✅ MongoDB 已运行"
fi

echo ""
echo "📡 启动服务器和客户端..."
echo ""

# 在后台启动服务器
cd server
npm run dev > /tmp/server.log 2>&1 &
SERVER_PID=$!
echo "✅ 服务器已启动 (PID: $SERVER_PID)"

# 等待服务器启动
sleep 3

# 在后台启动客户端
cd ../client
npm run dev > /tmp/client.log 2>&1 &
CLIENT_PID=$!
echo "✅ 客户端已启动 (PID: $CLIENT_PID)"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 ShopEase 启动完成！"
echo ""
echo "📍 应用地址："
echo "   客户端: http://localhost:5173/"
echo "   服务器: http://localhost:5000/"
echo ""
echo "📜 日志文件："
echo "   服务器: /tmp/server.log"
echo "   客户端: /tmp/client.log"
echo ""
echo "⚠️  按 Ctrl+C 停止所有服务"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 保持脚本运行并监听 Ctrl+C
trap "kill $SERVER_PID $CLIENT_PID 2>/dev/null; echo ''; echo '✋ 已停止所有服务'; exit 0" SIGINT

# 等待进程
wait
