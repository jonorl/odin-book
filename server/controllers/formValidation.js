// formValidation.js
import { body } from 'express-validator';

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";
const emailErr = "must be a valid email address";

const validateUser = [
  body("handle")
    .trim()
    .notEmpty()
    .withMessage("Handle is required.")
    .bail()
    .isLength({ min: 4, max: 10 })
    .withMessage(`Handle ${lengthErr}`),
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .bail()
    .isAlpha()
    .withMessage(`Name ${alphaErr}`)
    .bail()
    .isLength({ min: 2, max: 10 })
    .withMessage(`Name ${lengthErr}`),
  body("surname")
    .trim()
    .notEmpty()
    .withMessage("Surname is required.")
    .bail()
    .isAlpha()
    .withMessage(`Surname ${alphaErr}`)
    .bail()
    .isLength({ min: 2, max: 10 })
    .withMessage(`Surname ${lengthErr}`),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .bail()
    .isEmail()
    .withMessage(`Email ${emailErr}`),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required.")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long.")
    .bail()
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]).{8,}$/
    )
    .withMessage(
      "Password must contain a minimum of eight characters, at least one letter, one number and one special character."
    ),
  body("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage("Password confirmation is required.")
    .bail()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),
];

export default validateUser;