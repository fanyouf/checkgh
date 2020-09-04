# checkgh
一个简单的爬虫系统。

获取指定帐号的github/gitee 的提交情况



步骤

1. 添加地址信息。在namelist中，类似添加其它人的信息

   ```
   [
     {"nickname":"凡","userName":"fanyoufu2"},
   ]   
   ```

2. 爬取数据

   ```
   node app.js
   ```

3.查看数据

```
node server.js
```

打开浏览器http://localhost:3000

