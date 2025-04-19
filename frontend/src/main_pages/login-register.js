import React, {useState} from 'react'
import styled from 'styled-components'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {API_BASE_URL} from '../config'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

const LogRegLayout = styled.div({
    height: 'calc(100% - 150px)',
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '150px',
    position: 'relative',

    '& .log-reg-form': {
        width: '600px',
        height: 'fit-content',
        borderRadius: '10px',
        boxShadow: '0px 2px 5px',
    },

    '& .log-reg-form .form-title': {
        height: '50px',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
    },

    '& .log-reg-form .form-title div': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#777575',
    },

    '& .log-reg-form .form-content': {
        background: 'white',
        
        '& .form-input': {
            display: 'flex',
            flexDirection: 'column',
            padding: '10px 30px',
            fontSize: '20px',

            '& label': {
                marginTop: '20px',
                display: 'grid',
                gridTemplateColumns: '40% 50% auto',

                '& button': {
                    width: 'fit-content',
                    marginLeft: '10px',
                    border: '0',
                    background: 'transparent',
                    fontSize: '20px',
                },

                '& button:hover': {
                    color: '#777575',
                }
            }
        },

        '& .submit-btn': {
            padding: '30px 0px 20px 0px',
            display: 'flex',
            justifyContent: 'center',

            '& button': {
                fontSize: '18px',
                height: '40px',
                width: '120px',
            }
        }
    }
})

export default function LoginRegister({FetchUser}) {
    const [isRegister, setIsRegister] = useState(false)

    const [isHidePassword, setIsHidePassword] = useState(true)
    const [isHideConfirmedPassword, setIsHideConfirmedPassword] = useState(true)

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmedPassword, setConfirmedPassword] = useState('')

    const navigate = useNavigate()

    const Login = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, {
                username: username,
                password: password 
            })
            const data = response.data

            if(data)
            {
                console.log(data)
                alert(data.message)
                localStorage.setItem('token', data.token)
                await FetchUser()
                // navigate('/')
            }
        } catch (error) {
            console.error(error)
        }
    }

    const Register = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/register`, {
                username: username,
                password: password,
                confirmedPassword: confirmedPassword 
            })
            
            console.log(response.data)
            alert(response.data.message)
        } catch (error) {
            console.error(error)
        }
    }
    
    const HandleForm = async (e) => {
        e.preventDefault()

        if(isRegister)
            Register()
        else
            Login()
    }

  return (
    <LogRegLayout>
        <form className='log-reg-form' action={isRegister ? 'register' : 'login'}onSubmit={(e) => HandleForm(e)}>
            <div className='form-title'>
                <div style={{background: `${isRegister ? '#A7A7A7' : 'white'}`}} onClick={() => setIsRegister(false)}>Login</div>
                <div style={{background: `${!isRegister ? '#A7A7A7' : 'white'}`}} onClick={() => setIsRegister(true)}>Register</div>
            </div>

            <div className='form-content' >
                <div className='form-input'>
                    <label>
                        Username:
                        <input id='username' onChange={(e) => setUsername(e.target.value)} required />
                    </label>

                    <label>
                        Password:
                        <input id='password' type={isHidePassword ? 'password' : 'text'} onChange={(e) => setPassword(e.target.value)} required />
                        <button type='button' onClick={() => setIsHidePassword(!isHidePassword)}>
                        {
                            !isHidePassword ? 
                            <FaEye /> :
                            <FaEyeSlash />
                        }
                        </button>
                    </label>

                    {isRegister && 
                    <label>
                        Confirmed password:
                        <input id='confirm-password' 
                            type={isHideConfirmedPassword ? 'password' : 'text'} 
                            onChange={(e) => setConfirmedPassword(e.target.value)} required />

                        <button type='button' onClick={() => setIsHideConfirmedPassword(!isHideConfirmedPassword)}>
                        {
                            !isHideConfirmedPassword ? 
                            <FaEye /> :
                            <FaEyeSlash />
                        }
                        </button>
                    </label>}

                </div>

                <div className='submit-btn'>
                    <button type='submit'>
                        {isRegister ? 'Register' : 'Login'}
                    </button>
                </div>

            </div>

        </form>

    </LogRegLayout>
  )
}
