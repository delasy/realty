import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import _ from 'lodash'
import { useQuery } from '@apollo/react-hooks'

import '~/styles/components/scroll-pagination'

const ScrollPagination = ({
  children,
  className: inheritClassName,
  name,
  query,
  ...props
}) => {
  const { data, error, fetchMore, loading } = useQuery(query, {
    fetchPolicy: 'network-only'
  })

  const handleWindowScroll = _.debounce(() => {
    const hasNextPage = data[name].pageInfo.hasNextPage
    const bodyHeight = window.innerHeight + document.documentElement.scrollTop
    const scrollHeight = document.documentElement.offsetHeight

    if (error || !hasNextPage || loading || bodyHeight !== scrollHeight) {
      return
    }

    return fetchMore({
      variables: {
        after: data[name].pageInfo.endCursor
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        return {
          [name]: {
            __typename: previousResult[name].__typename,
            edges: [
              ...previousResult[name].edges,
              ...fetchMoreResult[name].edges
            ],
            pageInfo: fetchMoreResult[name].pageInfo,
            totalCount: fetchMoreResult[name].totalCount
          }
        }
      }
    })
  }, 100)

  useEffect(() => {
    window.addEventListener('scroll', handleWindowScroll, {
      passive: true
    })

    return () => {
      window.removeEventListener('scroll', handleWindowScroll, false)
    }
  })

  const className = classnames(inheritClassName, 'scroll-pagination')

  return loading ? null : (
    <div className={className} {...props}>
      <div>
        {children === null ? null : data[name].edges.map((edge, idx) => {
          return children(edge.node, idx)
        })}
      </div>
      {data[name].edges.length === 0 ? (
        <p className='mt-4'>
          No {name}.
        </p>
      ) : !data[name].pageInfo.hasNextPage && (
        <p className='mt-4'>
          No more {name}.
        </p>
      )}
    </div>
  )
}

ScrollPagination.defaultProps = {
  children: null,
  className: ''
}

ScrollPagination.propTypes = {
  children: PropTypes.func,
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  query: PropTypes.object.isRequired
}

export default ScrollPagination
