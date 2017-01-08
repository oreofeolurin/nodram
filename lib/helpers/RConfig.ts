import * as path from "path";
import * as _ from "lodash";
import * as ts from "typescript";

const DEFAULT_CONFIG = {
    type : "web",
    styles : {
        rootDir: "./browser/styles/",
        outDir : "./static/styles",
        cssFile: "main.css",
        compressed: true,
        prefix: {
            browsers: ['last 2 versions'],
            cascade: false
        },
        appFilesPaths: ['./browser/styles/app/**/**.scss'],
        bootstrapMainFile: 'bootstrap.scss',
        bootstrapDir: './browser/styles/bootstrap',
        bootstrapFilesPaths : ["./browser/styles/bootstrap/**/**.scss"],
        bundles : []
    },
    scripts : {
        rootDir: "./browser/app/",
        outDir : "./static/scripts",
        excludes: [],
        clientBundleFile : "main.bundle.js",
        clientBootstrapFile : "browser.bootstrap.ts",
        bundles : {},
        "systemjs-bundles" : {
            "rxjs" : [
                "node_modules/rxjs/add/**/*.js",
                "node_modules/rxjs/observable/**/*.js",
                "node_modules/rxjs/operator/**/*.js",
                "node_modules/rxjs/scheduler/**/*.js",
                "node_modules/rxjs/symbol/**/*.js",
                "node_modules/rxjs/util/**/*.js",
                "node_modules/rxjs/testing/**/*.js",
                "node_modules/rxjs/*.js"
            ]
        },
        compilerOptions : {
            target: ts.ScriptTarget.ES5,
            module: ts.ModuleKind.CommonJS,
            emitDecoratorMetadata: true,
            experimentalDecorators: true,
        }
    },
    staticSite: ".",
    indexHTML : {
        title: "Ream Framework",
        metas : [],
        favicons: [],
        styles : []
    },
    externalPackages: {

    }

};

export class RConfig {
    private config;

    constructor() {
        let userConfig;
        try {
            userConfig = require(path.join(process.cwd(), './ream.config.json'));
        } catch (err) {
            userConfig = {};
        }

        this.config = _.merge({}, DEFAULT_CONFIG, userConfig);
    }

    public get(keyString: string) {
        let keys = keyString.split(".");
        let value = this.config;

        for(let key of keys){
            value = value[key] ? value[key] : null;
        }

        return value;
    }


}



/*
"scripts": {
    "prebuild": "rimraf dist",
        "build": "webpack  --progress",
        "clean:dist": "rimraf dist",
        "clean:ngc": "rimraf **!/!*.ngfactory.ts",
        "build:prod:ngc": "npm run clean:ngc && npm run ngc && npm run clean:dist && npm run build:prod",
        "build:prod:ngc:json": "npm run clean:ngc && npm run ngc && npm run clean:dist && npm run build:prod:json",
        "build:prod": "webpack --config webpack.prod.config.ts",
        "build:prod:json": "webpack --config webpack.prod.config.ts --json | webpack-bundle-size-analyzer",
        "ngc": "ngc -p tsconfig.aot.json",
        "prestart": "npm run build",
        "server": "nf start",
        "start": "npm run server",
        "predebug": "npm run build",
        "debug:build": "node-nightly --inspect --debug-brk node_modules/webpack/bin/webpack.js",
        "debug": "node --debug-brk dist/server/index.js",
        "watch": "webpack --watch",
        "watch:dev": "npm run server & npm run watch"
},*/
