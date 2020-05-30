import React from 'react'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Link from 'next/link'
import PropTypes from 'prop-types'
import Row from 'react-bootstrap/Row'
import classnames from 'classnames'

import '~/styles/components/property-row'

const PropertyRow = ({
  className: inheritClassName,
  idx,
  property,
  ...props
}) => {
  const className = classnames(inheritClassName, 'property-row rounded-0', {
    'border-top-0': idx !== 0
  })

  return (
    <Card className={className} {...props}>
      <Card.Body>
        <Row className='align-items-center'>
          <Col>
            <Card.Text as='h6' className='m-0'>
              {property.name}
            </Card.Text>
          </Col>
          <Col xs='auto'>
            <Link
              as={'/account/property/' + property.id + '/update'}
              href='/account/property/[id]/update'
            >
              <Button variant='primary'>
                Edit
              </Button>
            </Link>
            <Button className='ml-2' variant='primary'>
              Duplicate
            </Button>
            <Button className='ml-2' variant='danger'>
              Delete
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}

PropertyRow.defaultProps = {
  className: '',
  idx: 0
}

PropertyRow.propTypes = {
  className: PropTypes.string,
  idx: PropTypes.number,
  property: PropTypes.object.isRequired
}

export default PropertyRow
