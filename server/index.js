const express = require("express");
const path  = require("path");
const port = process.env.PORT || 3000;
const app = express();

 const staticDirName = path.join(__dirname, "../client");
app.use(express.static(staticDirName));

app.listen(port,(err)=>{
    if(err) throw err;
    console.log(`Server is running on port ${port}`);
})
