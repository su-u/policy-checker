import { default as axios } from 'axios';
const beautify = require('js-beautify');
// @ts-ignore
import fs from 'fs';

export const format = (html: string) => {
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


  return beautify.html(html, beautifyOptions);
}

export const request = async (url: string) => {
  const config = {
    headers: {
      'user-agent': 'curl/7.47.0',
    }
  }
  try {
    const res = await axios.get(url, config);
    const {
      status,
      data,
      headers,
    } = res;

    if (status !== 200) {
      console.log(headers);
      console.log(data);
    }


    return {
      status,
      data,
    }
  } catch (e: any) {
    console.error(e);
    throw e;
  }
}

export const writeFile = (path: string, data: string) => {
  fs.writeFile(path, data, function (err: any) {
    if (err) {
      console.error(err);
      throw err;
    }
  });
};