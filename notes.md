# changes
* removed /app/api/house folder - unused because /api/reps fetches all federal reps
* removed /app/data folder - unused, was used for seeding db
* removed /app/scripts - no longer used
* added descriptions for api routes
* rewrite /api/rep-image - return image data instead of URL.
    By changing this API, we need to refactor or possibly remove the useRepImage hook. This hook used to be used to fetch the URL for each member. All this searching and validated occured in the back end and then the image would be requested in the front end. Why not just let the backend return the image.

