// Load environment variables from .env file
require('dotenv').config();

function ImageDisplay(query) {
    const API_KEY = process.env.API_KEY;

    if (!API_KEY) {
        console.error('API_KEY is not defined. Please check your .env file.');
        return;
    }

    fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=1`, {
        method: 'GET',
        headers: {
            'Authorization': API_KEY
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.photos && data.photos.length > 0) {
            const firstPhoto = data.photos[0]; // Get the first photo
            const url = firstPhoto.src.original; // Get the original image link
            console.log('Image Link:', url);
            app.get('/api/imageLink', (req, res) => {
                res.send(url);
            });
            return url;
        } else {
            console.log('No photos found.');
        }
    })
    .catch(error => {
        console.error('Error fetching images:', error);
    });
}

/*
PYTHON CODE
from pexels_api import API

PEXELS_API_KEY = ''
api = API(PEXELS_API_KEY)

# How many images
results = 1

def getImage(query):
  # Search API
  api.search(query, page=1, results_per_page=results)
  # Get photo entries
  photos = api.get_entries()
  for photo in photos:
    print('Photo link:', photo.original)
    return photo.original
*/