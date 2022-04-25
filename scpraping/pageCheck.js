const puppeteer = require('puppeteer')
const sleep = require('./helper')
const fs = require('fs')
require('dotenv').config()

// const dotenv = require ('dotenv')
// dotenv.config({path : '../config.env'})

// const userName = process.env.USER
// const passWord = process.env.PASSWORD
userName = process.env.USER
passWord = process.env.PASSWORD

//console.log(process.env.USER)

var session = {
    expired : false
}

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
/*
async function loadLogin(page){
    if(await sessionExpired()){
        await page.keyboard.press('Enter');
    }
    else{
        await page.goto('https://service.europe.arco.biz/ktmthinclient/ValidationLogin.aspx')
        console.log('[👍] login page opened !');
    }

} 
*/
/*
async function handleLogin(page){                         // login page
    console.log('[👍] handleLogin ');

    console.log('[👍] login page is openning ');

    await loadLogin(page)

    //await sleep(4000)
    await page.waitForSelector('#userName')
    await page.type('#userName',userName,{delai:50});
    //await sleep(3000)
    await page.waitForSelector('#userPassword')
    await page.type('#userPassword',passWord,{delai:50});
    await page.keyboard.press('Enter');
    
    sleep(5000)
    console.log('[👍] Login Done ! ');

    try{
        fs.unlinkSync(`./public/assets/login.png`);
    }catch(e){
        console.log(e)
    }

    //await page.screenshot({ path: './public/assets/login.png'});
}
*/
async function login(page){                         // login page
    console.log('[👍] login ready ');

    console.log('[👍] login page is openning ');
    //await page.goto('https://service.europe.arco.biz/ktmthinclient/ValidationLogin.aspx')

    //await sleep(4000)
    await page.waitForSelector('#userName')
    await page.type('#userName',userName,{delai:50});
    //await sleep(3000)
    await page.waitForSelector('#userPassword')
    await page.type('#userPassword',passWord,{delai:50});
    await page.keyboard.press('Enter');
    
    sleep(5000)
    console.log('[👍] Login Done ! ');

    try{
        fs.unlinkSync(`./public/assets/login.png`);
    }catch(e){
        console.log(e)
    }

    await page.screenshot({ path: './public/assets/login.png'});
}

module.exports = {login,sessionExpired}