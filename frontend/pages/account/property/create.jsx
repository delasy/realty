import React, { useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Link from 'next/link'
import Router from 'next/router'
import { useMutation } from '@apollo/react-hooks'

import AccountLayout from '~/layouts/account'

import CREATE_PROPERTY from '~/graphql/mutations/create-property'
import LoadingButton from '~/components/loading-button'
import withUser from '~/middlewares/user'

import '~/styles/pages/account/property/create'

const PropertyCreatePage = () => {
  const [createProperty] = useMutation(CREATE_PROPERTY)
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(false)

  const [data, setData] = useState({
    name: '',
    notes: ''
  })

  const handleFormNameChange = (e) => {
    setErrors([])
    setData({ ...data, name: e.target.value })
  }

  const handleFormNotesChange = (e) => {
    setErrors([])
    setData({ ...data, notes: e.target.value })
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      await createProperty({
        variables: {
          input: data
        }
      })

      return Router.push('/account/properties')
    } catch (err) {
      setErrors(err.graphQLErrors)
      setLoading(false)
    }
  }

  return (
    <AccountLayout>
      <div className='property-create-page'>
        <div className='mb-4'>
          <Link href='/account/properties'>
            <a>Back</a>
          </Link>
        </div>
        <h1 className='mb-4'>
          Create Property
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
            <Col xs='6'>
              <Form.Group controlId='name'>
                <Form.Label>
                  Name
                </Form.Label>
                <Form.Control
                  autoComplete='off'
                  autoFocus
                  disabled={loading}
                  onChange={handleFormNameChange}
                  placeholder='Enter name'
                  required
                  value={data.name}
                />
              </Form.Group>
            </Col>
          </Form.Row>
          <Form.Row>
            <Col xs='6'>
              <Form.Group controlId='notes'>
                <Form.Label>
                  Notes
                </Form.Label>
                <Form.Control
                  as='textarea'
                  autoComplete='off'
                  disabled={loading}
                  onChange={handleFormNotesChange}
                  placeholder='Enter notes'
                  rows='10'
                  value={data.notes}
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
            Create
          </LoadingButton>
        </Form>
      </div>
    </AccountLayout>
  )
}

export default withUser(PropertyCreatePage)
