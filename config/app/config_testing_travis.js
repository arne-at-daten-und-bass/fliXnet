'use strict';

var fs = require('fs');

var appConfig = {
  environment: function() {
    var environment = {
      name: process.env.NODE_ENV,
    };

    return environment;
  },

  web: function() {
    var web = {
      // ip: process.env.DNB_APP_ENV_S1_WB_FTED_IP1, // not used
      // http: {
      //   port: process.env.DNB_APP_ENV_S1_WB_FTED_HTTP_PORT, // not used
      // },
      https: {
        port: process.env.DNB_NODE_OAI_HTTPS_PORT,
        crt: process.env.HOME + '/' + process.env.DNB_APP_ENV_S1_WB_FTED_HTTPS_CERT1,
        key: process.env.HOME + '/' + process.env.DNB_APP_ENV_S1_WB_FTED_HTTPS_CERT1_KEY,
      },
      // proxies: [ process.env.DNB_INF1_ENV_S1_WF1_FTED_IP1, process.env.DNB_APP_ENV_S1_LB1_FTED_IP1 ],
    };

    return web;
  },

  db: function() {
    var db = {
      // ip: process.env.DNB_APP_ENV_S2_DB_BKED_IP1,
      ip: process.env.DNB_APP_ENV_S2_DB,
      headers: {
        Authorization: process.env.DNB_APP_ENV_S2_DB_PASS,
        'Content-Type': 'application/json',
        Accept: 'application/json; charset=UTF-8',
      },
      http: {
        port: process.env.DNB_NEO_HTTP_PORT,
      },
      https: {
        port: process.env.DNB_NEO_HTTPS_PORT,
        ca: process.env.HOME + '/' + process.env.DNB_INF_ENV_PKI1_CA_CERT,
      },
      request: {
        method: 'POST'  // not used
      },
      batch: {
        job: {
          method: 'POST',
          url:'/cypher',
          id: 0,
        },
      },
    };

    db.https.url = 'https://' + db.ip  + ':' + db.https.port + '/db/data/transaction/commit';
    db.batch.url = 'https://' + db.ip  + ':' + db.https.port + '/db/data/batch';

    return db;
  },

  sessions: function() {
    var sessions = {
      session: {
        options:{
          secret: process.env.DNB_APP_ENV_S1_WB_SESS_SEC,
          name: process.env.DNB_APP_ENV_S1_WB_SESS_NAME,
          resave: false,
          saveUninitialized: false, 
          cookie: { secure: true },
          // genid:
        },
      },
      store: {
        options: {
          // host: process.env.DNB_APP_ENV_S3_DB_BKED_IP1,
          host: process.env.DNB_APP_ENV_S3_DB,
          // port: process.env.DNB_APP_ENV_S3_DB_BKED_PORT,
          port: process.env.DNB_REDIS_PORT,
          db: parseInt(process.env.DNB_APP_ENV_S3_DB_INST1),
          pass: process.env.DNB_APP_ENV_S3_DB_PASS,
          // prefix: 'fliXnet:sessions:',
        },
      },
    };

    return sessions;
  },

  users: function() {
    var users = {
      secret: Buffer.from(process.env.DNB_APP_ENV_S1_WB_USER_SEC),
      store: {
        // host: process.env.DNB_APP_ENV_S3_DB_BKED_IP1,
        host: process.env.DNB_APP_ENV_S3_DB,
        // port: process.env.DNB_APP_ENV_S3_DB_BKED_PORT,
        port: process.env.DNB_REDIS_PORT,
        options: {
          db: parseInt(process.env.DNB_APP_ENV_S3_DB_INST2),
          auth_pass: process.env.DNB_APP_ENV_S3_DB_PASS, 
          return_buffers: true,
          // prefix: 'fliXnet:users:',
        },
      },
      auth: {
        local: {
          type: 'local',
          passport: {
            options: {
              usernameField : 'user',
              passwordField : 'password',
              passReqToCallback : true,
            },
          },
        },
        oAuth: {
          type: 'oAuth',
          volos: {
            options: {
              encryptionKey: process.env.DNB_APP_ENV_S1_WB_OAUT_SEC,
              // host: process.env.DNB_APP_ENV_S3_DB_BKED_IP1,
              host: process.env.DNB_APP_ENV_S3_DB,
              // port: process.env.DNB_APP_ENV_S3_DB_BKED_PORT,
              port: process.env.DNB_REDIS_PORT,
              db: parseInt(process.env.DNB_APP_ENV_S3_DB_INST3),
              options:{
                auth_pass: process.env.DNB_APP_ENV_S3_DB_PASS,
              },
            },
          },
        },
      },
    };

    return users;
  },

  krypto: function() {
    var krypto = {
      secret: Buffer.from(process.env.DNB_APP_ENV_S1_WB_KRYP_SEC),
      options: {
        hashBytes: parseInt(process.env.DNB_APP_ENV_S1_WB_KRYP_HBS),
        saltBytes: parseInt(process.env.DNB_APP_ENV_S1_WB_KRYP_SBS),
        iterations: parseInt(process.env.DNB_APP_ENV_S1_WB_KRYP_ITS),
      },
    };

    return krypto;  
  },
};

(function readPKIFiles() {
  process.env.FLIXNET_WEB_HTTPS_KEY = fs.readFileSync(appConfig.web().https.key, 'utf8');
  process.env.FLIXNET_WEB_HTTPS_CRT = fs.readFileSync(appConfig.web().https.crt, 'utf8');
  process.env.FLIXNET_DB_HTTPS_CA = fs.readFileSync(appConfig.db().https.ca, 'utf8');
})();

module.exports = appConfig;