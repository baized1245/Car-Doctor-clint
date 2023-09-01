import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Provider/AuthProvider';
import BookingRow from '../BookService/BookingRow';
import { useNavigate } from 'react-router-dom';

const Bookings = () => {
   const {user} = useContext(AuthContext);
   const [bookings, setBookings] = useState([]);
   const navigate = useNavigate();

   const url = `http://localhost:5000/bookings?email=${user?.email}`;
   useEffect( () => {
    fetch(url, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${localStorage.getItem('car-access-token')}`
      }
    })
    .then(res => res.json()
    .then(data => {
        if(!data.error){
          setBookings(data);
        }
        else{
          // logOut and then navigate
            navigate('/');
        }
        
    }))
   }, [url, navigate]);

   const handleDelete = id => {
    const proceed = confirm("Are you sure you want to delete this")
    if(proceed){
       fetch(`http://localhost:5000/bookings/${id}`, {
        method: 'DELETE'
       })
       .then(res => res.json())
       .then(data => {
        console.log(data);
        if(data.deletedCount > 0){
            alert('Deleted Successfully')
            const remaining = bookings.filter(booking => booking._id !== id);
           setBookings(remaining)
        }
       })
    }
}

  const handleBookingConfirm = id => {
    fetch(`http://localhost:5000/bookings/${id}`, {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({status: 'confirm'})
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      if(data.modifiedCount > 0){
        // Update State
        const remaining = bookings.filter(booking => booking._id !== id);
        const updated = bookings.find(booking => booking._id === id);
        updated.status = 'confirm'
        const newBookings = [updated, ...remaining];
        setBookings(newBookings)

      }
    })
  }


    return (
        <div>
           <h2 className='text-5xl'>Your Bookings: {bookings.length}</h2> 
           <div className="overflow-x-auto">
  <table className="table">
    {/* head */}
    <thead>
      <tr>
        <th>
          <label>
            <input type="checkbox" className="checkbox" />
          </label>
        </th>
        <th>Image</th>
        <th>Service</th>
        <th>Date</th>
        <th>Price</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
     {
       bookings.map(booking => <BookingRow
       key={booking._id}
       booking={booking}
       handleDelete={handleDelete}
       handleBookingConfirm={handleBookingConfirm}
       ></BookingRow>) 
     } 
    </tbody>
    
  </table>
</div>
        </div>
    );
};

export default Bookings;