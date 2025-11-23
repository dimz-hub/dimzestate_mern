import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutFailure, signOutStart, signOutSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/slices/userSlice'
import {Link} from 'react-router-dom'


const Profile = () => {
  const {currentUser, loading, error} = useSelector((state) => state.user)
  const [formData, setFormData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const dispatch = useDispatch()
 const [showListingsError, setShowListingsError] = useState(false)
const [userListings, setUserListings] = useState([])

  const handleChange = (e) => {
     setFormData({...formData, [e.target.id] : e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try{

      dispatch(updateUserStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      if(data.success === false) {
        dispatch(updateUserFailure(data.message))
        return
      } 
      dispatch(updateUserSuccess(data ))
      setUpdateSuccess(true)
    }catch(err){
      dispatch(updateUserFailure(error.message))
    }


  }

const handleDeleteUser = async () => {
 try{
 dispatch(deleteUserStart())
 const res = await fetch(`/api/user/delete/${currentUser._id}`, {
  method: 'DELETE'
 })
 const data = res.json()

 if(data.success === false) {
  dispatch(deleteUserFailure(data.message))
  return
}
dispatch(deleteUserSuccess(data))

 }catch(err) {
  dispatch(deleteUserFailure(err.message))
 }

}

const handleSignOut = async () => {
  try{
   dispatch(signOutStart())
  const res = await fetch('/api/auth/signout')
  const data = res.json()

  if (data.success === false) {
   dispatch(signOutFailure(data.message))
   return
  }
  dispatch(signOutSuccess(data))


       
 }catch(err){
  dispatch(signOutFailure(err.message))
 }
}

const handleShowListings = async ( ) => {
  try{
 setShowListingsError(false)
 const res = await fetch(`/api/user/listings/${currentUser._id}`)
 const data = await res.json()
 if(data.success === false) {
  setShowListingsError(true)
  return
 }
 setUserListings(data)
  }catch(err){
    setShowListingsError(true)
  }
}

console.log(userListings)

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Profile
      </h1>
     <form onSubmit = {handleSubmit} className='flex flex-col gap-4'>

      <img src={currentUser.avatar} alt='profile' className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'/>
      <input type='text' onChange={handleChange} defaultValue={currentUser.username} placeholder='username' id='username' className='border p-3 rounded-lg' />
      <input type='email' onChange={handleChange}defaultValue={currentUser.email}  placeholder='email' id='email' className='border p-3 rounded-lg' />
      <input type='password' onChange={handleChange} placeholder='password' id='password' className='border p-3 rounded-lg' />
      <button disabled ={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disables:opacity-80'>{loading? 'loading' :  'update'}</button>
     <Link to={'/create-listing'} className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'>
     Create Listing 
     </Link>
     </form>
     <div className='flex justify-between mt-5'>
     <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete account</span>
     <span onClick = {handleSignOut} className='text-red-700 cursor-pointer'>Sign Out</span>
     </div>
   <p className='text-red-700 mt-5'> {error? error : ''}</p>
   <p className='text-green-700 mt-5'> {updateSuccess? 'User is updated successfully' : ''}</p>
    <button onClick={handleShowListings} className = 'text-green-700 w-full'>Show Listings</button>
   <p className='text-red-700 mt-5'>{showListingsError? 'Error showing listings' : ''}</p>
  
     {
      userListings && 
      userListings.length > 0 && 
      <div className='flex flex-col gap-4'>
       <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>
        {
          userListings.map((listing) => (
            <div key={listing._id} className='border rounded-lg p-3 flex justify-between items-center gap-4'>
              <Link className='text-slate-700 font-semibold flex-1 hover:underline truncate' to={`/listing/${listing._id}`}>
                <p>{listing.name}</p>
              </Link>
              <div className='flex flex-col items-center'>
                <button className='text-red-700 uppercase'>Delete</button>
                <Link to={`/update-listing/${listing._id}`}>
                <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))
        }
        </div>
     }
  
  
    </div>
  )
}

export default Profile