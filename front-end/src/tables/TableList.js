import React from 'react';
import { updateTable } from '../utils/api';
import classNames from '../utils/class-names';
import { useHistory } from 'react-router-dom';

function TableList({ tables }) {
  const history = useHistory();

  function finishTable(table) {
    console.log('finish', table.reservation_id);
    // const abortController = new AbortController();
    // updateTable(
    //   table.table_id,
    //   table.reservation_id,
    //   abortController.signal
    // ).then(() => {
    //   history.push('/');
    // });
  }
  const tableRows = tables.map((table) => (
    <tr key={table.table_id}>
      {/* <th scope="row">{table.table_id}</th> */}
      <td>{table.table_name}</td>
      <td>{table.capacity}</td>
      <td
        data-table-id-status={table.table_id}
        className={classNames({
          'bg-danger': table.reservation_id,
          'bg-success': !table.reservation_id,
        })}
      >
        {table.reservation_id ? 'Occupied' : 'Free'}
      </td>
      <td>
        {table.reservation_id && (
          // <button className="btn btn-primary" onClick={finishTable}>
          <button
            data-table-id-finish={table.table_id}
            className="btn btn-primary"
            onClick={finishTable(table)}
          >
            Finish
          </button>
        )}
      </td>
    </tr>
  ));

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            {/* <th scope="col">#</th> */}
            <th scope="col">Table Name</th>
            <th scope="col">Capacity</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>
    </div>
  );
}

export default TableList;
