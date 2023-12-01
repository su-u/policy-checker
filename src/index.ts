const jsdom = require('jsdom');
const {JSDOM} = jsdom;
import { request, writeFile, format } from './util';
import { SITES } from './sites';

const removeUnnecessaryDom = (dom: any) => {
  const remove = (selectors: string) => {
    dom.window.document.querySelectorAll(`[${selectors}]`).forEach((element: HTMLElement) => element.removeAttribute(`${selectors}`));
  }

  // Attribute
  [
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
    'data-twtr-scribe-section',
    'data-icon-chevron-right',
    'data-icon-close',
    'data-root-page-title',
    'data-bg-color',
    'id',
    'value',
    'class',
    'data-value',
    'action',
    'data-icon-arrow-left',
    'data-i-left',
    'data-twtr-scribe-element',
    'data-twtr-scribe-component',
    'data-icon-search-submit',
    'xmlns',
    'aria-hidden',
    'data-scribe-element',
    'data-search-query-type',
    'data-scribe-section',
    'data-analytics-section',
    'data-analytics-element',
    'data-search-query-key',
    'data-search-placeholder',
    'data-home-path',
    'autocomplete',
    'data-left-nav-items',
    'data-dtc-rebrand-on',
    'style',
    'd',
    'viewBox',
    'role',
    'data-search-enabled',
    'data-right-nav-items',
    'xmlns:xlink',
    'xml:space',
    'focusable',
    'data-cta-enabled',
    'data-cta-link-new-tab',
    'width',
    'height',
    'data-external',
    'autocorrect',
    'autocapitalize',
    'data-analytics-page',
    'target',
    'opacity',
    'data-choose-text',
    'data-back-text',
    'aria-label',
    'data-chevron-svg',
    'data-breadcrumbs-json',
    'data-theme-color',
    'type',
    'data-profile-enabled',
    'data-cta-text',
    'data-ellipses-svg',
    'data-trending-svg',
    'data-enable-anchor-links',
    'data-tag',
    'data-enable-all-articles',
    'data-referrer',
    'data-click-area',
    'aria-modal',
    'data-search-page',
    'data-cta-link',
    'x',
    'y',
    'data-search-path',
    'data-theme',
    'placeholder',
    'xlink:href',
    'version',
    'data-bg',
    'data-cname',
    'data-page-path',
    'data-privacy-config',
    'data-help-feedback-form-id',
    'data-testid',
    'frameborder',
    'dir',
    'cellspacing',
    'cellpadding',
    'layout',
    'share',
    'allowfullscreen',
    'marginwidth',
    'marginheight',
    'scrolling',
  ].forEach((selector: string) => remove(selector));

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
