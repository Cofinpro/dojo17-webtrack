function Test(){

    this.setup = function(){

        console.log('Donröschen war das bessere Schneewittchen!');
        console.log(document.getElementById('playground'));
        var t = new TestA();
        t.write();
    };
}
module.exports = Test;

