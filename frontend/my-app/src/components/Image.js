import React from 'react';

function ImageDisplay(imageUrl) {

    fetch('http://localhost:8000/api/imageLink')
    .then(response => response.text())
    .then(text => {
        imageUrl = text;
        console.log(text);
    })
    .catch(error => {
        console.error('Error fetching text:', error);
    });

    return (
        <div>
            {imageUrl ? ( // Conditional rendering to check if imageUrl is available
                <img src={imageUrl} alt="Description" style={{ width: '300px', height: 'auto' }} />
            ) : (
                <p>Loading...</p> // Show loading text while fetching
            )}
        </div>
    );
}

export default ImageDisplay;