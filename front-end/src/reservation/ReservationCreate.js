import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createReservation } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';

function ReservationCreate() {
  const history = useHistory();

  const [error, setError] = useState(null);
  const [reservation, setReservation] = useState({
    first_name: '',
    last_name: '',
    mobile_number: '',
    reservation_date: '',
    reservation_time: '',
    people: 0,
  });

  function cancelHandler() {
    history.goBack();
  }

  function submitHandler(event) {
    event.preventDefault();
    const abortController = new AbortController();
    createReservation(reservation, abortController.signal)
      .then(() => {
        history.push(`/dashboard/?date=${reservation.reservation_date}`);
      })
      .catch(setError);
    return () => abortController.abort();
  }

  function changeHandler({ target }) {
    let newValue = target.value;
    if (target.name === 'people') {
      newValue = Number(target.value);
    }
    setReservation((previousReservation) => ({
      ...previousReservation,
      [target.name]: newValue,
    }));
  }

  return (
    <main>
      <h1 className="mb-3">Create Reservation</h1>
      <ErrorAlert error={error} />
      <form className="mb-4" onSubmit={submitHandler}>
        <div className="row mb-3">
          <div className="col-6 form-group">
            <label className="form-label" htmlFor="first_name">
              First Name
            </label>
            <input
              className="form-control"
              id="first_name"
              name="first_name"
              type="text"
              value={reservation.first_name}
              onChange={changeHandler}
              required={true}
            />
            <small className="form-text text-muted">First name required.</small>
          </div>
          <div className="col-6 form-group">
            <label className="form-label" htmlFor="last_name">
              Last Name
            </label>
            <input
              className="form-control"
              id="last_name"
              name="last_name"
              type="text"
              value={reservation.last_name}
              onChange={changeHandler}
              required={true}
            />
            <small className="form-text text-muted">Last name required.</small>
          </div>
          <div className="col-6 form-group">
            <label className="form-label" htmlFor="mobile_number">
              Mobile Number
            </label>
            <input
              className="form-control"
              id="mobile_number"
              name="mobile_number"
              type="text"
              value={reservation.mobile_number}
              onChange={changeHandler}
              required={true}
            />
            <small className="form-text text-muted">
              Mobile number required.
            </small>
          </div>
          <div className="col-6 form-group">
            <label className="form-label" htmlFor="reservation_date">
              Date of Reservation
            </label>
            <input
              className="form-control"
              id="reservation_date"
              name="reservation_date"
              type="date"
              placeholder="YYYY-MM-DD"
              pattern="\d{4}-\d{2}-\d{2}"
              value={reservation.reservation_date}
              onChange={changeHandler}
              required={true}
            />
            <small className="form-text text-muted">Date required.</small>
          </div>
          <div className="col-6 form-group">
            <label className="form-label" htmlFor="reservation_time">
              Time of Reservation
            </label>
            <input
              className="form-control"
              id="reservation_time"
              name="reservation_time"
              type="time"
              placeholder="HH:MM"
              pattern="[0-9]{2}:[0-9]{2}"
              value={reservation.reservation_time}
              onChange={changeHandler}
              required={true}
            />
            <small className="form-text text-muted">Time required.</small>
          </div>
          <div className="col-6 form-group">
            <label className="form-label" htmlFor="people">
              Number in Party
            </label>
            <input
              className="form-control"
              id="people"
              name="people"
              type="number"
              min="1"
              value={reservation.people}
              onChange={changeHandler}
              required={true}
            />
            <small className="form-text text-muted">
              Number in party required.
            </small>
          </div>
        </div>

        <div>
          <button
            type="button"
            className="btn btn-secondary mr-2"
            onClick={cancelHandler}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </main>
  );
}

export default ReservationCreate;
