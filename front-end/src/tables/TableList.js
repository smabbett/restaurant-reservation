import React from 'react';
import { finishTable } from '../utils/api';
import classNames from '../utils/class-names';
import { useHistory } from 'react-router-dom';

function TableList({ tables }) {
  const history = useHistory();

  function handleFinish({ target }) {
    const result = window.confirm(
      'Is this table ready to seat new guests? This cannot be undone.'
    );
    if (result) {
      const tableId = target.id;

      const abortController = new AbortController();

      finishTable(tableId, abortController.signal).then(() => {
        history.push('/');
      });
    }
  }
  const tableRows = tables.map((table) => (
    <div
      key={table.table_id}
      className={classNames({
        card: true,
        'bg-secondary': table.reservation_id,
        'bg-success': !table.reservation_id,
      })}
    >
      <div className="card-body text-center">
        <h5 className="card-title">{table.table_name}</h5>
        <p className="card-text" data-table-id-status={table.table_id}>
          Capacity: {table.capacity}
          <br />
          {table.reservation_id ? 'Occupied' : 'Free'}
        </p>
        {table.reservation_id && (
          <button
            data-table-id-finish={table.table_id}
            value={table.reservation_id}
            id={table.table_id}
            className="btn btn-primary"
            onClick={handleFinish}
          >
            Finish
          </button>
        )}
      </div>
    </div>

    // <tr
    //   key={table.table_id}
    // className={classNames({
    //   'bg-danger': table.reservation_id,
    //   'bg-success': !table.reservation_id,
    // })}
    // >
    //   <td>{table.table_name}</td>
    //   <td>{table.capacity}</td>
    //   <td data-table-id-status={table.table_id}>
    //     {table.reservation_id ? 'Occupied' : 'Free'}
    //   </td>
    //   <td>
    //     {table.reservation_id && (
    //       <button
    //         data-table-id-finish={table.table_id}
    //         value={table.reservation_id}
    //         id={table.table_id}
    //         className="btn btn-primary"
    //         onClick={handleFinish}
    //       >
    //         Finish
    //       </button>
    //     )}
    //   </td>
    // </tr>
  ));

  return (
    <div className="card-columns">
      {tableRows}
      {/* <table className="table">
        <thead>
          <tr>
            <th scope="col">Table Name</th>
            <th scope="col">Capacity</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </table> */}
    </div>
  );
}

export default TableList;
