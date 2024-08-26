const fs = require('fs.promises');
const _ = require('lodash')
const cheerio = require('cheerio');

// config
const rootDir = '../data'
const docTxt = './attribute.txt'

const begin = 0
const end = 2

async function getluocdo(item,doc_id){
    const luocdoFile = await fs.readFile(`${rootDir}/${item}/thuộctính.html`)
    const $ = cheerio.load(luocdoFile)

    let num_code;
    let agency_id;
    let effect;
    let type;
    let is_outstanding;
    let date_issued;
    let date_effective;
    let date_published;
    let sign_person_id;
    let status_id;
    let num_gazette;
    let created_at;
    let updated_at;

    $("table td")?.each(function(i, elem) {
        if(i == 1) num_code = _.trim($(this).text())
        if(i == 6) agency_id = _.trim($(this).text())
        if(i == 4) type = _.trim($(this).text())
        if(i == 11) date_issued = _.trim($(this).text())
        if(i == 14) date_effective = _.trim($(this).text())
        if(i == 16) date_published = _.trim($(this).text())
        if(i == 9) sign_person_id = _.trim($(this).text())
        if(i == 22) status_id = _.trim($(this).text())
    });

    const result = doc_id + "," + num_code + "," + agency_id + "," +effect + "," + type+ "," + is_outstanding+ "," +date_issued + "," +date_effective + "," +date_published + "," +sign_person_id + "," +status_id + "," +num_gazette + "," +created_at+ "," +updated_at+ '\n'

    await fs.appendFile(docTxt,result)


}

async function getAttribute(){
    const folders = await fs.readdir(rootDir)

    for (let i = begin;i < end; i ++){
        const item = folders[i]
        const key = i
        let id = begin + key + 1

        await getluocdo(item,id)
    }
}

getAttribute()