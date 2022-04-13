import './login.css';
import React from 'react';
import logo from '../../assets/MaskGroup2.png';
import TabBar from '../../components/TabBar/TabBar.jsx';
import LoginForm from '../../components/Forms/formslogin';

function Login (){ 
  return (
    <div className="loginbody">
    <div className="left-container">
    <div className="left-div">
    <div className='headingL'>
    <h3 >Sign In</h3>
    </div>
    <div className="paragraphL">
      <p>Select whom you want to sign in as: </p>
    </div>
    <div className="tab-bar">
      <TabBar itemOne = {"User"} itemTwo = {"Restuarant"} itemThree = {"NGO"}/>
    </div>
    <div className="forgetPass">
      <a href='#'> Forget Password ? </a>
    </div>
    <div className="Loginform">
        <LoginForm />
    </div>
    <div className='signup'>
      <p>Dont have an account ?</p>
      <a href='#'> Sign Up </a>
    </div>
    <div className="admin-login">
      <p>Do you want to sign in as Admin ?</p>
      <button className="adminmodel">Admin</button>
    </div>
    </div>
    </div>
    <div className="right-container">
    <div className="right-div">
    <div className="heading-right">
    <h2>United we can end hunger!</h2>
    </div>
    <div className="paragraph-right">
    <p>Your every donation counts !</p>
    </div>
    <img className="image-c" src={logo}></img>
    </div>
      
    </div>

    </div>
  );
  
}

export default Login;
