import React from 'react';

// Renders a table of truth values with the given values and title.
function Table({title, table, variables}) {
  return (
    <div style={{ 
      backgroundColor: "white", 
      border: "1px solid #e8e8e8", 
      borderRadius: "8px", 
      paddingLeft: "10px", 
      paddingRight: "10px",
      paddingBottom: "10px",
      height: "70vh", 
      overflowY: "auto", 
      width: "22%", 
      
    }}>
      {/* Sticky header if scrolling*/}
      <div style = {{
          position: "sticky", 
          top: "0",
          backgroundColor: "white", 
          zIndex: "1", 
          }}>

          <h2 style={{ fontWeight: "100", fontSize: "25px", paddingTop: "10px",}}>{title}</h2>  

          <hr style={{ marginTop: "10px" }}></hr>
      </div>

          {/* Renders the table and spaces the entries */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {table.length ? (
          <table>
            <thead style={{ 
              position: "sticky", 
              top: "10.4%",
              backgroundColor: "white", 
              zIndex: "1",
              }}>
              <tr>
                {/* Lists all variables that correspond to each column */}
                {variables.split(/\s*,\s*/).map((variable) => <th key={variable}>{variable}</th>)}
                <th>Result</th>
              </tr>
            </thead>

            <tbody>
                {/* Displays the truth value for each item in the comma seperated list of variables */}
              {table.map((row, index) => (
                <tr key={index}>
                  {variables.split(/\s*,\s*/).map((variable) => (
                    <td key={variable}>{row[variable] ? 'T' : 'F'}</td>
                  ))}
                  <td>{row.result ? 'T' : 'F'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        //   No data present, render this
        ) : <p>No data available.</p>} 
      </div>
    </div>
  );
}

export default Table;
