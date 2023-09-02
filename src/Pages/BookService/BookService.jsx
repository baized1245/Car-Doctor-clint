import React, { useContext } from 'react';
import { useLoaderData } from 'react-router-dom';
import { AuthContext } from '../../Provider/AuthProvider';

const BookService = () => {
    const service = useLoaderData();
    const {title, _id, price, img} = service;
    const {user} = useContext(AuthContext);

    const handleBookService = event => {
      event.preventDefault();
      const form = event.target;
      const name = form.name.value;
      const date = form.date.vlue;
      const email = user?.email;
      const booking = {
        customarName: name,
        email, img, date,
        service: title,
        service_id: _id,
        price: price
      }
      console.log(booking);
      
     fetch('https://car-doctor-server-delta-pearl.vercel.app/bookings', {
      method: "POST",
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(booking)
     })
     .then(res => res.json())
     .then(data => {
      console.log(data);
      if(data.insertId){
        alert('Service book Successfully')
      }
     })

    }

    return (
        <div>
        <h2 className='text-center text-3xl'>Book Service: {title}</h2>

        <form onSubmit={handleBookService}>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className="form-control">
      <label className="label">
        <span className="label-text">Name</span>
      </label>
      <input type="text" defaultValue={user?.displayName} name='name' className="input input-bordered" />
    </div>
    <div className="form-control">
      <label className="label">
        <span className="label-text">Date</span>
      </label>
      <input type="date" name='date' className="input input-bordered" />
    </div>
    <div className="form-control">
      <label className="label">
        <span className="label-text">Email</span>
      </label>
      <input type="text" defaultValue={user?.email} name='email' className="input input-bordered" />
    </div>
    <div className="form-control">
      <label className="label">
        <span className="label-text">Deu Amount</span>
      </label>
      <input type="text" name='money' defaultValue={'$'+price}  className="input input-bordered" />
    </div>
        </div>
        <input className="btn btn-primary btn-block mt-8" type="submit" value="Order Confirm" />
    </form>
        
  <div className="card-body">
    
    <div className="form-control mt-6">
      {/* <input className="btn btn-primary btn-block" type="submit" value="Order Confirm" /> */}
    </div>
  </div>
</div>
    );
};

export default BookService;