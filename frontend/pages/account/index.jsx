import React from 'react'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Link from 'next/link'
import PropTypes from 'prop-types'
import Row from 'react-bootstrap/Row'

import AccountLayout from '~/layouts/account'

import Greeting from '~/components/greeting'
import withUser from '~/middlewares/user'

import '~/styles/pages/account'

const AccountPage = ({ user }) => {
  return (
    <AccountLayout>
      <div className='account-page'>
        <Row className='align-items-center mb-4'>
          <Col>
            <Link href='/account/properties'>
              <a>Properties</a>
            </Link>
          </Col>
          <Col xs='auto'>
            <Link href='/auth/signout'>
              <Button variant='primary'>
                Sign Out
              </Button>
            </Link>
          </Col>
        </Row>
        <Greeting user={user} />
      </div>
    </AccountLayout>
  )
}

AccountPage.propTypes = {
  user: PropTypes.object.isRequired
}

export default withUser(AccountPage)
