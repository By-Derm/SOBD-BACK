const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { formatDate } = require('./formatDate');

const getAPMS  = async() => {
  const browser = await puppeteer.launch({ 
    executablePath: '/usr/bin/google-chrome', // Ajusta la ruta según tu sistema
    args: ['--no-sandbox', '--disable-setuid-sandbox']
   });

  try {
    const page = await browser.newPage();

  // Directorio donde se guardarán las descargas
  const downloadPath = path.resolve(__dirname, 'downloads');
  if (!fs.existsSync(downloadPath)) {
    fs.mkdirSync(downloadPath);
  }

  await page.goto('https://siselvis2017.com/arbyderm/m5g/main.php');

  // Ingresando al sistema Elvis
  await page.waitForSelector('#btnlogin'); 
  await page.type('#btnlogin', 'viviana.raindo');
  await page.type('#btnclave', 'vivi2018');
  await page.click('#button3');

  await page.waitForSelector('.fa-file-text-o');
  await page.click('.fa-file-text-o');


  // ir hacia contenido del iframe
  await page.goto('https://siselvis2017.com/arbyderm/resumenes/coberturas_xdia.php');



  //Obteniendo info de la tabla
  const titulo = await page.waitForSelector('#filtro > tbody > tr:nth-child(5) > td > input[type=submit]');

  titulo.click()

  const table = await page.waitForSelector('.tablasimple > thead > tr')
  
  const firstColumnsNames = await page.evaluate(table => {
    const columnas = Array.from(table.querySelectorAll('th'));
    return columnas.map(columna => columna.textContent);
  }, table);
  
  
  const tableDays = await page.waitForSelector('.tablasimple > thead > tr:nth-child(3)')
  const daysNames = await page.evaluate(tableDays => {
    const columnas = Array.from(tableDays.querySelectorAll('td'));
    return columnas.map(columna => columna.textContent);
  }, tableDays);

  const AllColumns = [...firstColumnsNames.filter(x=> x.length>0), ...daysNames.filter(x=> x.length>0) ]

  await page.waitForSelector('#contenido > div.fondogris > div > div > table > tfoot > tr:nth-child(6)')
  const tableContent = await page.waitForSelector('#contenido > div.fondogris > div > div > table > tbody');
  

  const content = await page.evaluate(tableContent => {
    const rows = tableContent.querySelectorAll('tr');
    return Array.from(rows).map(row => {
      const cells = row.querySelectorAll('td');
      return Array.from(cells).map(cell => cell.textContent.trim());
    });
  }, tableContent);

  const unprocessedData = [AllColumns, ...content.filter(x=>x.length > 0)]

const fechas = unprocessedData[0].filter(b=>b.includes('/'))

const processedData = []
for(let y = 1; y < unprocessedData.length; y++){
  fechas.forEach((fecha, i)=>{
     processedData.push([`${formatDate(fecha)}/${new Date().getFullYear()}`, unprocessedData[y][0], unprocessedData[y][i+12]])
  })
}
browser.close()

return(processedData);

  } catch (error) {
    console.log(error)
    browser.close()
  }
};


module.exports = {
  getAPMS,
};