# Image Search Abstraction Layer

## Versions

Create a file named `.env` in the root directory. This file should contain:

```
MONGO_URI=mongodb://localhost:27017/apidatabase
PORT=8080
APP_URL=http://localhost:8080/
```

### Starting the App

`node server.js` 

### Heroku app

imagesearchapi-imadmk.herokuapp.com

### Using this app

     User stories:

        1) I can get the image URLs, alt text and page urls for a set of images relating to a given search string.

        2) I can paginate through the responses by adding a ?offset=2 parameter to the URL.

        3)  I can get a list of the most recently submitted search strings.

Example usage:

Search for images like this:
https://imagesearchapi-imadmk.herokuapp.com/api/imagesearch/great%20barrier
or
https://imagesearchapi-imadmk.herokuapp.com/api/imagesearch/great%20barrier?offset=10

and browse recent search queries like this: 
https://imagesearchapi-imadmk.herokuapp.comapi/latest/imagesearch/