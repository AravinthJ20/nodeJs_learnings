// A bit is the smallest unit of data (0 or 1). A byte is 8 bits. Decimal, binary, 
// and hexadecimal are different number systems used to represent the same byte values.
//  Encodings like ASCII and UTF-8 define how characters are converted to bytes for storage and transmission.

const buf = Buffer.from("A", "utf8");

console.log(buf.length);       // 1 byte
console.log(buf[0]);          // 65 (decimal)
console.log(buf[0].toString(2)); // 1000001 (binary)
console.log(buf[0].toString(16)); // 41 (hex)


// UTF-8 is a character encoding that represents characters as sequences of bytes stored in binary.
//  Decimal and hexadecimal are just number systems used to display those byte values for humans