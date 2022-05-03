const { url, namespace } = require('./credentials');
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

let client = new MongoClient(url);
console.log('connecting...');
client.connect().then((ret) => {
    let db = client.db(namespace);
    db.collection('customer').insertOne({
        id: uuidv4(),
        firstName: 'Ron',
        lastName: 'Villaver',
        age: 40,
        job: {
            title: 'Consultant',
            year: 2007,
            hours: 800
        },
        hobbies: [
            {name: 'board gaming', spend: 10000},
            {name: 'eating', spend: 10000}
        ]
    }).then((val)=>{
        console.log(val);
        client.close();
    }).catch((err)=>{
        console.log('collections error', err);
        client.close();
    })
}).catch((e) => {
    console.log('connection error', e);
    client.close();
})