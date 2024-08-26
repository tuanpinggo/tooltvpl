const fs = require('fs.promises');
const _ = require('lodash')
const cheerio = require('cheerio');

var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "tvpl"
});


// config
const rootDir = '../datas'
const docTxt = './diagram.txt'

const begin = 0
const end = 100

async function getluocdo(item,doc_id){
    const luocdoFile = await fs.readFile(`${rootDir}/${item}/lượcđồ.html`)
    const $ = cheerio.load(luocdoFile)

    let result = [];

    $(".ghd")?.each(function(i, elem) {

        let title = _.trim($(this).text())

        if(title.indexOf('đang xem') > 0){
            title = "Văn bản hiện tại"
        }

        let content = $(this).next().html()

        content = _.trim(content)
        content= content.replaceAll(/(\r\n|\n|\r)/gm, "")
        content= content.replaceAll(`"`, `'`)

        const result = `'${title}',"${content}",'${doc_id}','2024-08-24 21:25:17','2024-08-24 21:25:17'`

        var sql = "INSERT INTO doc_diagrams (`title`, `content`, `doc_id`,`created_at`, `updated_at`) VALUES ("+result+");";

        con.query(sql, function(err, results) {
            if (err) throw err;
            console.log("results",results)
            return
        });
    });



    console.log("done")
}


async function getDiagram(){
    const folders = await fs.readdir(rootDir)

    for (let i = begin;i < end; i ++){
        const item = folders[i]
        const key = i
        let id = begin + key + 1
        await getluocdo(item,id)
    }
}

getDiagram()