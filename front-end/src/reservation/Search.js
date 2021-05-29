import React, { useState } from 'react';
import ErrorAlert from '../layout/ErrorAlert';
import { listReservations } from '../utils/api';
import ReservationList from './ReservationList';

function Search() {
  //const history = useHistory();
  const [search, setSearch] = useState({
    mobile_number: '',
  });
  const [error, setError] = useState(null);
  const [reservations, setReservations] = useState([]);

  const abortController = new AbortController();
  function submitHandler(event) {
    event.preventDefault();
    listReservations(search, abortController.signal)
      .then(setReservations)
      .catch(setError);
    return () => abortController.abort();
  }

  function changeHandler({ target: { name, value } }) {
    setSearch((previousSearch) => ({
      ...previousSearch,
      [name]: value,
    }));
  }

  return (
    <main>
      <h1 className="mb-3">Search</h1>
      <ErrorAlert error={error} />
      <section>
        <form onSubmit={submitHandler}>
          <div className="row mb-3">
            <div className="col-6 form-group">
              <label className="form-label" htmlFor="mobile_number">
                Mobile Number
              </label>
              <input
                className="form-control"
                id="mobile_number"
                name="mobile_number"
                type="text"
                placeholder="Enter a customer's phone number"
                value={search.mobile_number}
                onChange={changeHandler}
                required={true}
              />
            </div>
          </div>
          <div>
            <button type="submit" className="btn btn-primary mb-3">
              Find
            </button>
          </div>
        </form>
      </section>
      <section>
        <ReservationList reservations={reservations} />
      </section>
    </main>
  );
}
export default Search;
