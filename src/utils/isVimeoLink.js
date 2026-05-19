function isVimeoLink(source) {
  if (!source) return false;
  // Regular expression pattern to match Vimeo video URLs
  // const vimeoPattern = /^(https?:\/\/)?(www\.)?(player\.)?vimeo\.com\/(video\/)?(\d+)(\/[^\s]*)?$/;
  // const id = source?.match(vimeoPattern)?.[5];
  const id = getVimeoId(String(source));


  if (id) {
    return `https://player.vimeo.com/video/${id}`;
    // https://vimeo.com/920314562
  }

  if (!isNaN(source)) {
    return `https://player.vimeo.com/video/${source}`;
  }
  // return vimeoPattern.test(source);
}

export default isVimeoLink;



export function getVimeoId(url) {
  if (!url) return null;

  if (!isNaN(url)) {
    return url;
  }

  const regex =
    /^(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com\/(?:.*\/)?|player\.vimeo\.com\/video\/)(\d+)/;

  const match = url.match(regex);
  return match ? match[1] : null;
}