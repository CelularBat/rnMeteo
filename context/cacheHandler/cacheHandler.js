// cacheHandler.js

export default class CacheHandler {
  constructor(prefix,useLocalStorage=false) {
    this._prefix = prefix;
    this._useLocalStorage = useLocalStorage;
  }

  async get(key) {
    throw new Error('cacheHandler is not implemented for this platform');
  }

  async set(key, value) {
    throw new Error('cacheHandler is not implemented for this platform');
  }

  async remove(key) {
    throw new Error('cacheHandler is not implemented for this platform');
  }
}

