import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import '~/styles/styles'

import '~/styles/layouts/default'

const DefaultLayout = ({
  children,
  className: inheritClassName,
  ...props
}) => {
  const className = classnames(inheritClassName, 'default-layout')

  return (
    <div className={className} {...props}>
      <main>
        {children}
      </main>
    </div>
  )
}

DefaultLayout.defaultProps = {
  children: null,
  className: ''
}

DefaultLayout.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
}

export default DefaultLayout
