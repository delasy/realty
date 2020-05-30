import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import '~/styles/components/greeting'

const Greeting = ({ className: inheritClassName, user, ...props }) => {
  const className = classnames(inheritClassName, 'greeting')
  const hours = new Date().getHours()

  return (
    <h1 className={className} {...props}>
      {hours >= 4 && hours < 12 ? (
        <>
          &#127749; Good Morning
        </>
      ) : hours >= 12 && hours < 18 ? (
        <>
          &#127961; Good Afternoon
        </>
      ) : hours >= 18 && hours < 22 ? (
        <>
          &#127751; Good Evening
        </>
      ) : (
        <>
          &#127747; Good Night
        </>
      )}
      {', ' + user.firstName}
    </h1>
  )
}

Greeting.defaultProps = {
  className: ''
}

Greeting.propTypes = {
  className: PropTypes.string,
  user: PropTypes.object.isRequired
}

export default Greeting
