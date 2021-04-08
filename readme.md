操作index的命令：

创建index：
    node createindex.js --index indexname
删除index:
    node deleteindex.js --index indexname
创建index中doc：
    node createdoc.js --index indexname > logname 2>&1 &

现在更新index是必须删掉重建；

查询index信息的es命令：

culr -X GET "localhost:9200/_cat/indices";  -- 查看当前所有的index大小/doc个数等信息
culr -X GET "localhost:9200/_cat/indices/indexname?v=true&pretty";

culr -X GET "localhost:9200/indexname?pretty";  -- 查看index的配置信息

culr -X GET "localhost:9200/indexname/_search?pretty";  -- 查看默认前10个doc
culr -X GET "localhost:9200/indexname/_search?q={key:value}";