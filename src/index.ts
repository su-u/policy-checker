import { request } from 'undici'
const jsdom = require('jsdom');
const fs = require('fs');
const { JSDOM } = jsdom;
const beautify = require('js-beautify');
import { SITES } from './sites';

// 整形オプション
// https://www.npmjs.com/package/js-beautify
const beautifyOptions = {
  indent_size: 2,
  end_with_newline: true,
  preserve_newlines: false,
  max_preserve_newlines: 0,
  wrap_line_length: 0,
  wrap_attributes_indent_size: 0,
  unformatted: ['b', 'em']
};

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
  dom.window.document.querySelectorAll('[data-log-in-required]').forEach((element: any) => element.removeAttribute('data-log-in-required'));
  dom.window.document.querySelectorAll('[data-page-title]').forEach((element: any) => element.removeAttribute('data-page-title'));
  dom.window.document.querySelectorAll('[data-no-access-page]').forEach((element: any) => element.removeAttribute('data-no-access-page'));
  dom.window.document.querySelectorAll('[data-help-search-page]').forEach((element: any) => element.removeAttribute('data-help-search-page'));

  dom.window.document.querySelectorAll('link').forEach((element: any) => element.remove());
  dom.window.document.querySelectorAll('script').forEach((element: any) => element.remove());

  const html = beautify.html(dom.window.document.querySelector('body').outerHTML, beautifyOptions);
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
    getSite(url, name);
   }
})();
