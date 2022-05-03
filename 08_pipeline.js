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
            $group: {
                _id: { year: '$job.year' },
                totalCustomers: { $sum: 1 }
            }
        },
        {
            $sort: {
                '_id.year': -1
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
db.customer.aggregate([{$match:{age: {'$lt':40}}}])

db.customer.aggregate(
    [
        { 
            $match: {
                age: {'$gt':10}
            }
        },
        {
            $group: {
                _id: { year: '$job.year' },
                totalCustomers: { $sum: 1 }
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
            $group: {
                _id: { year: '$job.year' },
                totalCustomers: { $sum: 1 },
                jobs: { $push : '$job.title' }
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
            $group: {
                _id: { year: '$job.year' },
                totalCustomers: { $sum: 1 },
                hobbies: { $push : '$hobbies' }
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
                totalCustomers: { $sum: 1 },
                hobbies: { $push : '$hobbies' }
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
            $sort: {
                '_id.year': -1
            }
        }
    ]
)

*/