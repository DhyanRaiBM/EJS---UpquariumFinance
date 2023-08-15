const express = require('express');
const ejs = require('ejs');
const app = express();
const { Blog, fetchBlogs } = require('./database');
const path = require('path');
const multer = require('multer');
const upload = multer();
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;


//-Middleware Section:
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views/public')));

//-Database connection:

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

app.get('/blog', async (req, res) => {
    const currentPage = parseInt(req.query.page) || 1;
    const pageSize = 9;
    const startIndex = (currentPage - 1) * pageSize;

    try {
        const totalBlogs = await Blog.countDocuments();
        const blogs = await Blog.find()
            .skip(startIndex)
            .limit(pageSize)
            .sort({ date: -1 });

        res.render('ejs/blog', { blogs, currentPage, totalBlogs, pageSize });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).send('Internal Server Error');
    }

})

//-Compose route:

app.get('/compose', (req, res) => {
    res.render('ejs/compose');
})

app.post('/compose', upload.single('image'), async (req, res) => {
    try {
        const currentDate = new Date();

        const options = {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true, // Use 12-hour format
            timeZone: 'Asia/Kolkata', // Set the time zone to IST
        };

        const formatter = new Intl.DateTimeFormat('en-IN', options);
        const formattedDate = formatter.format(currentDate);

        const { title, subject, content } = req.body;
        console.log(content);

        const imageFile = req.file; // Multer attaches the uploaded file to req.file

        if (!imageFile || !imageFile.originalname || !imageFile.mimetype) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        const image = {
            data: imageFile.buffer, // Store the image buffer directly
            contentType: imageFile.mimetype,
        };

        const blog = new Blog({
            title: title,
            subject: subject,
            content: content,
            image: image,
            date: formattedDate,
        });

        await blog.save();
        res.redirect('/blog')
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to save blog' });
    }
});

//-Single Blog route:

app.get('/single', async (req, res) => {
    try {
        const id = req.query.id.trim();
        const blog = await Blog.findById(id);
        if (!ObjectId.isValid(id)) {
            return res.status(400).send('Invalid ID format');
        }

        if (!blog) {
            return res.status(404).render('ejs/notFound');
        }

        console.log(blog.title);
        res.render('ejs/singlePost', { blog: blog });
    } catch (err) {
        console.error(err);
        res.status(500).send('error');
    }
})


//-learn Route:

app.get('/learn', (req, res) => {
    res.render('ejs/learn');
})

//-Contact route:









//!404 Error Handler
app.use((req, res, next) => {
    res.status(404).render('ejs/notfound');
});
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


