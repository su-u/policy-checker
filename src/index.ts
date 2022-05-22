import { request, writeFile, format } from './util';
const jsdom = require('jsdom');
const {JSDOM} = jsdom;
import { SITES } from './sites';

const removeUnnecessaryDom = (dom: any) => {
  // Attribute
  dom.window.document.querySelectorAll('[data-json-str]').forEach((element: any) => element.removeAttribute('data-json-str'));
  dom.window.document.querySelectorAll('[data-log-in-required]').forEach((element: any) => element.removeAttribute('data-log-in-required'));
  dom.window.document.querySelectorAll('[data-page-title]').forEach((element: any) => element.removeAttribute('data-page-title'));
  dom.window.document.querySelectorAll('[data-no-access-page]').forEach((element: any) => element.removeAttribute('data-no-access-page'));
  dom.window.document.querySelectorAll('[data-help-search-page]').forEach((element: any) => element.removeAttribute('data-help-search-page'));
  dom.window.document.querySelectorAll('[data-links-json]').forEach((element: any) => element.removeAttribute('data-links-json'));
  dom.window.document.querySelectorAll('[id]').forEach((element: any) => element.removeAttribute('id'));
  dom.window.document.querySelectorAll('[value]').forEach((element: any) => element.removeAttribute('value'));
  dom.window.document.querySelectorAll('[class]').forEach((element: any) => element.removeAttribute('class'));
  dom.window.document.querySelectorAll('[data-value]').forEach((element: any) => element.removeAttribute('data-value'));

  // Node
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
