import React from 'react';
import { Link } from 'react-router-dom';

function ReservationCard({ reservation }) {
  return (
    <tr key={reservation.reservation_id}>
      <td>
        {reservation.first_name} {reservation.last_name}
      </td>
      <td>{reservation.mobile_number}</td>
      <td>{reservation.reservation_date}</td>
      <td>{reservation.reservation_time}</td>
      <td>{reservation.people}</td>
      <td data-reservation-id-status={reservation.reservation_id}>
        {reservation.status}
      </td>
      {reservation.status === 'booked' ? (
        <td>
          <Link
            className="btn btn-primary mr-2"
            to={`/reservations/${reservation.reservation_id}/seat`}
          >
            Seat
          </Link>
        </td>
      ) : null}
    </tr>
  );
}
export default ReservationCard;
