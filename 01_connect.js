const { url, namespace } = require('./credentials');
const { MongoClient } = require('mongodb');

let client = new MongoClient(url);
console.log('connecting...');
client.connect().then((ret) => {
    console.log('connected', ret);
    let db = client.db(namespace);
    console.log(db);
    client.close();
}).catch((e) => {
    console.log('connection error', e);
    client.close();
})