import {
  get as idbGet,
  set as idbSet,
  del as idbDelete,
} from 'idb-keyval';

const PREFIX = 'app-cache:';

export const get = async (key) => {
  return idbGet(`${PREFIX}${key}`);
};

export const set = async (key, value) => {
  await idbSet(`${PREFIX}${key}`, value);
};

export const remove = async (key) => {
  await idbDelete(`${PREFIX}${key}`);
};