/**
 * Created by 月飞 on 14-3-11.
 */
var rootPath = process.cwd(),
    fs = require('fs'),
    path = require('path'),
    utils = require('../service/lib/utils'),
    error = require('../service/errorHanding'),
    G_CONFIG = {
        "dev": {
            db: {
                host: 'localhost',
                port: 27017,
                database: 'blogDev',
                user: '',
                pass: ''
            },
            port: 8000,
            path: rootPath,
            domain: 'http://localhost:8000/',
            bae:{
                ApiKey:''
            },
            qiNiu: {
                ACCESS_KEY: '',
                SECRET_KEY: '',
                bucketName: ''
            }
        },
        "production": {
            db: {
                host: 'localhost',
                port: 27017,
                database: 'blog',
                user: '',
                pass: ''
            },
            port: 8000,
            path: rootPath,
            domain: 'http://cssjser.com/',
            bae:{
                ApiKey:''
            },
            qiNiu: {
                ACCESS_KEY: '',
                SECRET_KEY: '',
                bucketName: ''
            }
        }
    };
function readConfig() {
    var ENV = process.env.NODE_ENV || 'production',
        configPath = rootPath + path.normalize('/config/config.json'),
        config = G_CONFIG[ENV];
    config.ENV = ENV;
    if (fs.existsSync(configPath)) {
        return JSON.parse(fs.readFileSync(configPath, 'utf8')) || config;
    } else {
        fs.writeFileSync(configPath, JSON.stringify(config));
        return config;
    }
}
module.exports = readConfig;