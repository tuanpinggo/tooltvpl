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

const begin = 0
const end = 999

function getSlug(string){
    const str = _.split(string,'/',10)[5]
    return str.slice(0,str.length - 12)
}

async function getContent(item){
    const noidungFile = await fs.readFile(`${rootDir}/${item}/nộidung.html`)
    const $ = cheerio.load(noidungFile)
    const content = $('.content1').html()

    // nho repeat sau

    return content
}

async function getDescription(item){
    const noidungFile = await fs.readFile(`${rootDir}/${item}/thuộctính.html`)
    const $ = cheerio.load(noidungFile)
    const content = $('.Tomtatvanban').html()

    // nho repeat sau
    
    return content
}

async function checkFileExit(fileName,slug,fileType){

    try {
        await fs.readFile(fileName)
        return true
    } catch (error) {
        return false
    }

}

async function getDoc(){

    const folders = await fs.readdir(rootDir)

    for (let i = begin;i < end; i ++){

        const item = folders[i]
        const key = i

        const json = require(`${rootDir}/${item}/general_information.json`)

        let slug = getSlug(json.link)

        const checkpdf = await checkFileExit(`${rootDir}/${item}/${slug}.pdf`,slug,'pdf')
        const checkDoc = await checkFileExit(`${rootDir}/${item}/${slug}.doc`,slug,'doc')
        
        let id = begin + key + 1
        let law_id = json.law_id
        let title = json.title
        
        let description = await getDescription(item)
        // let content = ""
        let content = await getContent(item)
        let doc_pdf = checkpdf ? `https://cdn.luatphapvietnam.org/van-ban/${slug}.pdf` : null
        let doc_word = checkDoc ? `https://cdn.luatphapvietnam.org/van-ban/${slug}.doc` : null

        content = _.trim(content)
        content= content.replaceAll(/(\r\n|\n|\r)/gm, "")
        content= content.replaceAll(`"`, `'`)

        const result = `${id},${law_id},'${title}','${slug}','${description}',"${content}","${doc_pdf}",'${doc_word}','2024-08-24 21:25:17','2024-08-24 21:25:17'`

        var sql = "INSERT INTO docs (`id`, `law_id`, `title`, `slug`,`description`,`content`,`doc_pdf`,`doc_word`,`created_at`, `updated_at`) VALUES ("+result+");";

        con.query(sql, function(err, results) {
            if (err) throw err;
            console.log("results",results)
            return
        });
    }

    console.log('done')

}

getDoc()