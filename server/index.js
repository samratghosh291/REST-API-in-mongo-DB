const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");


const app= express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;



// Define the user schema

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    mobile: Number
  }, {
    timestamps: true
  });



// create collection

const userModel = mongoose.model("user",userSchema);  


// Read data - Get all users
app.get("/", async (req, res) => {
  try {
    const data = await userModel.find({});
    res.json({ success: true, data: data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to fetch data" });
  }
});

// Read data - Get a specific user by ID
app.get("/:id", async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
    res.json({ success: true, data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
});

// Create data - Add a new user
app.post("/create", async (req, res) => {
  try {
    const newUser = new userModel(req.body);
    await newUser.save();
    res.json({ success: true, message: "User created successfully", data: newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to create user" });
  }
});

// Update data - Update a user by ID
app.put("/update/:id", async (req, res) => {
  try {
    const updatedUser = await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
    res.json({ success: true, message: "User updated successfully", data: updatedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to update user" });
  }
});

// Delete data - Delete a user by ID
app.delete("/delete/:id", async (req, res) => {
  try {
    const deletedUser = await userModel.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
});



// connect the mongodb 

mongoose.connect("mongodb://127.0.0.1:27017/crud")
.then(()=>{
    console.log("Connected to DB");


    //connect the port

    app.listen(PORT,()=>{
        console.log(`App is running on port ${PORT}`);
    })
})
.catch((err)=>console.log(err))
