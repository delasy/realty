import React, { useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import { useMutation } from '@apollo/react-hooks'

import AuthLayout from '~/layouts/auth'

import AUTHENTICATE_USER from '~/graphql/mutations/authenticate-user'
import LoadingButton from '~/components/loading-button'
import withGuest from '~/middlewares/guest'
import { apolloHelpers } from '~/middlewares/apollo'

import '~/styles/pages/auth/signin'

const AuthSigninPage = () => {
  const [authenticateUser] = useMutation(AUTHENTICATE_USER)
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(false)

  const [data, setData] = useState({
    email: '',
    password: ''
  })

  const handleFormEmailChange = (e) => {
    setErrors([])
    setData({ ...data, email: e.target.value })
  }

  const handleFormPasswordChange = (e) => {
    setErrors([])
    setData({ ...data, password: e.target.value })
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      const res = await authenticateUser({
        variables: {
          input: data
        }
      })

      await apolloHelpers.onSignin(null, res.data.authenticateUser.token)
    } catch (err) {
      setErrors(err.graphQLErrors)
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className='auth-signin-page'>
        <h1 className='mb-4'>
          Sign In
        </h1>
        {errors.length > 0 && (
          errors.map((error, idx) => {
            return (
              <Alert key={idx} variant='danger'>
                {error.message}
              </Alert>
            )
          })
        )}
        <Form onSubmit={handleFormSubmit}>
          <Form.Row>
            <Col xs='12'>
              <Form.Group controlId='email'>
                <Form.Label>
                  Email address
                </Form.Label>
                <Form.Control
                  autoComplete='email'
                  autoFocus
                  disabled={loading}
                  onChange={handleFormEmailChange}
                  placeholder='Enter email'
                  required
                  type='email'
                  value={data.email}
                />
              </Form.Group>
            </Col>
            <Col xs='12'>
              <Form.Group controlId='password'>
                <Form.Label>
                  Password
                </Form.Label>
                <Form.Control
                  autoComplete='current-password'
                  disabled={loading}
                  onChange={handleFormPasswordChange}
                  placeholder='Enter password'
                  required
                  type='password'
                  value={data.password}
                />
              </Form.Group>
            </Col>
          </Form.Row>
          <LoadingButton
            className='mt-4'
            disabled={errors.length !== 0}
            loading={loading}
            type='submit'
          >
            Sign in
          </LoadingButton>
        </Form>
      </div>
    </AuthLayout>
  )
}

export default withGuest(AuthSigninPage)
