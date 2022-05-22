import { request } from 'undici'
import { SITES } from './sites';
const jsdom = require('jsdom');
const fs = require('fs');
const { JSDOM } = jsdom;


const writeFile = (path: string, data: string) => {
  fs.writeFile(path, data, function (err: any) {
    if (err) {
      console.error(err);
      throw err;
    }
  });
};

const getSite = async (url: string, name: string) => {
  const {
    statusCode,
    body
  } = await request(url)
  console.log(`${name}: ${statusCode}`);
  if (statusCode === 200) {
    const dom = new JSDOM(await body.text());
    writeFile(`${__dirname}/../dist/${name}`, dom.window.document.querySelector('body').outerHTML);
  }
}

(async () => {
   for (const { url, name } of SITES) {
    await getSite(url, name);
   }
})();
