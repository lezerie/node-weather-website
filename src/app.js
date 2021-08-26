const express = require("express");
const path = require("path");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();
const port = process.env.PORT || 3000;

//Define paths for Express config
const publicDirectory = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//Setup handlebars, engine and view locatoin
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

//Setup static directory to serve
app.use(express.static(publicDirectory));

app.get("", (request, response) => {
  response.render("index", {
    title: "Home",
    name: "Lezerie",
    describe: "Primary details about the page",
  });
});

app.get("/weather", (request, response) => {
  if (!request.query.address) {
    return response.send({
      error: "You must provide a valid location",
    });
  }
  geocode(
    request.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return response.send({ error });
      }
      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return response.send({ error });
        }

        response.send({
          forecast: forecastData,
          location,
          address: request.query.address,
        });
      });
    }
  );
});

app.get("/help", (request, response) => {
  response.render("help", {
    title: "Help",
    name: "Jaerah",
    describe: "Tips in using the website",
  });
});

app.get("/about", (request, response) => {
  response.render("about", {
    title: "About Me",
    name: "Lezerie Badosa",
    location: "Philippines",
    describe: "Details of the creator",
  });
});

app.get("/products", (request, response) => {
  if (!request.query.search) {
    return response.send({
      error: "You must provide a search term",
    });
  }
  console.log(request.query);

  response.send({
    products: [],
  });
});

app.get("/help/*", (request, response) => {
  response.render("404", {
    title: "404",
    name: "Jae",
    errorMessage: "Article not yet available",
  });
});

app.get("*", (request, response) => {
  response.render("404", {
    title: "404",
    name: "Jae",
    errorMessage: "Page not found!",
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});
