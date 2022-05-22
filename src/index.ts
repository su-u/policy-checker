import { request } from 'undici'
const jsdom = require('jsdom');
const fs = require('fs');
const { JSDOM } = jsdom;
const prettify = require('html-prettify');
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

  // 不要な差分削除
  dom.window.document.querySelectorAll('[data-json-str]').forEach((element: any) => element.removeAttribute('data-json-str'));
  dom.window.document.querySelectorAll('link').forEach((element: any) => element.remove());
  dom.window.document.querySelectorAll('script').forEach((element: any) => element.remove());

  const html = prettify(dom.window.document.querySelector('body').outerHTML);
  writeFile(`${__dirname}/../dist/${name}.html`, html);
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
