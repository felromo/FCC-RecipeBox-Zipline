# Recipe Box Application For FreeCodeCamp

## About
Recipe Box is a web application designed to allow the user to add recipes and display them as a list. Also allowing the user to delete or continue to add recipes as they wish. While storing the list of recipes into local browser memory so that they persist if the web app is refreshed.

## Screenshots
![alt-text](./preview1.png?raw=true)

## Using The Application

### Try it out
There is a github page provided to try out the application without having to pull the repo
http://tyrantwarship.github.io/FCC-RecipeBox-Zipline/

## How-to Run Locally
First you'll need to run `npm install` to install all the dependencies listed in the provided package.json

Then `npm run dev` to run the web application server on port 3000 (you can change this by modifying the listening port on server.js)

Finally fire up a web browser and point it to http://localhost:3000

### How to Build
You can build it with `npm run deploy` and it will create a bundle.js inside of the dist folder containing all the dependencies

Happy Hacking! Pull requests welcome

## TODO
Serious refactoring needed

## Credits
Sortable list taken from this tutorial [here](http://webcloud.se/sortable-list-component-react-js/)
