let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let img = new Image();

img.onload = () => {
    console.log('Image loaded successfully');
    drawImageOnCanvas(img);
    updatePreview();
};

img.onerror = () => {
    console.error('Failed to load image');
    alert('Failed to load image. Please check the file or URL.');
    resetPreview();
};

function loadImage() {
    let fileInput = document.getElementById('uploadInput');
    let urlInput = document.getElementById('urlInput').value;

    if (fileInput.files && fileInput.files[0]) {
        console.log('Loading image from file input');
        let reader = new FileReader();
        reader.onload = function (e) {
            img.src = e.target.result;
        }
        reader.readAsDataURL(fileInput.files[0]);
    } else if (urlInput) {
        console.log('Loading image from URL input');
        img.crossOrigin = "Anonymous"; // To avoid CORS issues
        img.src = urlInput;
    } else {
        alert('Please upload a file or enter a URL');
        resetPreview();
    }
}

function drawImageOnCanvas(image) {
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
}

function applyAnimeStyle() {
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];     // Invert red
        data[i + 1] = 255 - data[i + 1]; // Invert green
        data[i + 2] = 255 - data[i + 2]; // Invert blue
    }
    ctx.putImageData(imageData, 0, 0);
    updatePreview();
}

function applyPixelArt() {
    let pixelSize = 10; // Size of the "pixels"
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;
    let width = imageData.width;
    let height = imageData.height;

    for (let y = 0; y < height; y += pixelSize) {
        for (let x = 0; x < width; x += pixelSize) {
            let red = data[((width * y) + x) * 4];
            let green = data[((width * y) + x) * 4 + 1];
            let blue = data[((width * y) + x) * 4 + 2];

            for (let n = 0; n < pixelSize; n++) {
                for (let m = 0; m < pixelSize; m++) {
                    if (x + m < width && y + n < height) {
                        data[((width * (y + n)) + (x + m)) * 4] = red;
                        data[((width * (y + n)) + (x + m)) * 4 + 1] = green;
                        data[((width * (y + n)) + (x + m)) * 4 + 2] = blue;
                    }
                }
            }
        }
    }
    ctx.putImageData(imageData, 0, 0);
    updatePreview();
}

function removeWhiteBackground() {
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        if (data[i] > 240 && data[i + 1] > 240 && data[i + 2] > 240) {
            data[i + 3] = 0; // Set alpha to 0
        }
    }
    ctx.putImageData(imageData, 0, 0);
    updatePreview();
}

function updatePreview() {
    let previewImg = document.getElementById('previewImg');
    let downloadBtn = document.getElementById('downloadBtn');
    previewImg.src = canvas.toDataURL();
    previewImg.style.display = 'block';
    downloadBtn.style.display = 'block';
}

function resetPreview() {
    let previewImg = document.getElementById('previewImg');
    let downloadBtn = document.getElementById('downloadBtn');
    previewImg.src = '';
    previewImg.style.display = 'none';
    downloadBtn.style.display = 'none';
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
}

function downloadImage() {
    let link = document.createElement('a');
    link.download = 'transformed_image.png';
    link.href = canvas.toDataURL();
    link.click();
}
