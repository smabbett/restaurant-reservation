import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  createReservation,
  readReservation,
  editReservation,
} from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';
import formatReservationDate from '../utils/format-reservation-date';
import formatReservationTime from '../utils/format-reservation-time';
import { today } from '../utils/date-time';

function ReservationCreateEdit() {
  const { reservation_id } = useParams();
  const history = useHistory();

  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    mobile_number: '(555)-555-5555',
    reservation_date: today(),
    reservation_time: '10:30',
    people: 0,
    status: 'booked',
  });

  useEffect(() => {
    async function loadReservation() {
      if (reservation_id) {
        const abortController = new AbortController();
        setError(null);
        readReservation(reservation_id, abortController.signal)
          .then(formatReservationDate)
          .then(formatReservationTime)
          .then(setFormData)
          .catch(setError);
        return () => abortController.abort();
      }
    }

    loadReservation();
  }, [reservation_id]);

  function cancelHandler() {
    history.goBack();
  }

  function submitHandler(event) {
    event.preventDefault();
    const abortController = new AbortController();
    if (reservation_id) {
      editReservation(formData, abortController.signal)
        .then(() => {
          history.push(`/dashboard/?date=${formData.reservation_date}`);
        })
        .catch(setError);
      return () => abortController.abort();
    } else {
      createReservation(formData, abortController.signal)
        .then(() => {
          history.push(`/dashboard/?date=${formData.reservation_date}`);
        })
        .catch(setError);
      return () => abortController.abort();
    }
  }

  function changeHandler({ target }) {
    let newValue = target.value;
    if (target.name === 'people') {
      newValue = Number(target.value);
    }
    setFormData((previousReservation) => ({
      ...previousReservation,
      [target.name]: newValue,
    }));
  }

  if (!reservation_id || formData.status === 'booked') {
    return (
      <main>
        <h1 className="mb-3">
          {reservation_id ? 'Edit Reservation' : 'Create Reservation'}
        </h1>
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
                value={formData.first_name}
                onChange={changeHandler}
                required={true}
              />
              <small className="form-text text-muted">
                First name required.
              </small>
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
                value={formData.last_name}
                onChange={changeHandler}
                required={true}
              />
              <small className="form-text text-muted">
                Last name required.
              </small>
            </div>
            <div className="col-6 form-group">
              <label className="form-label" htmlFor="mobile_number">
                Mobile Number
              </label>
              <input
                className="form-control"
                id="mobile_number"
                name="mobile_number"
                type="tel"
                value={formData.mobile_number}
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
                value={formData.reservation_date}
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
                value={formData.reservation_time}
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
                value={formData.people}
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
  } else {
    <div>Reservation cannot be updated.</div>;
  }
}

export default ReservationCreateEdit;
