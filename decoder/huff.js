window.hf = {
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