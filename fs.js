const fs=require('fs')

const data=fs.readFileSync('hello.txt','utf8')
console.log(data,'after Sync function')
fs.writeFileSync('SyncWrite.txt','file operations')

//async
fs.writeFile('AsyncFile.txt','Async file operations',(err)=>{
    if(err) throw err;
    console.log('file write successfully')
    fs.readFile('AsyncFile.txt','utf-8',(err,data)=>{
  if(err) throw err;
  console.log('data',data)

    })
})