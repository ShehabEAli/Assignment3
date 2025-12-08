//  1. Use a readable stream to read a file in chunks and log each chunk.
// const fs = require("node:fs");
// const path = require("node:path")
// const filePath = path.resolve("./big.txt")

// const readStream = fs.createReadStream(filePath, {encoding: "utf-8"}, (error)=>{
//     console.log(error);
// })

// readStream.on("data", (chunk)=>{
//     console.log(chunk);
//     console.log("****************************************************************************************************************");
// })


// 2. Use readable and writable streams to copy content from one file to another.
// const fs = require("node:fs");
// const path = require("node:path")
// const filePath = path.resolve("./source.txt")
// const destPath = path.resolve("./dest.txt")

// const readStream = fs.createReadStream(filePath, {encoding: "utf-8"}, (error)=>{
//     console.log(error);
// })
// const writeStream = fs.createWriteStream(destPath);

// readStream.on("data", (chunk)=>{
//     console.log(chunk);
//     console.log("********************************************************");
//     writeStream.write(chunk);
//     console.log("Done");
    
// })


// 3. Create a pipeline that reads a file, compresses it, and writes it to another file.
// const fs = require("node:fs");
// const path = require("node:path");
// const {createGzip} = require("node:zlib");

// const inputPath = path.resolve("./data.txt");
// const outputZipPath = path.resolve("./dest.txt.gz");

// const readStream = fs.createReadStream(inputPath)
// const zip = createGzip();
// const writeStream = fs.createWriteStream(outputZipPath);

// readStream.pipe(zip).pipe(writeStream)
