const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const { readXLXS } = require("./readxlsx");
const { getFirstDayOfMonth } = require("./fetFirstDayOfTheMonth");
const { getLastDayOfMonth } = require("./getLastDayOfTheMonth");


function waitForDownload(downloadPath) {
  return new Promise((resolve) => {
      const watcher = fs.watch(downloadPath, (eventType, filename) => {
          if (eventType === 'rename') {
              watcher.close();
              resolve(filename);
          }
      });
  });
}

const timeout = () => {
  return new Promise(async(resolve)=>{
    
    

setTimeout(async ()=>{
  const filePath = path.resolve(`${__dirname}/downloads`, 'SISTEMAELVIS.xlsx');

  const info = await readXLXS(filePath)

  fs.unlink(filePath, (err)=>console.log(err));
  resolve(info)

}, 10000)
  })
}



const getRecipes = async (month, year) => {
const browser = await puppeteer.launch({  
    executablePath: '/usr/bin/google-chrome', // Ajusta la ruta según tu sistema
args: ['--no-sandbox', '--disable-setuid-sandbox'], timeout: 120000 });

    try {
  const page = await browser.newPage();

  // Directorio donde se guardarán las descargas
  const downloadPath = path.resolve(__dirname, "downloads");
  if (!fs.existsSync(downloadPath)) {
    fs.mkdirSync(downloadPath);
  }
  const client = await page.target().createCDPSession();
  await client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: downloadPath
  });



  await page.goto("https://siselvis2017.com/arbyderm/m5g/main.php");

  // Ingresando al sistema Elvis
  await page.waitForSelector("#btnlogin");
  await page.type("#btnlogin", "viviana.raindo");
  await page.type("#btnclave", "vivi2018");
  await page.click("#button3");

  await page.waitForSelector(".fa-file-text-o");
  await page.click(".fa-file-text-o");

  await page.waitForSelector(".fa-pencil-square-o");
  await page.click(".fa-pencil-square-o");

  await page.evaluate(() => {
    localStorage.setItem(
      "cuponesbyshe",
      '{"fields":[{"dataField":"APM","area":"row","areaIndex":3,"expanded":true},{"dataField":"APMCARGA","area":"row","areaIndex":1,"expanded":true},{"dataField":"MEDICO","area":"row","areaIndex":4,"expanded":true},{"dataField":"FARMACIA","area":"row","areaIndex":2,"expanded":true},{"dataField":"CATEGORIA","area":"row","areaIndex":5,"expanded":true},{"dataField":"PRODUCTO","area":"row","areaIndex":6,"sortOrder":"asc","sortBySummaryField":"CANTIDAD"},{"dataField":"PERIODO","area":"column","areaIndex":0,"sortOrder":"desc"},{"dataField":"FECHA","area":"row","areaIndex":0,"expanded":true},{"dataField":"CANTIDAD","area":"data","areaIndex":0,"summaryType":"sum"},{"dataField":"CANTIDAD","area":"data","areaIndex":1,"summaryType":"sum","summaryDisplayMode":"percentOfColumnGrandTotal"}],"columnExpandedPaths":[],"rowExpandedPaths":[]}'
    );
  });

  await page.goto(
    "https://siselvis2017.com/arbyderm/tabla_dinamica/cupones_byderm.php", { timeout: 120000 }
  );

  const firstDay = getFirstDayOfMonth(year, month);
  const lastDay = getLastDayOfMonth(year, month);
  await page.evaluate((firstDay, lastDay) => {
    const selectFrom = document.evaluate("/html/body/div[1]/div/form/table/tbody/tr[3]/td/input[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    selectFrom.value = firstDay
    const selectTo = document.evaluate("/html/body/div[1]/div/form/table/tbody/tr[4]/td/input[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    selectTo.value = lastDay
  }, firstDay, lastDay);


  const titulo = await page.waitForSelector('#filtro > tbody > tr:nth-child(5) > td > input');
  await titulo.click()

  const downloadButton = await page.waitForSelector('.dx-icon-xlsxfile');
  await downloadButton.click()  

await waitForDownload(downloadPath);


const info = await timeout()
browser.close()

return info
        
    } catch (error) {

      console.log(error)
      browser.close()

    }
  
};

module.exports = {
  getRecipes,
}

