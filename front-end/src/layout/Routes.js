import React from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';
import Dashboard from '../dashboard/Dashboard';
import NotFound from './NotFound';
import { today } from '../utils/date-time';
import ReservationCreate from '../reservation/ReservationCreate';
import TableCreate from '../tables/TableCreate';
import TableSeating from '../tables/TableSeating';
import Search from '../reservation/Search';

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <Switch>
      <Route path="/reservations/:reservation_id/seat">
        <TableSeating />
      </Route>
      <Route path="/reservations/new">
        <ReservationCreate />
      </Route>
      <Route path="/tables/new">
        <TableCreate />
      </Route>
      <Route path="/search">
        <Search />
      </Route>
      <Route exact={true} path="/">
        <Redirect to={'/dashboard'} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={'/dashboard'} />
      </Route>
      {/* <Route path="/dashboard/:reservation_date">
        <Dashboard />
      </Route> */}
      <Route path="/dashboard">
        <Dashboard date={today()} />
      </Route>

      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
