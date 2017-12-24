let assetServer;
const _filters = {
  remoteAsset(path, root) {
    if (path && !path.startsWith('http://') && !path.startsWith('https://')) {
      path = (root || assetServer || '') + path;
    }
    return path;
  },
};

const filters = {
  setAssetServer(root) {
    assetServer = root;
  },
  install(Vue) {
    Object.keys(_filters).forEach((name) => {
      Vue.filter(name, _filters[name]);
    });
  },
  all: _filters,
};

export default filters;
