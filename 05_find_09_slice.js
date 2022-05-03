const { url, namespace } = require('./credentials');
const { MongoClient } = require('mongodb');

let client = new MongoClient(url);
console.log('connecting...');
client.connect().then((ret) => {
    let db = client.db(namespace);
    db.collection('customer').find({
        age: {'$lt':40}
    },{firstName: 1, age: 1, 'hobbies.name': {$slice:[2,5]}}).toArray().then((result)=>{
        console.log(result);
        client.close();
    }).catch((err)=>{
        console.log('collections error', err);
        client.close();
    })
}).catch((e) => {
    console.log('connection error', e);
    client.close();
})

/*
db.customer.find({
        age: {'$lt':40}
    },
    {firstName: 1, age: 1, 'hobbies.name': {$slice:[2,5]}}
)
*/