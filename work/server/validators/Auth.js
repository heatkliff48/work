const validateRequest = require('../utils/ValidateRequest.js');
const Yup = require('yup');

const signInSchema = Yup.object({
  body: Yup.object({
    username: Yup.string()
      .required('Поле обязательно!')
      .max(25, 'Максимальная длина - 25 символов'),
    password: Yup.string()
      .required('Поле обязательно!')
      .min(3, 'Пароль слишком короткий - минимум 3 символа')
      .max(50, 'Максимальная длина - 50 символов'),
  }),
});

const signUpSchema = Yup.object({
  // body: Yup.object({
  //   email: Yup.string().required('Поле обязательно!'),
  //   username: Yup.string()
  //     .required('Поле обязательно!')
  //     .max(25, 'Максимальная длина - 25 символов'),
  // password: Yup.string()
  //   .required('Поле обязательно!')
  //   .min(3, 'Пароль слишком короткий - минимум 3 символа')
  //   .max(50, 'Максимальная длина - 50 символов'),
  // role: Yup.number()
  //   .required('Поле обязательно!')
  //   .typeError('Значение должно быть числом!')
  //   .min(1, 'Минимальное значение - 1')
  //   .max(3, 'Максимальное значение - 3'),
  // }),
});

const logoutSchema = Yup.object({
  cookies: Yup.object({
    refreshToken: Yup.string().required('Поле обязательно!'),
  }),
});

class AuthValidator {
  static async signIn(req, res, next) {
    return validateRequest(req, res, next, signInSchema);
  }

  static async signUp(req, res, next) {
    return validateRequest(req, res, next, signUpSchema);
  }

  static async logOut(req, res, next) {
    return validateRequest(req, res, next, logoutSchema);
  }

  static async refresh(req, res, next) {
    return validateRequest(req, res, next);
  }
}

module.exports = { AuthValidator, signInSchema, signUpSchema, logoutSchema };
