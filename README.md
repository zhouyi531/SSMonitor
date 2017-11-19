# SSMonitor
Monitor multiple ss servers' usability 

1. Run ```npm install```
2. Put real data in **config.js**

```javascript
var configData = {
	data:[{
			name: 'ss-1',
			ip:'10.76.104.68',
			port:443,
			method:'rc4-md5',
			password:'password',
		},
		{
			name: 'ss-2',
			ip:'10.172.92.22',
			port:443,
			method:'rc4-md5',
			password:'password',
		}
	]
}
```

3. Run ```node main``` and the program will set each configration as local SOCKS5 service on **port 1080** and try to get data from **http://checkip.dyndns.org** via **port 1080** 
