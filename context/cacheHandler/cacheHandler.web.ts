/* context/cacheHandler/cacheHandler.web.ts */
import {
  get as idbGet,
  set as idbSet,
  del as idbDelete,
} from 'idb-keyval';

export default class CacheHandler {
  private _prefix: string;
  private _useLocalStorage: boolean;

  constructor(prefix: string, useLocalStorage: boolean = false) {
    this._prefix = prefix;
    this._useLocalStorage = useLocalStorage;
  }

  async get<T = any>(key: string): Promise<T | null> {
    const value = await idbGet<T>(`${this._prefix}${key}`);
    return value === undefined ? null : value;
  }

  async set<T = any>(key: string, value: T): Promise<void> {
    await idbSet(`${this._prefix}${key}`, value);
  }

  async remove(key: string): Promise<void> {
    await idbDelete(`${this._prefix}${key}`);
  }
}