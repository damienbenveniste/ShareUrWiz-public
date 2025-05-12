import React from 'react'
// nodejs library to set properties for components
import PropTypes from 'prop-types'
import { styled } from '@mui/material/styles'
import { cardHeaderStyle } from 'components/Card/cardStyle'


export default function CardHeader(props) {

  const { className, children, color, plain, ...rest } = props

  const StyledCard = styled('div') ({
    ...cardHeaderStyle.cardHeader,
    ...(color && cardHeaderStyle[color + 'CardHeader']),
    ...(plain && cardHeaderStyle.cardHeaderPlain),
  }) 

  return (
    <StyledCard className={className} {...rest}>
      {children}
    </StyledCard>
  )
}

CardHeader.propTypes = {
  className: PropTypes.string,
  color: PropTypes.oneOf(['warning', 'success', 'danger', 'info', 'primary']),
  plain: PropTypes.bool,
  children: PropTypes.node,
}
