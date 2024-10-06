import React, { useState, useEffect } from 'react';


function ImageDisplay() {

    const [imageUrl, setImageUrl] = useState(''); // State variable to hold the image URL

    const fetchImage = async () => {
        try {
            const response = await fetch('http://localhost:8000/image');
            const text = await response.text(); // Wait for the response to be converted to text
            setImageUrl(text); // Save the returned image URL to state
            console.log(text); // Log the image URL
        } catch (error) {
            console.error('Error fetching text:', error);
        }
    };

    useEffect(() => {
        fetchImage(); // Call fetchImage when the component mounts
    }, []); // Empty dependency array means it runs once on mount

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