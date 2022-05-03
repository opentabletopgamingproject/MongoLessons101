const { url, namespace } = require('./credentials');
const { MongoClient } = require('mongodb');

let client = new MongoClient(url);
console.log('connecting...');
client.connect().then((ret) => {
    let db = client.db(namespace);
    db.listCollections().toArray((err, collections) => {
        if (err) {
            console.log('collections error', err);
            return;
        }
        try {
            let cnames = {};
            for (let i = 0; i < collections.length; i++) {
                let c = collections[i];
                cnames[c.name] = c;
            }
            console.log('collections found', cnames);

            let name = 'customer';
            if(!cnames.hasOwnProperty(name)){
                db.createCollection(name, {
                    autoIndexId: false
                }).then((collection) => {
                    console.log(collection);

                    console.log('creating index');
                    collection.createIndex({
                        id: 1,
                        _type: 1
                    }, {
                        unique: true
                    }, (ierr, iresult) => {
                        if (ierr) {
                            console.log('Index Result', ierr, iresult);
                        }
                    });                    
                    client.close();
                }).catch((err) => {
                    console.log('collection creation error', err);
                })                  
            }else{
                client.close();
            }
        } catch (e) {
            console.log('collections error', e);
            client.close();
        }
    });
}).catch((e) => {
    console.log('connection error', e);
    client.close();
})