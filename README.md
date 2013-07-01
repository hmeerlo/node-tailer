node-tailer
===========

node-tailer tries to be the node.js equivalent of 'tail -F &lt;file>'

#tailer

To install:

```bash
npm install tailer
```

or add tailer to package.json and run 'npm install'

#Use:
```javascript
Tailer = require('tailer').Tailer;

tailer = new Tailer("/var/log/messages", {fromstart: true, delay: 500});

tailer.tail(function(err, line){
	//Do something with the new line in the tailed file
});

//When you want to stop tailing:

tailer.untail();

````
