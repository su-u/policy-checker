import { request, writeHTML } from "./util";
import { SITES } from "./sites";

const getSite = async (url: string, name: string) => {
  try {
    const { status, data } = await request(url);

    console.log(`${name}: ${status}`);
    if (status === 200) {
      writeHTML(data, name);
    }
  } catch (e) {
    // console.error(e);
    console.error(name);
  }
};

(async () => {
  for (const { url, name } of SITES) {
    getSite(url, name);
  }
})();
