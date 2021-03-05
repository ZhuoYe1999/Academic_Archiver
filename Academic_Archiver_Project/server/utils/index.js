//把对象里的空属性删除
const removeEmpty = (obj) => {
  Object.keys(obj).forEach((key) => (obj[key] == null) && delete obj[key]);
  return obj;
}

module.exports = {
  removeEmpty
}