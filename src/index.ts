import { request, writeFile, format } from './util';
const jsdom = require('jsdom');
const {JSDOM} = jsdom;
import { SITES } from './sites';

const removeUnnecessaryDom = (dom: any) => {
  // Twitter
  dom.window.document.querySelectorAll('[data-json-str]').forEach((element: any) => element.removeAttribute('data-json-str'));
  dom.window.document.querySelectorAll('[data-log-in-required]').forEach((element: any) => element.removeAttribute('data-log-in-required'));
  dom.window.document.querySelectorAll('[data-page-title]').forEach((element: any) => element.removeAttribute('data-page-title'));
  dom.window.document.querySelectorAll('[data-no-access-page]').forEach((element: any) => element.removeAttribute('data-no-access-page'));
  dom.window.document.querySelectorAll('[data-help-search-page]').forEach((element: any) => element.removeAttribute('data-help-search-page'));

  // 不要タグ
  dom.window.document.querySelectorAll('link').forEach((element: any) => element.remove());
  dom.window.document.querySelectorAll('script').forEach((element: any) => element.remove());
};

const writeHTML = (text: string, name: string) => {
  const dom = new JSDOM(text);

  removeUnnecessaryDom(dom);
  const html = format(dom.window.document.querySelector('body').outerHTML);
  writeFile(`${__dirname}/../dist/${name}.html`, html);
};


const getSite = async (url: string, name: string) => {
  const {
    status,
    data,
  } = await request(url);

  console.log(`${name}: ${status}`);
  if (status === 200) {
    writeHTML(data, name);
  }
};

(async () => {
  for (const { url, name } of SITES) {
    getSite(url, name);
  }
})();
