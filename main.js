const {SSConfig,makeConfig} = require('./model');
const Q = require('q');

const configIterator = makeConfig();

function run(it){
	let next = it.next();
	if(!next.value || next.done){
		console.log('all tests finished!');
		return;
	}

	let x = next.value;

	x.setup()
	.then((value)=>{
		return x.test();
	},(err)=>{
		console.log(err);
		console.log('err in setup');
	})
	.then((value)=>{
		console.log(value);
	},(err)=>{
		console.log(err);
		console.log('err in test');
	})
	.fin(()=>{
		x.clean()
		.fin(()=>{
			//console.log('next:');
			run(it);
		});
	});
}
console.log('test starts:');
run(configIterator);

