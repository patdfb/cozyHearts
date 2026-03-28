import React from 'react';

const StatCard = ({ label, value }) => {
  const style = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    color: 'white',
    fontSize: '1.1rem'
  };

  return (
    <div style={style}>
      <span>{label} :</span>
      <span style={{ fontWeight: '300' }}>{value}</span>
    </div>
  );
};

export default StatCard;