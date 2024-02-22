import React, { useState } from 'react';

const TruthTableGenerator = () => {
  const [expression, setExpression] = useState('');
  const [variables, setVariables] = useState('');
  const [truthTable, setTruthTable] = useState([]);
  const [predicateCoverage, setPredicateCoverage] = useState([]);
  const [combinatorialCoverage, setCombinatorialCoverage] = useState([]);

  const handleExpressionChange = (e) => setExpression(e.target.value);
  const handleVariablesChange = (e) => setVariables(e.target.value.toUpperCase());

  const handleSubmit = (e) => {
    e.preventDefault();
    const vars = variables.split(/\s*,\s*/);
    const table = generateTruthTable(vars, expression);
    setTruthTable(table);
    setPredicateCoverage(findPredicateCoverage(table));
    setCombinatorialCoverage(findCombinatorialCoverage(table));
  };

  const generateTruthTable = (vars, expr) => {
    const numRows = Math.pow(2, vars.length);
    let table = [];
    for (let i = 0; i < numRows; i++) {
      let values = {};
      let evalExpr = expr;
      vars.forEach((variable, j) => {
        const val = !!(i & (1 << j));
        values[variable] = val;
        evalExpr = evalExpr.replace(new RegExp(variable, 'g'), val ? 'true' : 'false');
      });
      const result = eval(evalExpr);
      table.push({ ...values, result });
    }
    return table;
  };

  const findPredicateCoverage = (table) => {
    const trueCase = table.find(row => row.result === true);
    const falseCase = table.find(row => row.result === false);
    return [trueCase, falseCase].filter(Boolean);
  };

  const findCombinatorialCoverage = (table) => table.filter(row => row.result);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Variables (comma separated, e.g., A, B): 
            <input type="text" value={variables} onChange={handleVariablesChange} />
          </label>
        </div>
        <div>
          <label>
            Expression (e.g., A && B || !C): 
            <input type="text" value={expression} onChange={handleExpressionChange} />
          </label>
        </div>
        <button type="submit">Generate Truth Table</button>
      </form>

      <h2>Complete Truth Table</h2>
      <table>
        <thead>
          <tr>
            {variables.split(/\s*,\s*/).map((variable) => <th key={variable}>{variable}</th>)}
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {truthTable.map((row, index) => (
            <tr key={index}>
              {variables.split(/\s*,\s*/).map((variable) => (
                <td key={variable}>{row[variable] ? 'T' : 'F'}</td>
              ))}
              <td>{row.result ? 'T' : 'F'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Predicate Coverage</h2>
      {predicateCoverage.length ? (
        <table>
          <thead>
            <tr>
              {variables.split(/\s*,\s*/).map((variable) => <th key={variable}>{variable}</th>)}
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {predicateCoverage.map((row, index) => (
              <tr key={index}>
                {variables.split(/\s*,\s*/).map((variable) => (
                  <td key={variable}>{row[variable] ? 'T' : 'F'}</td>
                ))}
                <td>{row.result ? 'T' : 'F'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p>No data available.</p>}

      <h2>Combinatorial Coverage</h2>
      {combinatorialCoverage.length ? (
        <table>
          <thead>
            <tr>
              {variables.split(/\s*,\s*/).map((variable) => <th key={variable}>{variable}</th>)}
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {combinatorialCoverage.map((row, index) => (
              <tr key={index}>
                {variables.split(/\s*,\s*/).map((variable) => (
                  <td key={variable}>{row[variable] ? 'T' : 'F'}</td>
                ))}
                <td>{row.result ? 'T' : 'F'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p>No data available.</p>}
    </div>
  );
};

export default TruthTableGenerator;
