var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "tvpl"
});

function testmysql(){
    var sql = "INSERT INTO `agencies` (`id`, `name`, `created_at`, `updated_at`) VALUES ('1', '1', '2024-08-26 22:33:51', '2024-08-26 22:33:51');";

    con.query(sql, function(err, results) {
        if (err) throw err;
        console.log("results",results)
    });
}

testmysql()