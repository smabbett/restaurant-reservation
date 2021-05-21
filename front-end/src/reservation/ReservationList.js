import React from 'react';
import { Link } from 'react-router-dom';

function ReservationList({ reservations }) {
  const tableRows = reservations.map((reservation) => (
    <tr key={reservation.reservation_id}>
      {/* <th scope="row">{reservation.reservation_id}</th> */}
      <td>
        {reservation.first_name} {reservation.last_name}
      </td>
      {/* <td>{reservation.last_name}</td> */}
      <td>{reservation.mobile_number}</td>
      <td>{reservation.reservation_date}</td>
      <td>{reservation.reservation_time}</td>
      <td>{reservation.people}</td>
      <td>
        <Link
          className="btn btn-info mr-2"
          to={`reservations/${reservation.reservation_id}/seat`}
        >
          Seat
        </Link>
      </td>
    </tr>
  ));

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            {/* <th scope="col">#</th> */}
            <th scope="col">Name</th>
            {/* <th scope="col">Last Name</th> */}
            <th scope="col">Mobile Number</th>
            <th scope="col">Reservation Date</th>
            <th scope="col">Reservation Time</th>
            <th scope="col">Number in Party</th>
            <th scope="col">Table Seating</th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>
    </div>
  );
}

export default ReservationList;
