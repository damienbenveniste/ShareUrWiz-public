import React from 'react'
import PropTypes from 'prop-types'
import { styled } from '@mui/material/styles'
import { cardStyle } from 'components/Card/cardStyle'


export default function Card(props) {
  const { className, children, plain, carousel, ...rest } = props

  const StyledCard = styled('div') ({
    ...cardStyle.card,
    ...(plain && cardStyle.cardPlain),
    ...(carousel && cardStyle.cardCarousel),
  }) 

  return (
    <StyledCard className={className} {...rest} style={props.style}>
      {children}
    </StyledCard>
  )
}

Card.propTypes = {
  className: PropTypes.string,
  plain: PropTypes.bool,
  carousel: PropTypes.bool,
  children: PropTypes.node,
}
