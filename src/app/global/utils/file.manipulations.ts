export function blobToFile(blob: Blob, fileName: string): File {
  const options: FilePropertyBag = { type: blob.type };
  const file = new File([blob], fileName, options);

  return file;
}
