const Q = require('q');

function* makeConfig(){
	const {configData} = require('./config');
	for(let i=0;i<configData.data.length;i++){
			let currentConfig = configData.data[i];
			yield new SSConfig(currentConfig.ip,currentConfig.port,currentConfig.method,currentConfig.password,currentConfig.name);
		}
} 

class SSConfig{
	constructor(ip,port,encry,pass,name){
		this.name = name;
		this.ip = ip;
		this.port = port;
		this.encry = encry;
		this.pass = pass;
		this.local = '127.0.0.1';
		this.local_port = 1080;
		this.exec = require('child_process').exec;

		this.setup.bind(this);
		this.test.bind(this);
		this.clean.bind(this);
	}

	setup(){
		return Q.Promise((resolve,reject,notify)=>{
			this.exec(`sudo sslocal -s '${this.ip}' -p ${this.port} -b '${this.local}' -l ${this.local_port} -k '${this.pass}' -m '${this.encry}' -d start`,(err, stdout, stderr)=>{
				if(err){
					reject(err);
				}
				else
					resolve(true);
			});
		});
	}

	test(){
		return Q.Promise((resolve,reject,notify)=>{
			let Agent = require('socks5-http-client/lib/Agent');
			require('request')({
				url:'http://checkip.dyndns.org',
				agentClass: Agent,
				timeout: 5000,
			},(err,res)=>{
				if(err){
					
					// put custom code here to deal with failures;

					reject(`test failed on ${this.name}`);
				} 
				else resolve(`test ok on ${this.name}`);
			});
		});
	}

	clean(){
			return Q.Promise((resolve,reject,notify)=>{
				this.exec(`pgrep sslocal | xargs sudo kill > /dev/null 2>&1`,(err,stdout,stderr)=>{
					if(err)
						reject(err);
					else
						resolve(true);
				});
			}).then((value)=>{
				Q.Promise((resolve,reject,notify)=>{
					this.exec(`sudo rm /var/run/shadowsocks.pid > /dev/null 2>&1`,(err,stdout,stderr)=>{
						if(err)
							reject(err);
						else
							resolve(true);
					});
				}).then((value)=>{
					return true;
					//console.log('clean up completed');
				},(err)=>{
					console.log('error in clean step 2');
				});
			},(err)=>{
				console.log('error in clean step 1');
			});
	}
}

module.exports.SSConfig = SSConfig;
module.exports.makeConfig = makeConfig;
