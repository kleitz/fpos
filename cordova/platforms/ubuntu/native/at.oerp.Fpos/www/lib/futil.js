var futil={comma:",",activetap:false};futil.isDoubleTap=function(){if(!futil.activetab){futil.activetab=true;setTimeout(function(){futil.activetab=false},1000);return false}return true};futil.screenWidth=function(){var a=(window.innerWidth>0)?window.innerWidth:screen.width;return a};futil.screenHeight=function(){var a=(window.innerHeight>0)?window.innerHeight:screen.height;return a};futil.hasSmallRes=function(){return Math.max(futil.screenWidth(),futil.screenHeight())<1024};futil.formatFloat=function(a,b){if(!a){a=0}if(b===0){return a.toString().replace(".",futil.comma)}else{if(!b){b=2}}return a.toFixed(b).replace(".",futil.comma)};futil.parseFloat=function(a){if(!a){return 0}return parseFloat(a.replace(futil.comma,"."))};futil.Barrier=function(b,a){this.callback=b;this.ref=1;this.add=function(c){if(c){this.ref+=c}else{this.ref++}};this.test=function(){if(--this.ref===0){this.callback(a)}}};