import {
  get as idbGet,
  set as idbSet,
  del as idbDelete,
} from 'idb-keyval';


export default class CacheHandler {
  constructor(prefix,useLocalStorage=false) {
    this._prefix = prefix;
    this._useLocalStorage = useLocalStorage;
  }

  async get (key) {
    return idbGet(`${this._prefix}${key}`);
  };

    async set (key, value) {
    await idbSet(`${this._prefix}${key}`, value);
  };

    async remove (key) {
    await idbDelete(`${this._prefix}${key}`);
  };

}