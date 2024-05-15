// import csv from 'csv-parser';
// import fs from 'fs';

// export function csvStream(path:string) {
//   const rs = fs.createReadStream(path);
//   const stream = rs.pipe(csv());

//   return stream;
// }

// // export function csvToTable(path:string) {
// //   const stream = csvStream(path);

// //   let columns:Array<string> = [];
// //   let row:Array<string> = [];
// // }

// export function csvColumns(path:string) {
//   interface Column {
//     name: string;
//     type: ColumnType;
//   }

//   enum ColumnType {
//     Numeric,
//     String,
//   }

//   return new Promise(function(resolve, reject) {
//     let columns:Array<Column> = [];
//     const stream  = csvStream(path);

//     stream
//       .on('headers', (headers) => {
//         headers.forEach((column:string) => {
//           columns.push({name: column, type: ColumnType.String}); 
//         });
//       })
//       // .on('data', (data:Map<string,string>) => {
//       .on('data', (data:Map<string,any>) => {
//         // stream.destroy();

//         // check if the header exists
//         if (columns.length == 0) {
//           reject(new Error("csv header does not exist"));
//           return;
//         }

//         console.log(data);
//         // console.log(data.keys());
        
//         // for (const key in data) {
//         //   data[key];
//         // }

//         // iter for col type
//         // for (let [key, value] of data) {
//         //   console.log(key, value);
//         // }

//         // for (let [key] of Object.keys(data)) {
//         //   console.log(key);
//         // }

//         // data.forEach((value:string, key:string) => {
//         //   console.log(key, value);
//         // });
//       });
//   });
// }
