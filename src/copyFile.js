const fs = require('fs.promises');
const _ = require('lodash')

const rootDir = '../datas'

function getSlug(string){
    const str = _.split(string,'/',10)[5]
    return str.slice(0,str.length - 12)
}

async function checkFileExit(fileName,slug,fileType){

    try {
        await fs.readFile(fileName)
        await fs.copyFile(fileName, `../files/${slug}.${fileType}`)
        return true
    } catch (error) {
        return false
    }

}

async function copyFile(){

    const folders = await fs.readdir(rootDir)

    folders.map(async (item) => {
        const json = require(`${rootDir}/${item}/general_information.json`)
        const slug = getSlug(json.link)

        // copy file pdf
        await checkFileExit(`${rootDir}/${item}/${slug}.pdf`,slug,'pdf')

        // copy file doc
        await checkFileExit(`${rootDir}/${item}/${slug}.doc`,slug,'doc')
    })

    console.log('im done')
}

copyFile()