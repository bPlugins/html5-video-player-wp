function getFileExtension(filePath) {
  // Use the `split` method to separate the file name and extension
  const parts = filePath.split(".");

  // Check if there's more than one part (meaning there's an extension)
  if (parts.length > 1) {
    // Get the last part as the extension
    const extension = parts[parts.length - 1];
    return extension.toLowerCase(); // Optionally convert to lowercase
  } else {
    // If there's no extension, return an empty string or null, depending on your preference
    return ""; // or return null;
  }
}

export default getFileExtension;
