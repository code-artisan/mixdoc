import fs from 'fs';
import path from 'path';

const clean = async () => {
  fs.rmdirSync(path.resolve(__dirname, '../dist'), { recursive: true });
}

export default clean
