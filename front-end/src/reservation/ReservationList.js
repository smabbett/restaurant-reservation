import React from 'react';
import ReservationCard from './ReservationCard';

function ReservationList({ reservations }) {
  const activeReservations = reservations.filter(
    (reservation) => reservation.status !== 'finished'
  );
  const tableRows = activeReservations.map((reservation) => {
    return (
      <ReservationCard
        key={reservation.reservation_id}
        reservation={reservation}
      />
    );
  });

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Mobile Number</th>
            <th scope="col">Reservation Date</th>
            <th scope="col">Reservation Time</th>
            <th scope="col">Number in Party</th>
            <th scope="col">Status</th>
            <th scope="col">Table Seating</th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>
    </div>
  );
}

export default ReservationList;
