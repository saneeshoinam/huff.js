class Node {
    constructor(char, freq) {
        Object.assign(this, { char, freq, left: null, right: null })
    }
}

class MinHeap {
    constructor() {
        this.heap = [];
    }

    insert(node) {
        this.heap.push(node);
        this.bubbleUp();
    }

    pop() {
        const minNode = this.heap[0];
        const lastNode = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = lastNode;
            this.sinkDown();
        }
        return minNode;
    }

    bubbleUp() {
        let index = this.heap.length - 1;
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[parentIndex].freq <= this.heap[index].freq) break;
            [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
            index = parentIndex;
        }
    }

    sinkDown() {
        let index = 0;
        const length = this.heap.length;
        while (true) {
            let leftIndex = 2 * index + 1;
            let rightIndex = 2 * index + 2;
            let smallest = index;

            if (leftIndex < length && this.heap[leftIndex].freq < this.heap[smallest].freq) {
                smallest = leftIndex;
            }
            if (rightIndex < length && this.heap[rightIndex].freq < this.heap[smallest].freq) {
                smallest = rightIndex;
            }
            if (smallest === index) break;
            [this.heap[smallest], this.heap[index]] = [this.heap[index], this.heap[smallest]];
            index = smallest;
        }
    }

    size() {
        return this.heap.length;
    }
}

class HuffBuilder {
    tree(text) {
        const frequency = {};
        for (let char of text) {
            frequency[char] = (frequency[char] || 0) + 1;
        }

        const heap = new MinHeap();
        for (let char in frequency) {
            heap.insert(new Node(char, frequency[char]));
        }

        while (heap.size() > 1) {
            const left = heap.pop();
            const right = heap.pop();
            const merged = new Node(null, left.freq + right.freq);
            merged.left = left;
            merged.right = right;
            heap.insert(merged);
        }

        return heap.pop(); // Root of the Huffman tree
    }

    codes(node, prefix = "", codes = {}) {
        if (node === null) return codes;

        if (node.char !== null) {
            codes[node.char] = prefix;
        }

        this.codes(node.left, prefix + "0", codes);
        this.codes(node.right, prefix + "1", codes);

        return codes;
    }

}

window.hf = {
    HuffmanBuilder: new HuffBuilder,
    encode(text, codes) {
        if (!codes) codes = this.HuffmanBuilder.codes(this.HuffmanBuilder.tree(text)); // Building codes if not defined

        let encodedText = "";
        for (let char of text) encodedText += codes[char];

        // Calculate how many padding bits are needed to make the encodedText a multiple of 8
        const padding = 8 - (encodedText.length % 8);
        // If padding is required, append padding bits (zeros)
        encodedText += '0'.repeat(padding);

        // Convert the encoded text into ArrayBuffer (binary format)
        const buffer = new ArrayBuffer(Math.ceil(encodedText.length / 8));
        const view = new DataView(buffer);

        let byteIndex = 0;
        let bitIndex = 0;
        for (let i = 0; i < encodedText.length; i++) {
            const bit = encodedText[i] === "1" ? 1 : 0;
            view.setUint8(byteIndex, view.getUint8(byteIndex) | (bit << (7 - bitIndex)));

            bitIndex++;
            if (bitIndex === 8) {
                bitIndex = 0;
                byteIndex++;
            }
        }

        return { buffer, codes, padding }; // Return the padding length alongside buffer
    },
    decode(buffer, codes, padding = 0) {
        const reverseCodes = Object.fromEntries(Object.entries(codes).map(([key, value]) => [value, key]));

        let encodedText = "";
        const view = new DataView(buffer);
        for (let byteIndex = 0; byteIndex < buffer.byteLength; byteIndex++) {
            let byte = view.getUint8(byteIndex);
            for (let bitIndex = 0; bitIndex < 8; bitIndex++) {
                encodedText += (byte & (1 << (7 - bitIndex))) ? '1' : '0';
            }
        }

        // Remove the padding from the encoded text
        encodedText = encodedText.slice(0, encodedText.length - padding);

        let decodedText = "";
        let currentCode = "";
        for (let bit of encodedText) {
            currentCode += bit;
            if (reverseCodes[currentCode]) {
                decodedText += reverseCodes[currentCode];
                currentCode = "";
            }
        }

        return decodedText;
    }
}