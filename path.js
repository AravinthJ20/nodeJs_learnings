const path=require("path")
 
console.log('Base Name',path.basename(__filename))
console.log('Dir Name',path.dirname(__filename))
console.log('Ext',path.extname(__filename))
console.log('dir',path.dirname(__filename))
console.log('dir2',__dirname)

//join path safely
const joinedPath=path.join(__dirname,'data','sample.txt')
console.log('joined path',joinedPath)
console.log('Normalized:', path.normalize('/users/../users//logesh/demo//'));
