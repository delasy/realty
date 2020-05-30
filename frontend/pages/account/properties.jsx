import React from 'react'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Link from 'next/link'
import Row from 'react-bootstrap/Row'

import AccountLayout from '~/layouts/account'

import GET_PROPERTIES from '~/graphql/queries/get-properties'
import PropertyRow from '~/components/property-row'
import ScrollPagination from '~/components/scroll-pagination'
import withUser from '~/middlewares/user'

import '~/styles/pages/account/properties'

const AccountPropertiesPage = () => {
  return (
    <AccountLayout>
      <div className='account-properties-page'>
        <Row className='mb-4'>
          <Col xs='6'>
            <Link href='/account'>
              <a>Back</a>
            </Link>
          </Col>
          <Col className='d-flex justify-content-end' xs='6'>
            <Link href='/account/property/create'>
              <Button variant='primary'>
                Create
              </Button>
            </Link>
          </Col>
        </Row>
        <ScrollPagination name='properties' query={GET_PROPERTIES}>
          {(property, idx) => {
            return (
              <PropertyRow
                idx={idx}
                key={property.id}
                property={property}
              />
            )
          }}
        </ScrollPagination>
      </div>
    </AccountLayout>
  )
}

export default withUser(AccountPropertiesPage)
