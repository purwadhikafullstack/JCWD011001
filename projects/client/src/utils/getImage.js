const IMAGE_URL = process.env.REACT_APP_IMAGE_URL;

function getImage(imagePath) {
    return `${IMAGE_URL}/${imagePath}`;
}

export default getImage;