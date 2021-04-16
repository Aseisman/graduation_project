const mysql =require('mysql')
const MYSQL_CONFIG=require('../config/database')


const pool =mysql.createPool(MYSQL_CONFIG)

const query=(sql,val)=>{
    return new Promise((resolve,reject)=>{
        pool.getConnection(function(err,connection){
            if(err){
                console.log("连接失败");
                reject(err)
            }else{
                connection.query(sql,val,(err,results,fields)=>{
                    if(err)reject(err)
                    else resolve(results)
                    connection.release()
                })
            }
        })
    })
}
const connectHandle =()=> new Promise((resolve,reject)=>{
    pool.getConnection(function(err,connection){
        if(err){
            console.log("连接失败");
            reject(err);
        }else{
            resolve(connection);
        }
    })
})
//同步事务
const executeTransaction = connection =>
    new Promise((resolve, reject) => {
        connection.beginTransaction(err => {
            if (err) {
                reject(err);
            } else {
                resolve(200);
            }
        });
    });
//同步sql
const executeSQL = (connection, sql) =>
    new Promise((resolve, reject) => {
        connection.query(sql, (err, results, fields) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
});

module.exports={
    query,
    connectHandle,
    executeTransaction,
    executeSQL
}