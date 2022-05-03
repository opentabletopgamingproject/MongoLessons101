let username = 'atlasname';
let password = 'atlaspass';
let host = 'atlashost/atlasnamespace';

module.exports.namespace = 'atlasnamespace';
module.exports.url = `mongodb+srv://${username}:${password}@${host}?retryWrites=true&w=majority`