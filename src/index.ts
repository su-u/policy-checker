const jsdom = require('jsdom');
const {JSDOM} = jsdom;
import { request, writeFile, format } from './util';
import { SITES } from './sites';

const removeUnnecessaryDom = (dom: any) => {
  // Attribute
  dom.window.document.querySelectorAll('[data-json-str]').forEach((element: HTMLElement) => element.removeAttribute('data-json-str'));
  dom.window.document.querySelectorAll('[data-log-in-required]').forEach((element: HTMLElement) => element.removeAttribute('data-log-in-required'));
  dom.window.document.querySelectorAll('[data-page-title]').forEach((element: HTMLElement) => element.removeAttribute('data-page-title'));
  dom.window.document.querySelectorAll('[data-no-access-page]').forEach((element: HTMLElement) => element.removeAttribute('data-no-access-page'));
  dom.window.document.querySelectorAll('[data-help-search-page]').forEach((element: HTMLElement) => element.removeAttribute('data-help-search-page'));
  dom.window.document.querySelectorAll('[data-links-json]').forEach((element: HTMLElement) => element.removeAttribute('data-links-json'));
  dom.window.document.querySelectorAll('[aria-labelledby]').forEach((element: HTMLElement) => element.removeAttribute('aria-labelledby'));
  dom.window.document.querySelectorAll('[aria-controls]').forEach((element: HTMLElement) => element.removeAttribute('aria-controls'));
  dom.window.document.querySelectorAll('[id]').forEach((element: HTMLElement) => element.removeAttribute('id'));
  dom.window.document.querySelectorAll('[value]').forEach((element: HTMLElement) => element.removeAttribute('value'));
  dom.window.document.querySelectorAll('[class]').forEach((element: HTMLElement) => element.removeAttribute('class'));
  dom.window.document.querySelectorAll('[data-value]').forEach((element: HTMLElement) => element.removeAttribute('data-value'));
  dom.window.document.querySelectorAll('[action]').forEach((element: HTMLElement) => element.removeAttribute('action'));
  dom.window.document.querySelectorAll('img[data-src]').forEach((element: HTMLElement) => element.removeAttribute('data-src'));
  dom.window.document.querySelectorAll('[src]').forEach((element: HTMLElement) => {
    const src = element.getAttribute('src');
    src && element.setAttribute('src', src?.replace(/\?.*$/,""))
  });
  dom.window.document.querySelectorAll('[href]').forEach((element: HTMLElement) => {
    const href = element.getAttribute('href');
    href && element.setAttribute('href', href?.replace(/\?.*$/,""))
  });
  dom.window.document.querySelectorAll('img[src]').forEach((element: HTMLElement) => element.removeAttribute('src'));


  // Node
  dom.window.document.querySelectorAll('link').forEach((element: HTMLElement) => element.remove());
  dom.window.document.querySelectorAll('script').forEach((element: HTMLElement) => element.remove());
  dom.window.document.querySelectorAll('body > div > code').forEach((element: HTMLElement) => element.remove());
};

const writeHTML = (text: string, name: string) => {
  const dom = new JSDOM(text);

  removeUnnecessaryDom(dom);
  const html = format(dom.window.document.querySelector('body').outerHTML);
  writeFile(`${__dirname}/../html/${name}.html`, html);
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
