import React from 'react';
import { Link } from 'react-router-dom';

function ReservationCard({ reservation }) {
  return (
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
  );
}
export default ReservationCard;
