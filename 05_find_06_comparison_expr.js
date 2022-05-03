const { url, namespace } = require('./credentials');
const { MongoClient } = require('mongodb');

let client = new MongoClient(url);
console.log('connecting...');
client.connect().then((ret) => {
    let db = client.db(namespace);
    db.collection('customer').find(
        { 
            $expr: { 
                $gt: [
                    '$job.year', 
                    {
                        $cond: { 
                            if: { $gte: ['$job.hours', 800] }, 
                            then: '$job.hours', 
                            else: { $multiply: ['$job.hours', 2] } 
                        }
                    }
                ] 
            } 
        }
    ).toArray().then((result) => {
        console.log(result);
        client.close();
    }).catch((err) => {
        console.log('collections error', err);
        client.close();
    })
}).catch ((e) => {
    console.log('connection error', e);
    client.close();
})

/*

db.customer.find({ 
    $expr: { 
        $gt: [
            '$job.year', 
            {
                $cond: { 
                    if: { $gte: ['$job.hours', 800] }, 
                    then: '$job.hours', 
                    else: { $multiply: ['$job.hours', 2] } 
                }
            }
        ] 
    } 
});

*/