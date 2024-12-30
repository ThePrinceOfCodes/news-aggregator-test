import { CreateAccountPayload } from '@/interfaces/user-account-interface'
import * as Yup from "yup"

export const validateLoginForm = Yup.object<Pick<CreateAccountPayload, "email" | "password">>().shape({
  email: Yup.string().email().required(),
  password: Yup.string().required()
})

export const validateForgotPasswordForm = Yup.object<Pick<CreateAccountPayload, "email">>().shape({
  email: Yup.string().email().required()
})

export const validateCreateAccountForm = Yup.object<CreateAccountPayload>().shape({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
  name: Yup.string().required(),
  password_confirmation: Yup.string().required('Confirm Password is required')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
})


export const validateResetAccountForm = Yup.object<Pick<CreateAccountPayload, "password"> & { token: string }>().shape({
  token: Yup.string().required("invalid reset password link"),
  password: Yup.string().required("Set your password").min(6, "Passwords must be at least 6 characters long")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
})

export const validateChangeAccountForm = Yup.object<Pick<CreateAccountPayload, "password"> & { oldPassword: string }>().shape({
  oldPassword: Yup.string().email().required(),
  password: Yup.string().required("Set your password").min(6, "Passwords must be at least 6 characters long")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
})

