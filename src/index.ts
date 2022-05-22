import { request } from 'undici'
const jsdom = require('jsdom');
const fs = require('fs');
const { JSDOM } = jsdom;
const format = require('html-format');
import { SITES } from './sites';


const writeFile = (path: string, data: string) => {
  fs.writeFile(path, data, function (err: any) {
    if (err) {
      console.error(err);
      throw err;
    }
  });
};

const writeHTML = (text: string, name: string) => {
  const dom = new JSDOM(text);
  dom.window.document.querySelectorAll('[data-json-str]').forEach((element: any) => element.removeAttribute('data-json-str'));
  const html = format(dom.window.document.querySelector('body').outerHTML);
  writeFile(`${__dirname}/../dist/${name}`, html);
};

const getSite = async (url: string, name: string) => {
  const {
    statusCode,
    body
  } = await request(url)
  console.log(`${name}: ${statusCode}`);
  if (statusCode === 200) {
    writeHTML(await body.text(), name);
  }
};

(async () => {
   for (const { url, name } of SITES) {
    await getSite(url, name);
   }
})();
