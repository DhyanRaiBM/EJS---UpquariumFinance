const express = require('express');
const ejs = require('ejs');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'views/public')));

app.set('view engine', 'ejs')

//-Home route:
app.get('/', (req, res) => {
    res.render('ejs/home');
});

//-About route:
app.get('/about', (req, res) => {
    res.render('ejs/about');
});

//-Contact route:

app.get('/contact', (req, res) => {
    res.render('ejs/contact');
});

//-Blog route:
app.get('/blog', (req, res) => {
    res.render('ejs/blog');
})

//-Compose route:

app.get('/compose', (req, res) => {
    res.render('ejs/compose');
})

//-Login route:

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
