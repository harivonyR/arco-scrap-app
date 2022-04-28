const puppeteer = require('puppeteer')
const sleep = require('./helper')
const fs = require('fs')
require('dotenv').config()

userName = process.env.USER
passWord = process.env.PASSWORD

//console.log(process.env.USER)

var session = {
    expired : false
}

/* check if session is expired */
async function sessionExpired(page){
    return await new Promise (async(resolve)=>{
        await page.waitForSelector('#ext-gen28',{timeout:4000})
        .then(()=>{
            resolve(true)
        })
        .catch((e)=>{
            console.log('ERR :::'+e)
            resolve(false)
        })
    })
}

/* LOGIN PAGE FILL */
async function login(page){                         // login page
    console.log('[👍] login ready ');


    //await sleep(4000)
    await page.waitForSelector('#userName')
    await page.type('#userName',userName,{delai:50});
    //await sleep(3000)
    await page.waitForSelector('#userPassword')
    await page.type('#userPassword',passWord,{delai:50});
    await page.keyboard.press('Enter');
    
    sleep(5000)
    console.log('[👍] Login Done ');

    // try{
    //     fs.unlinkSync(`./public/assets/login.png`);
    // }catch(e){
    //     console.log(e)
    // }
}

module.exports = {login,sessionExpired}