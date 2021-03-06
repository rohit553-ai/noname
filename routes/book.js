const express = require("express");
const {bookController} = require("../controllers");
const {wrapAsync} = require("../helpers");
const loggedInUser = require("../middlewares/loggedInUser");
const validationResult = require("../middlewares/validationResult");
const {userBookValidator, bookIdValidator} = require("../validations/booksvalidator");
const upload = require("../middlewares/multer")

const router = express.Router();

router.get("/",wrapAsync(bookController.getProducts));
router.get("/my-books", loggedInUser, wrapAsync(bookController.myBooks));
router.post("/", wrapAsync(bookController.postProducts));

//routes for single books
const singleBookRouter = new express.Router();
router.use("/:id", bookIdValidator(), validationResult, singleBookRouter);
singleBookRouter.get("/", bookController.getSingleProduct);
singleBookRouter.put("/", wrapAsync(bookController.editProduct));
singleBookRouter.delete("/", wrapAsync(bookController.deleteProduct));
singleBookRouter.put("/image", upload.single("image"), wrapAsync(bookController.updateImage));

//routes for books by a user
const userBooksRouter = new express.Router();
router.use("/:postedBy",userBookValidator(),validationResult,userBooksRouter);
userBooksRouter.get("/", bookController.booksByUser);

module.exports = router;