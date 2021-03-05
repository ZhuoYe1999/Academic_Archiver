//解析浏览器地址栏里的参数
export const decodeURLParams = search => {
  const hashes = search.slice(search.indexOf('?') + 1).split('&');
  return hashes.reduce((params, hash) => {
    const split = hash.indexOf('=');
    const key = hash.slice(0, split);
    const val = hash.slice(split + 1);
    return Object.assign(params, { [key]: decodeURIComponent(val) });
  }, {});
};
//根据uri下载数据
export function downloadURI(uri, name) {
  var link = document.createElement('a');
  link.download = name;
  link.href = uri;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  link = null;
}

