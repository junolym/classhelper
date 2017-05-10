var dao = require('./dao');
delete require.cache[__dirname+'/dao.js'];

dao.login('test', 'FDB6C662D36651211F14977097250CCA')
.then(function(a) {
    console.log('success');
    console.log(a);
    JSON.parse('sf');
})
.catch(function(a) {
    console.log('failed');
    console.log(a);
    console.log(a.message);
    console.log(a.userError);
})