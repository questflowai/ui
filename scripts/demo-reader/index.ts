import fs from 'fs/promises';
import path from 'path';

async function readFileContent(filePath: string): Promise<string> {
  try {
    const absolutePath = path.resolve(filePath);
    const content = await fs.readFile(absolutePath, 'utf-8');
    return content;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error reading file: ${error.message}`);
    }
    throw new Error('An unknown error occurred while reading the file.');
  }
}

async function main() {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error('Please provide a file path.');
    process.exit(1);
  }

  try {
    const content = await readFileContent(filePath);
    console.log(JSON.stringify(content));
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error('An unknown error occurred.');
    }
    process.exit(1);
  }
}

main();
