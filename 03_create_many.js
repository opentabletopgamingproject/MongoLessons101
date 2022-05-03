const { url, namespace } = require('./credentials');
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const { faker } = require('@faker-js/faker');

let customers = [];
for(let i=0;i<50;i++){
    let hobbies = [];
    let len = Math.floor(Math.random()*10);
    for(let j=0;j<len;j++){
        hobbies.push({
            name: faker.commerce.productName(),
            spend: faker.datatype.number({min: 1000, max: 100000})
        })
    }
    customers.push({
        _type: 'customer',
        id: uuidv4(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        age: faker.datatype.number({min: 0, max: 100}),
        job: {
            title: faker.name.jobTitle(),
            year: faker.datatype.number({min: 2000, max: 2022}),
            hours: faker.datatype.number({min: 0, max: 2022})
        },
        hobbies: hobbies
    })
}

let client = new MongoClient(url);
console.log('connecting...');
client.connect().then((ret) => {
    let db = client.db(namespace);
    db.collection('customer').insertMany(customers).then((val)=>{
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