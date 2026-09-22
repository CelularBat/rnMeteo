import { File, Directory, Paths } from 'expo-file-system';

const CACHE_DIR = new Directory(Paths.cache, 'app-cache');

const ensureCacheDir = () => {
  if (!CACHE_DIR.exists) {
    CACHE_DIR.create({
      idempotent: true,
      intermediates: true,
    });
  }
};

const getFile = (key) => {
  const safeKey = encodeURIComponent(key);

  return new File(CACHE_DIR, `${safeKey}.json`);
};

export const get = async (key) => {
  ensureCacheDir();

  const file = getFile(key);

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

export const set = async (key, value) => {
  ensureCacheDir();

  const file = getFile(key);
  const content = JSON.stringify(value);

  if (!file.exists) {
    file.create({
      intermediates: true,
    });
  }

  file.write(content);
};

export const remove = async (key) => {
  const file = getFile(key);

  if (file.exists) {
    file.delete();
  }
};