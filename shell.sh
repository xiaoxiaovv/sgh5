#!/bin/bash
echo "上传文件开始啦"


# 将本地打包好的js文件上传到相应的位置
scp  www/release/framework.js root@172.16.190.2:/root/h5_xinwei/dist/release/
scp  www/release/templates.js root@172.16.190.2:/root/h5_xinwei/dist/release/

echo "上传文件结束咯"