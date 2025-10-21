import React from "react";
import { Link } from "react-router-dom";

const Logo: React.FC = () => {
  return (
    <Link to='/' className='logo'>
      <img
        className='logo_icon'
        alt='visibuy_logo'
        src='./VisiBuy - Black.png'
      />
    </Link>
  );
};

export default Logo;
