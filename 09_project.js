const { url, namespace } = require('./credentials');
const { MongoClient } = require('mongodb');

let client = new MongoClient(url);
console.log('connecting...');
client.connect().then((ret) => {
    let db = client.db(namespace);
    db.collection('customer').aggregate([
        { 
            $match: {
                age: {'$gt':10}
            }
        },
        {
            $project: {
                _id: 0,
                customer: {
                    $concat: ['$firstName', ' ', '$lastName', ' - ', '$job.title']
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
            $match: {
                age: {'$gt':10}
            }
        },
        {
            $project: {
                _id: 0,
                customer: {
                    $concat: ['$firstName', ' ', '$lastName', ' - ', '$job.title']
                }
            }
        }
    ]
)

db.customer.aggregate(
    [
        { 
            $match: {
                age: {'$gt':10}
            }
        },
        {
            $project: {
                _id: 0,
                customer: {
                    $concat: ['$firstName', ' ', { $substrCP: ['$lastName',0,1] }, '. - ', '$job.title']
                }
            }
        }
    ]
)

db.customer.aggregate(
    [
        { 
            $match: {
                age: {'$gt':10}
            }
        },
        {
            $unwind: '$hobbies'
        },
        {
            $group: {
                _id: { year: '$job.year' },
                customers: { $addToSet: { $concat: ['$firstName', '$lastName']} },
                hobbies: { $push : '$hobbies' }
            }
        },
        {
            $project: {
                year: '$_id.year',
                totalCustomers: { $size: '$customers' },
                hobbies: 1
            }
        },
        {
            $sort: {
                '_id.year': -1
            }
        }
    ]
)

db.customer.aggregate(
    [
        { 
            $match: {
                age: {'$gt':10}
            }
        },
        {
            $unwind: '$hobbies'
        },
        {
            $group: {
                _id: { year: '$job.year' },
                customers: { $addToSet: { $concat: ['$firstName', '$lastName']} },
                hobbies: { $push : '$hobbies' }
            }
        },
        {
            $project: {
                year: '$_id.year',
                totalCustomers: { $size: '$customers' },
                hobbies: {
                    $filter: {
                        input: '$hobbies',
                        as: 'hobbies',
                        cond: {
                            '$gt': ['$$hobbies.spend', 90000]
                        }
                    }
                }
            }
        },
        {
            $sort: {
                '_id.year': -1
            }
        }
    ]
)

db.customer.aggregate(
    [
        {
            $unwind: '$hobbies'
        },
        {
            $project: {
                name: { $concat: ['$firstName', ' ', '$lastName']},
                hobby: '$hobbies.name',
                spending: '$hobbies.spend'
            }
        },
        {
            $sort: { name: 1, spending: -1 }
        },
        {
            $group: {
                _id: { name: '$name' },
                name: { $first: '$name' },
                hobby: { $first : '$hobby' },
                spending: { $max: '$spending' }
            }
        },
        {
            $project: {
                _id: 0,
                name: 1,
                hobby: 1,
                spending: 1
            }
        }
    ]
)

*/