import { Types } from 'mongoose';
import * as path from 'path';
import { promisify } from 'util';
import * as fs from 'fs';

const asyncWriteFile = promisify(fs.writeFile);

export const recordFile = async (
  file: Express.Multer.File,
  publicFolder: string
) => {
  const fileExtension = path.extname(file.originalname).toLowerCase();
  const buffer = file.buffer;
  const folderName = path.join(__dirname, '..', '..', publicFolder);
  const imageName = `${new Types.ObjectId()}${fileExtension}`;
  const fullImagePath = path.join(folderName, imageName);

  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName, { recursive: true });
  }

  await asyncWriteFile(fullImagePath, buffer);

  return { imageName, fullImagePath };
};
