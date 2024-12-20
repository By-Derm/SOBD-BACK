const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const { readXLXSVisitsAndComments } = require("./readxlsxVisitsAndComments");

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
  fs.readdir('./downloads', async(err, files) => {
    if (err) {
        console.error('Error leyendo la carpeta:', err);
        return;
    }
    const filePath = path.resolve(`${__dirname}/downloads`, files[0]);

   const info = await readXLXSVisitsAndComments(filePath)
    fs.unlink(filePath, (err)=>console.log(err));
    resolve(info)
});



}, 10000)
  })
}



const getVisitsAndComments = async (month, year) => {
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', // Ajusta la ruta según tu sistema
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

  await page.waitForSelector(".fa-wrench");
  await page.click(".fa-wrench");

  
  await page.waitForSelector("#contenido > div.fondogris > div:nth-child(1) > div");
  await page.click("#contenido > div.fondogris > div:nth-child(1) > div");

  await page.goto('https://siselvis2017.com/arbyderm/_detalle_visitas.php', { timeout: 120000 })

  await page.waitForSelector("#filtro > tbody > tr:nth-child(11) > td:nth-child(2) > input[type=button]:nth-child(1)");
  await page.click("#filtro > tbody > tr:nth-child(11) > td:nth-child(2) > input[type=button]:nth-child(1)");

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
  getVisitsAndComments
}

