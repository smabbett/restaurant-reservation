import React, { useEffect, useState } from 'react';
import { listReservations } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';
import useQuery from '../utils/useQuery';
import { previous, next } from '../utils/date-time';
import { useHistory } from 'react-router';

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const history = useHistory();
  const query = useQuery().get('date');
  if (query) date = query;
  //should I be able to change the date to loadDashboard for previous and next date?

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ reservation_date: date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  const handlePreviousDateClick = () => {
    history.push(`dashboard?date=${previous(date)}`);
  };

  const handleNextDateClick = () => {
    history.push(`dashboard?date=${next(date)}`);
  };

  const tableRows = reservations.map((reservation) => (
    <tr key={reservation.reservation_id}>
      <th scope="row">{reservation.reservation_id}</th>
      <td>{reservation.first_name}</td>
      <td>{reservation.last_name}</td>
      <td>{reservation.mobile_number}</td>
      <td>{reservation.reservation_date}</td>
      <td>{reservation.reservation_time}</td>
      <td>{reservation.people}</td>
    </tr>
  ));
  return (
    <main>
      <h1>Dashboard</h1>
      <div className="input-group input-group-lg mb-2">
        <span className="input-group-text">{date}</span>
        <div className="input-group-append">
          <button
            type="button"
            className="btn btn-secondary"
            data-testid="decrease-focus"
            onClick={handlePreviousDateClick}
          >
            <span className="oi oi-minus" />
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            data-testid="increase-focus"
            onClick={handleNextDateClick}
          >
            <span className="oi oi-plus" />
          </button>
        </div>
      </div>
      {/* <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div> */}

      <ErrorAlert error={reservationsError} />
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Mobile Number</th>
            <th scope="col">Reservation Date</th>
            <th scope="col">Reservation Time</th>
            <th scope="col">Number in Party</th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>
      {/* {JSON.stringify(reservations)} */}
    </main>
  );
}

export default Dashboard;
