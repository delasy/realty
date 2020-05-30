import React from 'react'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import PropTypes from 'prop-types'
import Row from 'react-bootstrap/Row'
import classnames from 'classnames'

import '~/styles/styles'

import '~/styles/layouts/auth'

const AuthLayout = ({ children, className: inheritClassName, ...props }) => {
  const className = classnames(inheritClassName, 'auth-layout')

  return (
    <div className={className} {...props}>
      <Container className='py-4'>
        <Row className='justify-content-center'>
          <Col xs='6'>
            <main>
              {children}
            </main>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

AuthLayout.defaultProps = {
  children: null,
  className: ''
}

AuthLayout.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
}

export default AuthLayout
