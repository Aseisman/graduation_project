// var mysql=require('mysql')

// function createConnection(){
//         //获取配置
//         var config=require('config').get('db_config');
//         var opts={
//             host:config.get("host"),
//             database:config.get("database"),
//             port:config.get("port"),
//             user:config.get("user"),
//             password:config.get("password"),
//         };
//     var connection=mysql.createConnection({...opts});
//     return connection;
// }
// module.exports.createConnection=createConnection;


const mysql = require('mysql')

const mysqlConfig= {
    user: "root",
    password: "123456",
    database: "blog",
    host: "127.0.0.1",
    port: 3306
}

module.exports = mysqlConfig