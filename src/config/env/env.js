import { env as defaultEnvConfig } from './envDefault';
import { env as localConfig } from './envLocal';
import { env as devConfig } from './envDev';
import { env as testConfig } from './envTest';
import { env as prepubConfig } from './envPrepub';
import { env as prodConfig } from './envProd';
import { envExt as extConfig } from './envExt';

const buildMap = new Map([
  // 本地
  [{ buildEnv: 'development', serverEnv: 'local' }, localConfig],
  [{ buildEnv: 'development', serverEnv: 'dev' }, devConfig],
  [{ buildEnv: 'development', serverEnv: 'test' }, testConfig],
  [{ buildEnv: 'development', serverEnv: 'production' }, prodConfig],
  // 线上
  [{ buildEnv: 'production', serverEnv: 'dev' }, devConfig],
  [{ buildEnv: 'production', serverEnv: 'test' }, testConfig],
  [{ buildEnv: 'production', serverEnv: 'prepub' }, prepubConfig],
  [{ buildEnv: 'production', serverEnv: 'production' }, prodConfig],
]);
const serverEnv = 'test';
const buildEnv = process.env.NODE_ENV;
const evnTarget = [...buildMap].filter(([key, value]) => key.buildEnv === buildEnv && key.serverEnv === serverEnv);
const envConfig = Array.isArray(evnTarget)
  ? Array.isArray(evnTarget[0]) && evnTarget[0].length === 2
    ? evnTarget[0][1]
    : {}
  : {};
export const env = { serverEnv, ...defaultEnvConfig, ...extConfig, ...envConfig };
