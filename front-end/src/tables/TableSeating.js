import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  listTables,
  readReservation,
  updateTable,
  updateStatus,
} from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';

function TableSeating() {
  const history = useHistory();
  const { reservation_id } = useParams();
  //const [bookingStatus, setBookingStatus] = useState('');
  const [formData, setFormData] = useState({
    table_id: '',
  });

  const [reservation, setReservation] = useState({});
  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTables();
  }, []);

  function loadTables() {
    const abortController = new AbortController();
    setError(null);
    readReservation(reservation_id, abortController.signal)
      .then(setReservation)
      .catch(setError);
    listTables(abortController.signal).then(setTables).catch(setError);
    return () => abortController.abort();
  }

  let freeTables = tables.filter(
    (table) =>
      table.reservation_id === null && table.capacity >= reservation.people
  );
  let list = freeTables.map((table) => {
    return (
      <option key={table.table_id} value={table.table_id}>
        {table.table_name} - {table.capacity}
      </option>
    );
  });

  function cancelHandler() {
    history.goBack();
  }

  function submitHandler(event) {
    event.preventDefault();
    if (formData.table_id !== 'x') {
      //setBookingStatus('seated');
      console.log('reservation_id', reservation_id);
      console.log('table_id', formData.table_id);
      const abortController = new AbortController();
      let status = 'seated';
      updateStatus(
        // { status: 'seated' },
        status,
        reservation_id,
        abortController.signal
      );
      updateTable(
        parseInt(formData.table_id),
        reservation.reservation_id,
        abortController.signal
      ).then(() => {
        //history.push('/');

        history.push('/dashboard');
      });
    }
  }

  function changeHandler({ target }) {
    setFormData({ [target.name]: target.value });
  }
  if (reservation.status === 'booked') {
    return (
      <main className="container">
        <ErrorAlert error={error} />
        <section className="row">
          <div key={reservation.reservation_id} className="card col-md-3">
            <div className="card-header">
              <h5>
                {reservation.first_name} {reservation.last_name}
              </h5>
            </div>
            <div className="card-body">
              <p>{reservation.mobile_number}</p>
              <p>Party of {reservation.people}</p>
            </div>
          </div>
          {/* </section>
      <section className="row"> */}
          <div className="card col-md-5">
            <div className="card-body">
              <form onSubmit={submitHandler}>
                {/* <div className="row mb-3"> */}
                <div className="form-group">
                  <label
                    className="input-group-text"
                    htmlFor="inputGroupSelect01"
                  >
                    Open tables
                  </label>
                  <select
                    onChange={changeHandler}
                    className="custom-select"
                    id="inputGroupSelect01"
                    name="table_id"
                  >
                    <option value="x">Choose a table...</option>
                    {list}
                  </select>
                </div>
                <div>
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={cancelHandler}
                  >
                    Cancel
                  </button>
                </div>
                {/* </div> */}
              </form>
              <div className="input-group mb-3">
                <div className="input-group-prepend"></div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  } else {
    return (
      <div>
        <p>Reservation cannot be seated</p>
      </div>
    );
  }
}
export default TableSeating;
