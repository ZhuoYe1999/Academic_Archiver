// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from 'prop-types';

//if error happened show error info
 
const RenderIf = ({ condition, empty, children }) => {
  if (condition) {
    return children;
  }
  return empty;
};
//check the fomatting
RenderIf.propTypes = {
  condition: PropTypes.bool,
  empty: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
};
//provide deffault value
RenderIf.defaultProps = {
  condition: false,
  empty: null,
};

export default RenderIf;
