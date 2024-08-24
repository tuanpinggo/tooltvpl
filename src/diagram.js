const fs = require('fs.promises');
const _ = require('lodash')
const cheerio = require('cheerio');

// config
const rootDir = '../data'
const docTxt = './diagram.txt'

const begin = 0
const end = 2

async function getluocdo(item,doc_id){
    const luocdoFile = await fs.readFile(`${rootDir}/${item}/lượcđồ.html`)
    const $ = cheerio.load(luocdoFile)

    let result = [];

    $(".ghd")?.each(function(i, elem) {

        let title = _.trim($(this).text())

        if(title.indexOf('đang xem') > 0){
            title = "Văn bản hiện tại"
        }

        result.push({
            title: _.trim($(this).text()),
            content: $(this).next().html(),
            doc_id: doc_id,
            created_at:'2024-08-24 21:25:17', 
            updated_at:'2024-08-24 21:25:17'
        });
    });

    await fs.appendFile(docTxt,JSON.stringify(result))


    console.log("done")
}


async function getDiagram(){
    const folders = await fs.readdir(rootDir)

    for (let i = begin;i < end; i ++){
        const item = folders[i]
        const key = i
        let id = begin + key + 1 + 2
        await getluocdo(item,id)
    }
}

getDiagram()