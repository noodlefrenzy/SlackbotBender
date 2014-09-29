var should  = require('should'),
    yell    = require('../integrations/yell');

describe('Yell', function(){
    describe('#getResponse()', function(){
        it('should get a response', function (done){
            yell.getResponse('yell hello world!', function (data) { 
                should.exist(data);
                done();
            });
        });
    });
});
