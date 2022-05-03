const { url, namespace } = require('./credentials');
const { MongoClient } = require('mongodb');

let client = new MongoClient(url);
console.log('connecting...');
client.connect().then((ret) => {
    let db = client.db(namespace);
    db.collection('customer').find({
        '$and':[
            {
                'job.year': {'$gte':2007}
            },
            {
                'job.year': {'$lte':2010}
            }
        ]
    }).toArray().then((result)=>{
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
    '$and':[
        {
            'job.year': {'$gte':2007}
        },
        {
            'job.year': {'$lte':2010}
        }
    ]
});

*/