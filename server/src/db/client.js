// Database client wrapper — supports direct SAP HANA or proxying via IDA
const config = require('../config');

if (config.useIda && config.ida && config.ida.url) {
  const idaClient = require('../services/idaClient');

  async function execute(query, params = []) {
    // Delegate SQL execution to IDA Cloud API
    return idaClient.query(query, params);
  }

  module.exports = { execute };
} else {
  // Fallback to direct SAP HANA client
  const hana = require('@sap/hana-client');

  const connectionParams = {
    serverNode: config.hana.serverNode || `${config.hana.host}:${config.hana.port}`,
    uid: config.hana.user,
    pwd: config.hana.password,
    databaseName: config.hana.database
  };

  function createConnection() {
    const conn = hana.createConnection();
    return conn;
  }

  async function execute(query, params = []) {
    const conn = createConnection();
    return new Promise((resolve, reject) => {
      conn.connect(connectionParams, (err) => {
        if (err) return reject(err);
        conn.prepare(query, (err, statement) => {
          if (err) { conn.disconnect(); return reject(err); }
          statement.exec(params, (err, result) => {
            conn.disconnect();
            if (err) return reject(err);
            resolve(result);
          });
        });
      });
    });
  }

  module.exports = { execute };
}
