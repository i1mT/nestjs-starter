import { get } from '@technically/lodash';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const DEV_YAML_CONFIG_FILENAME = './config.dev.yaml';
const PROD_YAML_CONFIG_FILENAME = './config.prod.yaml';
const BASE_YAML_CONFIG_FILENAME = './config.base.yaml';

function loadBaseConfig() {
  return yaml.load(
    readFileSync(join(__dirname, BASE_YAML_CONFIG_FILENAME), 'utf8'),
  ) as Record<string, any>;
}

function loadDevConfig() {
  return yaml.load(
    readFileSync(join(__dirname, DEV_YAML_CONFIG_FILENAME), 'utf8'),
  ) as Record<string, any>;
}

function loadProdConfig() {
  return yaml.load(
    readFileSync(join(__dirname, PROD_YAML_CONFIG_FILENAME), 'utf8'),
  ) as Record<string, any>;
}

function getConfiguration() {
  const env = process.env.ENV;

  if (env === 'development') {
    return [loadBaseConfig, loadDevConfig];
  }
  return [loadBaseConfig, loadProdConfig];
}

// 手动获取
function getSelf(configs: (() => Record<string, any>)[]) {
  return {
    get: (k: string) => {
      for (const getConf of configs) {
        const config = getConf();
        const res = get(config, k, undefined);
        if (res !== undefined) return res;
      }
      return undefined;
    },
  };
}
export default getConfiguration();

export const config = getSelf(getConfiguration());
