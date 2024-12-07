## Custom Huffman Encoder/Decoder (v1.0)

This document provides a guide on how to use the custom Huffman encoder/decoder created by Saneesh Oinam.

### Usage

There are two main functions for encoding and decoding text:

1. **Encoding:**

   - `hf.encode(text, codes)` 

     This function encodes the given text into Huffman-encoded binary data.

     - `text` (string): The text string to encode.
     - `codes` (optional, object): If you already have a Huffman code map, you can pass it to use the custom code map.

     The function returns an object with:
     - `buffer`: The encoded binary data.
     - `codes`: The Huffman code map.
     - `padding`: The number of padding bits used during encoding.

2. **Decoding:**

   - `hf.decode(buffer, codes, padding)`

     This function decodes the given binary data back into the original text.

     - `buffer` (string): The binary string to decode.
     - `codes` (object): The Huffman code map.
     - `padding` (number): The number of padding bits used during encoding.

### Code Implementation

```javascript
// Example text string
const text = "this is an example of huffman encoding";

// Encoding the text
const { buffer, codes, padding } = hf.encode(text);
console.log("Encoded Buffer:", buffer);
console.log("Huffman Codes:", codes);
console.log("Padding:", padding);

// Decoding the buffer back to original text
const decodedText = hf.decode(buffer, codes, padding);
console.log("Decoded Text:", decodedText);
```