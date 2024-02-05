export function getLastIndex(str: string) {
  const lastDotIndex = str.lastIndexOf('.');
  if (lastDotIndex !== -1) {
    return str.slice(lastDotIndex + 1);
  }
  return str;
}

export function findAndReplaceFromArray(list: any[], param1: any, param2: any, newElement) {
  // Find the file in the array
  const foundFileIndex = list.findIndex((f) => f[param1] == param2);

  if (foundFileIndex !== -1) {
    // Replace the old file with the new one
    list[foundFileIndex] = newElement;
    return list
  } else {
    console.error('File not found in the array.');
  }
}


// Function to get enum key by value
export function getEnumKeyByEnumValue(myEnum: any, enumValue: string): string | null {
  let keys = Object.keys(myEnum).filter(x => myEnum[x] == enumValue);
  return keys.length > 0 ? keys[0] : null;
}