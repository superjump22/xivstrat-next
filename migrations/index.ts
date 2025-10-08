import * as migration_20251008_090027 from './20251008_090027';

export const migrations = [
  {
    up: migration_20251008_090027.up,
    down: migration_20251008_090027.down,
    name: '20251008_090027'
  },
];
