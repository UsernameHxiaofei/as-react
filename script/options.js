const fs = require('fs');
const path = require('path');

const envFile = path.resolve(process.cwd(), './src/config/env/env.js');
const uniqloConfigFile = path.resolve(process.cwd(), './uniqlo.config.js');
const writeFile = (file, data) =>
  new Promise((resolve, reject) => {
    fs.writeFile(file, data, 'utf8', (err) => {
      if (err) {
        process.exit(0);
      }
      resolve(true);
    });
  });

exports.overWriteEnvFile = async (serverEnv) => {
  const isExist = fs.existsSync(envFile);
  if (isExist) {
    const envFileContent = fs.readFileSync(envFile, 'utf8');
    if (envFileContent) {
      const tmpEnvFileContent = envFileContent.replace(
        /(serverEnv = ').*(';)/,
        `serverEnv = '${serverEnv}';`,
      );
      const res = await writeFile(envFile, tmpEnvFileContent);
      if (res) console.log('set serverEnv success!');
    } else {
      process.exit(0);
    }
  } else {
    process.exit(0);
  }
};
exports.overWriteBaseUrl = async (url) => {
  const isExist = fs.existsSync(uniqloConfigFile);
  if (isExist) {
    const uniqloConfigContent = fs.readFileSync(uniqloConfigFile, 'utf8');
    if (uniqloConfigContent) {
      const tmpUniqloConfigContent = uniqloConfigContent.replace(
        /(baseUrl: ').*(\/vs',)/,
        `baseUrl: '${url}/vs',`,
      );
      const res = await writeFile(uniqloConfigFile, tmpUniqloConfigContent);
      if (res) console.log('set baseUrl success!');
    } else {
      process.exit(0);
    }
  } else {
    process.exit(0);
  }
};
