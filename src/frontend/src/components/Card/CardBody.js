import React from 'react'
import PropTypes from 'prop-types'
import { styled } from '@mui/material/styles'
import { cardBodyStyle } from 'components/Card/cardStyle'


export default function CardBody(props) {

  const { className, children, ...rest } = props
  const StyledCard = styled('div') ({
    ...cardBodyStyle.cardBody,
  }) 

  return (
    <StyledCard className={className} {...rest}>
      {children}
    </StyledCard>
  )
}

CardBody.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
}
