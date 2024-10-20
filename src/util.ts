import { default as axios } from "axios";
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const beautify = require("js-beautify");
// @ts-ignore
import fs from "fs";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36";

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
    unformatted: ["b", "em"],
  };

  return beautify.html(html, beautifyOptions);
};

export const request = async (url: string) => {
  const config = {
    headers: {
      "User-Agent": USER_AGENT,
    },
  };
  try {
    const res = await axios.get(url, config);
    const { status, data, headers } = res;

    if (status !== 200) {
      console.error(url, status, headers);
    }

    return {
      status,
      data,
    };
  } catch (e: any) {
    // console.error(e);
    throw e;
  }
};

export const writeFile = (path: string, data: string) => {
  fs.writeFile(path, data, function (err: any) {
    if (err) {
      console.error(err);
      throw err;
    }
  });
};

export const removeUnnecessaryDom = (dom: any) => {
  const remove = (selectors: string) => {
    dom.window.document
      .querySelectorAll(`[${selectors}]`)
      .forEach((element: HTMLElement) =>
        element.removeAttribute(`${selectors}`),
      );
  };

  // Attribute
  [
    "data-json-str",
    "data-log-in-required",
    "data-page-title",
    "data-no-access-page",
    "data-help-search-page",
    "data-links-json",
    "aria-labelledby",
    "aria-controls",
    "data-analytics-component",
    "data-icon-chevron-down",
    "data-icon-search",
    "data-twtr-scribe-section",
    "data-icon-chevron-right",
    "data-icon-close",
    "data-root-page-title",
    "data-bg-color",
    "id",
    "value",
    "class",
    "data-value",
    "action",
    "data-icon-arrow-left",
    "data-i-left",
    "data-twtr-scribe-element",
    "data-twtr-scribe-component",
    "data-icon-search-submit",
    "xmlns",
    "aria-hidden",
    "data-scribe-element",
    "data-search-query-type",
    "data-scribe-section",
    "data-analytics-section",
    "data-analytics-element",
    "data-search-query-key",
    "data-search-placeholder",
    "data-home-path",
    "autocomplete",
    "data-left-nav-items",
    "data-dtc-rebrand-on",
    "style",
    "d",
    "viewBox",
    "role",
    "data-search-enabled",
    "data-right-nav-items",
    "xmlns:xlink",
    "xml:space",
    "focusable",
    "data-cta-enabled",
    "data-cta-link-new-tab",
    "width",
    "height",
    "data-external",
    "autocorrect",
    "autocapitalize",
    "data-analytics-page",
    "target",
    "opacity",
    "data-choose-text",
    "data-back-text",
    "aria-label",
    "data-chevron-svg",
    "data-breadcrumbs-json",
    "data-theme-color",
    "type",
    "data-profile-enabled",
    "data-cta-text",
    "data-ellipses-svg",
    "data-trending-svg",
    "data-enable-anchor-links",
    "data-tag",
    "data-enable-all-articles",
    "data-referrer",
    "data-click-area",
    "aria-modal",
    "data-search-page",
    "data-cta-link",
    "x",
    "y",
    "data-search-path",
    "data-theme",
    "placeholder",
    "xlink:href",
    "version",
    "data-bg",
    "data-cname",
    "data-page-path",
    "data-privacy-config",
    "data-help-feedback-form-id",
    "data-testid",
    "frameborder",
    "dir",
    "cellspacing",
    "cellpadding",
    "layout",
    "share",
    "allowfullscreen",
    "marginwidth",
    "marginheight",
    "scrolling",
  ].forEach((selector: string) => remove(selector));

  dom.window.document
    .querySelectorAll("img[data-src]")
    .forEach((element: HTMLElement) => element.removeAttribute("data-src"));
  dom.window.document
    .querySelectorAll("[src]")
    .forEach((element: HTMLElement) => {
      const src = element.getAttribute("src");
      src && element.setAttribute("src", src?.replace(/\?.*$/, ""));
    });
  dom.window.document
    .querySelectorAll("[href]")
    .forEach((element: HTMLElement) => {
      const href = element.getAttribute("href");
      href && element.setAttribute("href", href?.replace(/\?.*$/, ""));
    });
  dom.window.document
    .querySelectorAll("img[src]")
    .forEach((element: HTMLElement) => element.removeAttribute("src"));

  // Node
  dom.window.document
    .querySelectorAll("link")
    .forEach((element: HTMLElement) => element.remove());
  dom.window.document
    .querySelectorAll("script")
    .forEach((element: HTMLElement) => element.remove());
  dom.window.document
    .querySelectorAll("body > div > code")
    .forEach((element: HTMLElement) => element.remove());
};

export const writeHTML = (text: string, name: string) => {
  const dom = new JSDOM(text);

  removeUnnecessaryDom(dom);
  const html = format(dom.window.document.querySelector("body").outerHTML);
  writeFile(`${__dirname}/../html/${name}.html`, html);
};
