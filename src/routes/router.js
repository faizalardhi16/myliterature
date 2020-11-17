const express = require('express');
require('dotenv').config();
const router = express.Router();

const { register, login, checkAuth } = require('../controller/auth');
const {
	readBooks,
	createBooks,
	deleteBooks,
	readOne,
	updateBooks,
	getLiteratures,
} = require('../controller/books');
const {
	getCategory,
	createCategory,
	deleteCategory,
	detailsCategory,
	updateCategory,
} = require('../controller/categories');
const {
	getUsers,
	deleteUser,
	detailUser,
	updateUser,
} = require('../controller/user');
const { authenticated } = require('../middleware/authentication');
const { upload } = require('../middleware/uploadFile');
const { uploadImage } = require('../middleware/uploadImage');
const {
	getCollection,
	addCollection,
	deleteCollection,
} = require('../controller/collection');

//Books router
router.get('/books', readBooks);
router.get('/books/:id', readOne);
router.get('/literature?', getLiteratures);
router.post('/books/post', upload('file'), createBooks);
router.delete('/books/:id', deleteBooks);
router.patch('/books/edit/:id', updateBooks);

//categories router
router.get('/categories', getCategory);
router.get('/categories/:id', detailsCategory);
router.post('/categories/post', createCategory);
router.delete('/categories/:id', deleteCategory);
router.patch('/categories/edit/:id', updateCategory);

//User router
router.get('/users', getUsers);
router.delete('/user/:id', deleteUser);
router.get('/user/:id', detailUser);
router.patch('/user/edit/:id', uploadImage('file'), updateUser);

//auth
router.post('/register', register);
router.post('/login', login);
router.get('/auth', authenticated, checkAuth);

//collection
router.get('/collection/:id', getCollection);
router.post('/collection/:booksId', addCollection);
router.delete('/collection/:id', deleteCollection);

module.exports = router;
