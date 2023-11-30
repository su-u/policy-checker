const jsdom = require('jsdom');
const {JSDOM} = jsdom;
import { request, writeFile, format } from './util';
import { SITES } from './sites';

const removeUnnecessaryDom = (dom: any) => {
  const remove = (selectors: string) => {
    dom.window.document.querySelectorAll(`[${selectors}]`).forEach((element: HTMLElement) => element.removeAttribute(`${selectors}`));
  }


  // Attribute
  const removeAttributes = [
    'data-json-str',
    'data-log-in-required',
    'data-page-title',
    'data-no-access-page',
    'data-help-search-page',
    'data-links-json',
    'aria-labelledby',
    'aria-controls',
    'data-analytics-component',
    'data-icon-chevron-down',
    'data-icon-search',
    'id',
    'value',
    'class',
    'data-value',
    'action',
    '',
    '',
    '',
    '',
  ];
  removeAttributes.forEach((selector: string) => remove(selector));


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
  console.log(dom.window.document.querySelectorAll('body'));
    // .map((x: HTMLElement) => Object.values(x.attributes).filter(x => x.name.match(/data-*/)).forEach((x: any) =>
    //   dom.window.document.querySelectorAll(`${x}`).forEach((element: HTMLElement) => element.removeAttribute(`${x}`))
    // ));

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
