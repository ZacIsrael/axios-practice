import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

// Set EJS as the templating engine
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Step 1: Make sure that when a user visits the home page,
//   it shows a random activity.You will need to check the format of the
//   JSON data from response.data and edit the index.ejs file accordingly.
app.get("/", async (req, res) => {
  try {
    // console.log('Deafult GET request\'s body = ', req.body)
    const response = await axios.get("https://bored-api.appbrewery.com/random");
    const result = response.data;
    // could be possibly used for filtering in the EJS file
    result.method = "GET";
    console.log("default route: result = ", result);
    res.render("index.ejs", { data: result });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }
});

app.post("/", async (req, res) => {
  console.log("post: req.body = ", req.body);

  // Step 2: Play around with the drop downs and see what gets logged.
  try {
    // Use axios to make an API request to the /filter endpoint. Making
    // sure you're passing both the type and participants queries.
    const response = await axios.get(
      `https://bored-api.appbrewery.com/filter`,
      // query parameters
      {
        params: {
          type: req.body.type,
          participants: req.body.participants,
        },
      }
    );
    const result = response.data;
    // could be possibly used for filtering in the EJS file
    result.method = "POST";

    // randomly picking one of the activities that was retrieved
    let randomActivity = result[Math.floor(Math.random() * result.length)];
    console.log('randomActivity = ', randomActivity);
    // Render the index.ejs file with a single *random* activity that comes back
    // from the API request.
    res.render("index.ejs", { data: randomActivity });
  } catch (error) {
    // Step 3: If you get a 404 error (resource not found) from the API request.
    // Pass an error to the index.ejs to tell the user:
    // "No activities that match your criteria."
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
        error: "No activities that match your criteria."
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
