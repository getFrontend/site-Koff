let like = 0;

export const likeSVG = async () => {
  if (!like) {
    const response = await fetch("./img/like.svg");
    const svg = await response.text();

    like = new DOMParser()
      .parseFromString(svg, "image/svg+xml")
      .querySelector('svg');
  }
  return like.cloneNode(true);
};