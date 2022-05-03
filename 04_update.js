const { url, namespace } = require('./credentials');
const { MongoClient } = require('mongodb');

let client = new MongoClient(url);
console.log('connecting...');
client.connect().then((ret) => {
    let db = client.db(namespace);
    db.collection('customer').updateOne({
        firstName: 'Ron',
        lastName: 'Villaver'
    },{
        $set: {
            firstName: 'Ron',
            lastName: 'V',
            game: 'Folded Wishes'
        }
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

/*
//for later after find lesson
db.customer.find({'hobbies.name':{'$regex':/Tasty/}})
db.customer.updateMany({'hobbies.name':{'$regex':/Tasty/}},{'$set':{isTasty:true}})
db.customer.updateOne({'hobbies.name':{'$regex':/Tasty/}},{$inc:{age: 1}})
db.customer.updateMany({'hobbies.name':{'$regex':/Tasty/}},{'$rename':{isTasty:'tastyFlag'}})
db.customer.updateMany({hobbies:{$elemMatch:{name:{$regex:/Tasty/}, spend: {$gt:20000}}}},{'$set':{'hobbies.$.isCool':true}})
db.customer.updateMany({hobbies:{$elemMatch:{name:{$regex:/Tasty/}, spend: {$gt:20000}}}},{'$push':{hobbies:{name:'board gaming', spend: 10000}}})
db.customer.updateMany({hobbies:{$elemMatch:{name:{$regex:/Tasty/}, spend: {$gt:20000}}}},{'$addToSet':{hobbies:{name:'board gaming', spend: 10000}}})
db.customer.updateMany({'hobbies.name':{'$regex':/Tasty/}},{'$unset':{tastyFlag:true}})
*/