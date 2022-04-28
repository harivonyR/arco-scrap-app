const puppeteer = require('puppeteer');
//const login = require('./user');
const {saveToCsv,csvToXls,freeBtachFile} = require('./file');
const {login} = require('./pageCheck')
//const sleep = require('./helper');
const fs = require ('fs');
//const login = require('./user');
// const login = require('./user');

// DATA
//let link = 'https://service.europe.arco.biz/ktmthinclient/Validation.aspx';
var browser;
var page;

async function createBrowser(){
    const browser = await puppeteer.launch({
        ignoreHTTPSErrors: true,
        headless: true,
        devtools: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    console.log('[👍] browser .. ');
    return browser
}

async function createPage(browser){
    const page = await browser.newPage();
    console.log('[👍] new page created  ..');
    return page
}

/* Login at the first time */
async function firstLogin(){
    await page.goto('https://service.europe.arco.biz/ktmthinclient/ValidationLogin.aspx')   // page navigate to the main page
        .then(async ()=>{
            console.log('[👍] Login page opened')
            await login(page)                                                               // fill credential for login
        })
        .catch((e)=>console.log("[i] Go to Login page error :: "+e))
}

/* RESTART browser */
const restartBrowser = async()=>{
    try{
        await browser.close()               // try to close last used browser
    }
    catch(e){                               // there is no browser to close
        console.log("[i] error on browser close :: browser already undefined")
    }
    finally{                                // in any case,     
        browser = await createBrowser()     // create a browser
        page = await createPage(browser)    // create a page
        await firstLogin(page)              // do the login
    }
}

/* DATA FETCH from arco-site */
async function fetchData(){

    // RUN puppeteer
    // await sessionExpired(page)
    //     .then(async(expired)=>{
    //         if(expired===true){
    //             await restartBrowser()
    //             //await login(page)
    //             console.log("[👍] handle seesion expired")
    //         }
    //         else if(expired===false){
    //             console.log("[👍] session not expired")
    //         }
    //         else
    //             console.log('[x] Error handling promise resolve bool on session expired')
            
    //     })
    //     .catch((e)=>console.log("ERR catch sessionExpiored"))
    
    try{
        await page.goto('https://service.europe.arco.biz/ktmthinclient/Validation.aspx')
        .then(()=>console.log("[👍] validation page opened"))
        .catch((e)=>console.log('Goto validation Fail page'))
    
        // Wait for table selector before scraping
        await page.waitForSelector('.x-grid3-row-table tr',{visible:true,timeout: 5000})
            .then(()=>console.log('Selector ok'))
    

    let rows = await page.evaluate(
            ()=> Array.from(window.document.querySelectorAll('.x-grid3-row-table tr'))
            .map((row,i)=>{
                let data = {
                    index : i+1,
                    batch : row.querySelector('div.x-grid3-col-name').innerText,
                    priority : row.querySelector('div.x-grid3-col-0').innerText,
                    client : row.querySelector('div.x-grid3-col-batchType').innerText,
                    document : row.querySelector('div.x-grid3-col-6').innerText,
                    date : row.querySelector('div.x-grid3-col-2').innerText,
                    status : row.querySelector('div.x-grid3-col-status').innerText
                }
                return data
            })
    )
            
    rows = rows.filter((e)=>e.status=="Ready")      // Record only ready data
    console.log("Total file scraped "+rows.length)  // Log the data length

    /* Saving file */
        await freeBtachFile()           // delete last batch file saved
        await saveToCsv(rows,'batch');  // await csv file before conversion
        csvToXls('batch');

        return (rows);
    }
    catch(e){                           // error unhandeled
        console.log("validation page not reached :: "+e)
        await restartBrowser()
        return []
    }
}

module.exports = {fetchData,restartBrowser}