import React from 'react';

function TableList({ tables }) {
  const tableRows = tables.map((table) => (
    <tr key={table.table_id}>
      {/* <th scope="row">{table.table_id}</th> */}
      <td>{table.table_name}</td>
      <td>{table.capacity}</td>
      <td data-table-id-status={table.table_id}>
        {table.reservation_id ? 'Occupied' : 'Free'}
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
