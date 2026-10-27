// cacheHandler.js

export default class CacheHandler {
  protected _prefix: string;
  protected _useLocalStorage: boolean;

  constructor(prefix:string,useLocalStorage=false) {
    this._prefix = prefix;
    this._useLocalStorage = useLocalStorage;
  }

  async get<T = any>(key: string): Promise<T | null> {
    throw new Error('cacheHandler is not implemented for this platform');
  }

  async set<T = any>(key: string, value: T): Promise<void> {
    throw new Error('cacheHandler is not implemented for this platform');
  }

  async remove(key:string):Promise<void> {
    throw new Error('cacheHandler is not implemented for this platform');
  }
}

