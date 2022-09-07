//DEPENDENCIES
const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/products")

const Seed = require("./models/seedroute")

const methodOverride = require("method-override")

//DATABASE CONFIGURATION
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection
db.on('error', (err) => console.log(err.message + ' is mongo not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));

// Middleware
// Body parser middleware: give us access to req.body
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"))

//ROUTES
app.get('/products/seedroute', (req, res) => {
    Product.deleteMany({}, (error, allProducts) => { });
    Product.create(Seed, (error, data) => {
        res.redirect('/products');
    })
})

//INDEX
app.get('/products', (req, res) => {
    Product.find({}, (error, allProducts) => {
        res.render('index.ejs', {
            products: allProducts,
        });
    });
});

//NEW
app.get('/products/new', (req, res) => {
    res.render('new.ejs');
});

//DELETE

//Test the route, once it works comment out and go to next step below//
// app.delete("/products/:id", (req, res) => {
//     res.send("deleting...")
//   })


app.delete("/products/:id", (req, res) => {
    Product.findByIdAndDelete(req.params.id, (err, data) => {
        res.redirect("/products")
    })
})

//UPDATE

app.put("/products/:id", (req, res) => {
    Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
        },
        (error, updatedProduct) => {
            res.redirect(`/products/${req.params.id}`)
        }
    )
})

//CREATE
app.post('/products', (req, res) => {
    Product.create(req.body, (error, createdProduct) => {
        res.redirect('/products');
    });
})



//SHOW
app.get('/products/:id', (req, res) => {
    Product.findById(req.params.id, (err, foundProduct) => {
        res.render('show.ejs', {
            product: foundProduct
        });
    });
});
//EDIT

app.get("/products/:id/edit", (req, res) => {
    Product.findById(req.params.id, (error, foundProduct) => {
        res.render("edit.ejs", {
            product: foundProduct,
        })
    })
})

// LISTENER
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`The server is listening on port: ${PORT}`)
})
