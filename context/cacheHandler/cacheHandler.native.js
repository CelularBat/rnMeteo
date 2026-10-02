import { File, Directory, Paths } from 'expo-file-system';

const ensureCacheDir = (dir) => {
  if (!dir.exists) {
    dir.create({
      idempotent: true,
      intermediates: true,
    });
  }
};


export default class CacheHandler {

  constructor(prefix,useLocalStorage=false){ 
    this.CACHE_DIR = new Directory(Paths.cache, prefix);
    ensureCacheDir(this.CACHE_DIR);
  }

  async get(key){
    const safeKey = encodeURIComponent(key);
    const file = new File(this.CACHE_DIR, `${safeKey}.json`);

    if (!file.exists) {
      return null;
    }

    try {
      const content = await file.text();

      return JSON.parse(content);
    } catch {
      return null;
    }
  };

  async set(key, value){
    const safeKey = encodeURIComponent(key);
    const file = new File(this.CACHE_DIR, `${safeKey}.json`);
    const content = JSON.stringify(value);

    if (!file.exists) {
      file.create({
        intermediates: true,
      });
    }

    file.write(content);
  };

  async remove(key){
    const safeKey = encodeURIComponent(key);
    const file = new File(this.CACHE_DIR, `${safeKey}.json`);

    if (file.exists) {
      file.delete();
    }
  };

}