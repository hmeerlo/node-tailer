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
Tailer = require('tailer');

tailer = new Tailer("/var/log/messages", {fromstart: true, delay: 500});

tailer.tail(function(err, line){
	//Do something with the new line in the tailed file
});

//When you want to stop tailing:

tailer.untail();

````

Currently you can supply 2 options to the Tailer constructor:

* fromstart - Tells the tailer to read the file from the start and output all existing lines. If false (default), it will only tail new lines added to the file after the tailer has been created.
* delay - This is the delay in ms (default 1000) between 2 consecutive reads in the file.