import fs from 'fs';
import path from 'path';

export default class Encode {
    static Image(response) {
        let readStream = fs.ReadStream(path.join(__dirname, '../assets/nature.png'));
        readStream.pipe(response);
        readStream.on('close', () => {
            response.writeHead(200);
            response.end(/*JSON.stringify({seccess:"Image encoded"})*/);
        })
    }
}