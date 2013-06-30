var fs = require('fs');
var async = require('async');

module.exports = Tailer;

var READBYTES = 1024;

function Tailer(file, options){
	this.file = file;
	this.delay = 1000;
	this.fromstart = false;
	this.stop = false;
	if(options && undefined !== options.delay){
		this.delay = options.delay;
	}
	if(options && undefined !== options.fromstart){
		this.fromstart = options.fromstart;
	}
}

Tailer.prototype = {
	tail: function(thecallback){
		var _this = this;
		_this.buffer = new Buffer(READBYTES);
		_this.lines = "";
		async.waterfall([
			function(callback){
				fs.stat(_this.file, function(err, stats){
					if(err){
						callback(err);
					}else{
						callback(null, stats.size);
					}
				});
			},
			function(size, callback){
				fs.open(_this.file, 'r', function(err, fd){
					if(err){
						callback(err);
					}else{
						callback(null, fd, size);
					}
				});
			},
			function(fd, size, callback){
				_this.fd = fd;
				_this.offset = _this.fromstart?0:size;
				setTimeout(function(){
					return _this.readfile(thecallback);
				}, _this.delay);
			}
		], function(err, result){
			if(err){
				thecallback(err);
			}
		});
	},
	stop: function(){
		var _this = this;
		_this.stop = true;
	},
	readfile: function(thecallback){
		var _this = this;
		var _bytesread = READBYTES;
		_this.lines = "";

		async.series([
			function(callback){
				fs.stat(_this.file, function(err, stats){
					if(err){
						callback(err);
					}else{
						if(stats.size < _this.offset){
							//File seems to be truncated, reset offset
							_this.offset = 0;
						}
						callback(null);
					}
				});
			},
			function(seriescallback){
				async.whilst(function(){
					return (_bytesread == READBYTES) && !_this.stop;
				},
				function(callback){
					fs.read(_this.fd, _this.buffer, 0, READBYTES, _this.offset, function(err, bytesread, buffer){
						_bytesread = bytesread;
						_this.offset += bytesread;
						_this.lines += _this.buffer.slice(0, bytesread).toString('utf8');
						callback(err);
					});
				},
				function(err){
					var lines = _this.lines.split("\n");
					for(var i = 0; i < lines.length - 1; i++){
						thecallback(null, lines[i]);
					}
					setTimeout(function(){
						return _this.readfile(thecallback);
					}, _this.delay);
					seriescallback(null);
				});
			}
		], function(err, results){
			if(err){
				thecallback(err);
			}
		});


	}
};