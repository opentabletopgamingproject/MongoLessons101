const { url, namespace } = require('./credentials');
const { MongoClient } = require('mongodb');

let client = new MongoClient(url);
console.log('connecting...');
client.connect().then((ret) => {
    let db = client.db(namespace);
    db.collection('customer').aggregate([
        {
            $bucket: {
                groupBy: '$age',
                boundaries: [0, 20, 30, 40, 60, 80, 100],
                default: null,
                output: {
                    numCustomers: { $sum: 1 },
                    averageAge: { $avg: '$age' }
                }
            }
        }
    ]).toArray().then((result)=>{
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

db.customer.aggregate(
    [
        {
            $bucket: {
                groupBy: '$age',
                boundaries: [0, 20, 30, 40, 60, 80, 100],
                default: null,
                output: {
                    numCustomers: { $sum: 1 },
                    averageAge: { $avg: '$age' }
                }
            }
        }
    ]
)

db.customer.aggregate(
    [
        {
            $bucketAuto: {
                groupBy: '$age',
                buckets: 5,
                output: {
                    numCustomers: { $sum: 1 },
                    averageAge: { $avg: '$age' }
                }
            }
        }
    ]
)
*/