// Form validator when creating a new user

import { body } from 'express-validator'

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";
const emailErr = "must be a valid email address";

const validateUser = [
  body("handle")
    .trim()
    .notEmpty()
    .withMessage("Handle is required")
    .isLength({ min: 1, max: 15 })
    .withMessage("Handle must be between 1 and 15 characters"),
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isAlpha()
    .withMessage(`Name ${alphaErr}`)
    .bail()
    .isLength({ min: 1, max: 10 })
    .withMessage(`Name ${lengthErr}`),
  body("surname")
    .trim()
    .notEmpty()
    .withMessage("Surname is required")
    .isAlpha()
    .withMessage(`Surname ${alphaErr}`)
    .bail()
    .isLength({ min: 1, max: 10 })
    .withMessage(`Surname ${lengthErr}`),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage(`Email ${emailErr}`),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
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
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),
];

export default validateUser;