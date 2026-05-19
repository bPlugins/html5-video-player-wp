function camelToKebabCase(inputString) {
  return inputString.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

export default camelToKebabCase;
