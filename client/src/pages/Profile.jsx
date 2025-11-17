import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/slices/userSlice'

const Profile = () => {
  const {currentUser, loading, error} = useSelector((state) => state.user)
  const [formData, setFormData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const dispatch = useDispatch()


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
     </form>
     <div className='flex justify-between mt-5'>
     <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete account</span>
     <span className='text-red-700 cursor-pointer'>Sign Out</span>
     </div>
   <p className='text-red-700 mt-5'> {error? error : ''}</p>
   <p className='text-green-700 mt-5'> {updateSuccess? 'User is updated successfully' : ''}</p>
    </div>
  )
}

export default Profile