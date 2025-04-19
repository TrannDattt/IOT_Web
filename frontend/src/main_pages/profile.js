import React from "react";
import { useState } from "react";
import styled from "styled-components";
import {FaPen} from "react-icons/fa";
import { MdDone } from "react-icons/md";
import axios from "axios";
import { API_BASE_URL } from "../config";

const ProfileLayout = styled.div({
    padding: '150px 50px 50px 50px',

    '& .user-image': {
        height: '150px',
        background: 'white',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '10px',
        boxShadow: '0px 2px 5px',

        '& .cover-img': {
            height: '100%',
            width: '100%',
            margin: '20px 20px 20px 200px',
            objectFit: 'cover',
        },

        '& .log-out-btn': {
            position: 'absolute',
            right: '0px',
            top: '0px',
            height: '30px',
            margin: '10px',
            background: '#4F5577',
            fontWeight: 'bold',
            border: '0',
            borderRadius: '5px',
            color: 'white',
        },

        '& .log-out-btn:hover': {
            background: '#63698A',
        },
        
        '& .user-avatar': {
            position: 'absolute',
            top: '50%',
            left: '30px',
            display: 'flex',
            flexDirection: 'row',
        
            '& img': {
                width: '120px',
                height: '120px',
                border: '2px solid black',
                borderRadius: '60px',
                background: '#E8E8E8',
                marginRight: '20px',
            },
        },
    },

    '& .user-des': {
        padding: '20px',
        marginTop: '80px',
        height: '400px',
        background: 'white',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0px 2px 5px',
    
        '& .description': {
            marginTop: '20px',
            height: '100%',
            padding: '10px',
            border: '1px solid #2F3557',
            borderRadius: '7px',
        },
    },
})

export default function Profile({user, FetchUser}){
    const [isEditable, setIsEditable] = useState(false)
    const [description, setDescription] = useState(user ? user.description : '')

    const Logout = async () => {
        localStorage.removeItem('token')
        await FetchUser()
        alert('Logged out.')
    }

    const UpdateUser = async (updateData) => {
        console.log(updateData)
        try {
            const response = await axios.put(`${API_BASE_URL}/auth/update-one/${user.id}`, updateData)
            const data = response.data

            if(data){
                console.log(data.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return(
        <ProfileLayout>
            <div className="user-image">
                <div className="user-avatar">
                    <img src="/image/avatar.png" alt="avatar" />
                    <h2>{ user && 
                    `${ user.username.charAt(0).toUpperCase() + user.username.slice(1) }`}</h2>

                </div>
                {/* <img className="cover-img" src="/image/cover.png" alt="cover" /> */}
                <button className="log-out-btn" type="button" onClick={() => Logout()} >Log out</button>
            </div>

            <div className="user-des">
                <span style={{fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center'}}>
                    Description

                    {!isEditable ? <FaPen style={{marginLeft: '10px', fontSize: '20px', color: '#4F5577'}} 
                                    onClick={() => setIsEditable(true)} />

                                : <MdDone style={{marginLeft: '10px', fontSize: '26px', color: '#4F5577'}} 
                                onClick={() => {
                                    setIsEditable(false)
                                    UpdateUser({ description: description})
                                }} />}
                </span>

                <textarea className="description"
                placeholder={isEditable ? "Write your description here..." : ""}
                defaultValue={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={!isEditable}/>
            </div>

        </ProfileLayout>
    );
}