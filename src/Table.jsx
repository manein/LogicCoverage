import React from 'react';
import './app.css'; 

/**
 *  Renders a table of truth values with the given values and title.
    Re-used for all tables and coverages.
 * @param {Obect} Props passed from the main app, to reference these values and functions here.
 * @returns HTML of the dynamic made table with the provided input.
 */
function Table({title, table, variables, toggleModal}) {
  return (
    <div className = "table-div">
      {/* Sticky header if scrolling, stays on top to label the variables. */}
      <div style = {{
          position: "sticky", 
          top: "0",
          backgroundColor: "white", 
          zIndex: "1", 
          }}>
          <div style={{padding: "10px", display: "flex", alignItems: "center", justifyContent: "space-between"}}>
          <h2 style={{ fontWeight: "100", fontSize: "20px"}}>{title}</h2>  

          {/* Adds a help button to learn what this coverage is about. */}
            <button onClick={() => {toggleModal(title)}} style={{ cursor: "pointer", background: "none", border: "none", padding: 0 }}>
              <img src="/info.png" alt="info" width="20px" height="20px" style={{ marginBottom: "7px" }} />
            </button>

          </div>
          <hr style={{ marginTop: "-2px" }}></hr>
      </div>

          {/* Renders the table and spaces the entries as columns*/}
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
