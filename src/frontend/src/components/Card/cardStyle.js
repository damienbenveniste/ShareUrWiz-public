import {
  warningCardHeader,
  successCardHeader,
  dangerCardHeader,
  infoCardHeader,
  primaryCardHeader,
} from 'assets/jss/material-kit-react.js'

const cardStyle = {
  card: {
    border: '0',
    borderRadius: '6px',
    color: 'rgba(0, 0, 0, 0.87)',
    background: '#fff',
    width: '100%',
    boxShadow:
      '0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12)',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    minWidth: '0',
    wordWrap: 'break-word',
    fontSize: '.875rem',
    transition: 'all 300ms linear',
    textAlign: 'left',
  },
  cardPlain: {
    background: 'transparent',
    boxShadow: 'none',
  },
  cardCarousel: {
    overflow: 'hidden',
  },
}

const cardHeaderStyle = {
  cardHeader: {
    borderRadius: '3px',
    padding: '0.3rem 10px',
    // text: '0.5rem 15px',
    // paddingTop: '10px',
    marginLeft: '15px',
    marginRight: '15px',
    // marginTop: '-5px',
    border: '0',
    marginBottom: '0',
  },
  cardHeaderPlain: {
    marginLeft: '0px',
    marginRight: '0px',
  },
  warningCardHeader,
  successCardHeader,
  dangerCardHeader,
  infoCardHeader,
  primaryCardHeader,
}

const cardBodyStyle = {
  cardBody: {
    padding: '0.2rem 1.875rem',
    flex: '1 1 auto',
  },
}

export {
  cardStyle,
  cardHeaderStyle,
  cardBodyStyle,
}
