const mysql=require("mysql2/promise")
const pool=mysql.createPool({

    host:"localhost",
    user:"userName",
    password:"Password@123",
    database:"sch_core",
    waitForConnections:true,
    connectionLimit:10
})
module.exports=pool;