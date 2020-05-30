import React from 'react'
import Button from 'react-bootstrap/Button'
import PropTypes from 'prop-types'
import Spinner from 'react-bootstrap/Spinner'
import classnames from 'classnames'

import '~/styles/components/loading-button'

const LoadingButton = ({
  children,
  className: inheritClassName,
  disabled,
  loading,
  ...props
}) => {
  const className = classnames(inheritClassName, 'loading-button')

  return (
    <Button className={className} disabled={disabled || loading} {...props}>
      {!loading ? children : (
        <>
          <Spinner animation='border' as='span' className='mr-2' size='sm' />
          Loading...
        </>
      )}
    </Button>
  )
}

LoadingButton.defaultProps = {
  children: null,
  className: '',
  disabled: false,
  loading: false
}

LoadingButton.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool
}

export default LoadingButton
