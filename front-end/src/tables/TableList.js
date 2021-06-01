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
  ));

  return <div className="card-columns">{tableRows}</div>;
}

export default TableList;
