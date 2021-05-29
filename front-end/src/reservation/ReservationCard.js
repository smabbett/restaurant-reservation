import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { updateStatus } from '../utils/api';

function ReservationCard({ reservation }) {
  const history = useHistory();

  function handleDelete({ target }) {
    const result = window.confirm(
      'Do you want to cancel this reservation? This cannot be undone.'
    );
    if (result) {
      const abortController = new AbortController();
      let status = 'cancelled';
      updateStatus(
        status,
        reservation.reservation_id,
        abortController.signal
      ).then(() => {
        history.push('/');
      });
    }
  }

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
        <>
          <td>
            <Link
              className="btn btn-primary mr-2"
              to={`/reservations/${reservation.reservation_id}/seat`}
            >
              Seat
            </Link>
          </td>
          <td>
            <Link
              className="btn btn-primary mr-2"
              to={`/reservations/${reservation.reservation_id}/edit`}
            >
              Edit
            </Link>
          </td>
          <td>
            <button
              data-reservation-id-cancel={reservation.reservation_id}
              id={reservation.reservation_id}
              className="btn btn-danger"
              onClick={handleDelete}
            >
              Cancel
            </button>
          </td>
        </>
      ) : null}
    </tr>
  );
}
export default ReservationCard;
