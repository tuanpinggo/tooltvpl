const fs = require('fs.promises');
const _ = require('lodash')
const cheerio = require('cheerio');

const rootDir = '../datas'

const begin = 0
const end = 100

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
        let doc_pdf = checkpdf ? `https://cdn.luatphapvietnam.org/van-ban/${slug}.pdf` : ""
        let doc_word = checkDoc ? `https://cdn.luatphapvietnam.org/van-ban/${slug}.doc` : ""

        const result = JSON.stringify({
            id,
            law_id,
            title,
            slug,
            description: description || "",
            content,
            doc_pdf,
            doc_word,
            created_at:'2024-08-24 21:25:17', 
            updated_at:'2024-08-24 21:25:17'
        })

        await fs.appendFile('./doc.txt',result + ',')
    }

    console.log('done')

}

getDoc()