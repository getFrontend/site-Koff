export const likeSVG = async () => {
    const response = await fetch("./img/like.svg");
    const svg = await response.text();

    return new DOMParser()
        .parseFromString(svg, "image/svg+xml")
        .querySelector('svg');
}