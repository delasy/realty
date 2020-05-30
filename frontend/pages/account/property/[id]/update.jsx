import React, { useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Col from 'react-bootstrap/Col'
import Error from 'next/error'
import Form from 'react-bootstrap/Form'
import Link from 'next/link'
import PropTypes from 'prop-types'
import Router from 'next/router'
import { useMutation } from '@apollo/react-hooks'

import AccountLayout from '~/layouts/account'

import GET_PRROPERTY from '~/graphql/queries/get-property'
import UPDATE_PROPERTY from '~/graphql/mutations/update-property'
import LoadingButton from '~/components/loading-button'
import withUser from '~/middlewares/user'

import '~/styles/pages/account/property/[id]/update'

const PropertyUpdatePage = ({ node }) => {
  if (!node) {
    return (
      <Error statusCode={404} />
    )
  }

  const [updateProperty] = useMutation(UPDATE_PROPERTY)
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(false)

  const [data, setData] = useState({
    name: node.name,
    notes: node.notes
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

      await updateProperty({
        variables: {
          id: node.id,
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
      <div className='property-update-page'>
        <div className='mb-4'>
          <Link href='/account/properties'>
            <a>Back</a>
          </Link>
        </div>
        <h1 className='mb-4'>
          Edit Property
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
            Save
          </LoadingButton>
        </Form>
      </div>
    </AccountLayout>
  )
}

PropertyUpdatePage.getInitialProps = async (ctx) => {
  const { query } = ctx.apolloClient
  let node = null

  try {
    const res = await query({
      fetchPolicy: 'network-only',
      query: GET_PRROPERTY,
      variables: {
        id: ctx.query.id
      }
    })

    node = res.data.node
  } catch {
  }

  if (ctx.res && node == null) {
    ctx.res.statusCode = 404
  }

  return { node }
}

PropertyUpdatePage.propTypes = {
  node: PropTypes.object
}

export default withUser(PropertyUpdatePage)
