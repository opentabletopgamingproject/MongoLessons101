const { url, namespace } = require('./credentials');
const { MongoClient } = require('mongodb');

let client = new MongoClient(url);
console.log('connecting...');
client.connect().then((ret) => {
    let db = client.db(namespace);
    db.collection('customer').aggregate([
        {
            $lookup: {
                from: 'customer',
                localField: 'customers',
                foreignField: 'id',
                as: 'customers'
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
            $unwind: '$hobbies'
        },
        {
            $group: {
                _id: { year: '$job.year' },
                customers: { $addToSet: '$id' },
                hobbies: { $push : '$hobbies' }
            }
        },
        {
            $sort: {
                '_id.year': -1
            }
        },
        {
            $out: 'customerHobbies'
        }
    ]
)


db.customerHobbies.aggregate(
    [
        {
            $lookup: {
                from: 'customer',
                localField: 'customers',
                foreignField: 'id',
                as: 'customers'
            }
        }
    ]
)

db.customerHobbies.aggregate(
    [
        { $unwind: '$customers' },
        {
            $lookup: {
                from: 'customer',
                let: { customerid: '$customers' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ['$id', '$$customerid']
                            }
                        }
                    }
                ],
                as: 'customers'
            }
        },
        { $unwind: '$customers' },
        {
            $project: {
                year: '$_id.year',
                customer: {
                    id: '$customers.id',
                    firstName: '$customers.firstName',
                    lastName: '$customers.lastName'
                },
                hobbies: 1
            }
        },
        { $unwind: '$hobbies' },
        {
            $group: {
                _id: {
                    year: '$year'
                },
                customers: {
                    $addToSet: '$customer'
                },
                hobbies: {
                    $addToSet: '$hobbies'
                }
            }
        }
    ]
)
*/