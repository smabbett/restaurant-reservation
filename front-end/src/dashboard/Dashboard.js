import React, { useEffect, useState } from 'react';
import { listReservations, listTables } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';
import useQuery from '../utils/useQuery';
import { previous, next, today } from '../utils/date-time';
import { useHistory } from 'react-router';
import ReservationList from '../reservation/ReservationList';
import TableList from '../tables/TableList';

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  const [tables, setTables] = useState([]);
  //const [tablesError, setTablesError] = useState(null);

  const history = useHistory();
  const query = useQuery().get('date');
  if (query) date = query;

  //should I be able to change the date to loadDashboard for previous and next date?

  useEffect(loadDashboard, [date]);
  //listReservations({date} fixed to get the query {date} not {reservation_date: date})
  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    //setTablesError(null)
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setReservationsError);

    return () => abortController.abort();
  }

  const handlePreviousDateClick = () => {
    history.push(`dashboard?date=${previous(date)}`);
  };

  const handleNextDateClick = () => {
    history.push(`dashboard?date=${next(date)}`);
  };

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <button
            type="button"
            className="btn btn-primary"
            data-testid="previous-date"
            onClick={handlePreviousDateClick}
          >
            <span className="oi oi-minus" />
          </button>
        </div>
        <span className="input-group-text">{date}</span>
        <div className="input-group-prepend">
          <button
            type="button"
            className="btn btn-primary"
            data-testid="next-date"
            onClick={handleNextDateClick}
          >
            <span className="oi oi-plus" />
          </button>
        </div>
      </div>
      <ErrorAlert error={reservationsError} />
      <ReservationList reservations={reservations} />
      <TableList tables={tables} />
    </main>
  );
}

export default Dashboard;
