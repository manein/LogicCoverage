import React, { useState } from 'react';
import Table from './Table';
import Modal from './Modal';
import './app.css'; 

document.body.style = 'background: #f2f2f2'; // Apply a nice gray background to the entire site

/**
 * This component allows a user to input a predicate expression, and 
 * generates a truth table along with three types of associated test coverage.
 * @author Peter Buonaiuto
 * @author Manan Devani
 * @author Abid Khawaja
 * @returns the HTML which renders the page
 */
const TruthTableGenerator = () => {
  const [expression, setExpression] = useState('');                         // The expression typed as input
  const [variables, setVariables] = useState('');                           // A list of variables extracted from the input
  const [truthTable, setTruthTable] = useState([]);                         // The truth table, all 2^n rows
  const [predicateCoverage, setPredicateCoverage] = useState([]);           // Array of one true and one false expression
  const [combinatorialCoverage, setCombinatorialCoverage] = useState([]);   // Array of all true values from the input
  const [acCoverage, setAcCoverage] = useState([]);                         // Array of one pair of determinants for each var
  const [isOpen, setIsOpen] = useState(false)                               // Handles whether to render the help modal
  const [error, setError] = useState(false)                                 // Handles whether to display the modal in error mode
  const [helpPage, setHelpPage] = useState()                                // Handles which help HTML to display on the modal

  /**
   * Shows or hides an informational modal, with content dependent on which help button was pressed.
   * @param {Array} table : the table we were looking at when requesting the help modal.
   */
  const toggleModal = (table) => {
    setHelpPage(typeof table === 'string'? table : null) // store the item which the user wants help on to load proper modal content.
    setIsOpen(!isOpen);
  };
  
  /**
   * Takes the provided value from the input box, and stores it in program state.
   * @param {Element} e : The input box where an expression was updated.
   */
  const handleExpressionChange = (e) => {setExpression(e.target.value); setError(false)}

  /**
   * Pulls out all variables using REGEX from the provided expression
   * @param {String} inputString : the expression to parse
   * @returns Set of unique variables which occur in the input
   */
  function extractVars(inputString) {
    // Use a Set to store unique variables
    const uniqueVars = new Set();
  
    // Iterate through each character of the input string
    inputString.split('').forEach(char => {
      // Check if the character is in alphabet
      if (/[a-zA-Z]/.test(char)) {
        uniqueVars.add(char);
      }
    });
  
    // Join the unique variables into a string separated by commas
    return [...uniqueVars].join(',');
  }
  
  
  /**
   * / generate tables with variables and expression
   * @param {Element} e : The GO button which generates all tables, based on the expression state.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setVariables(extractVars(expression))
    const vars = extractVars(expression).split(/\s*,\s*/);

    const table = generateTruthTable(vars, expression);
    setTruthTable(table);

    setPredicateCoverage(findPredicateCoverage(table));

    let combCov = findCombinatorialCoverage(table)
    setCombinatorialCoverage(combCov);
    // Use combination coverage, since all other results are redundant for finding variation in the truthy result.
    setAcCoverage(findAcCoverage(combCov, vars, expression))
  };

  /**
   * / Given the expression and variables, generate the generic truth table
   * @param {*} vars extracted from the expression
   * @param {*} expr expression to replace the vars with all possible truth values.
   * @returns  Array of all rows (2^n) in the truth table.
   */
  const generateTruthTable = (vars, expr) => {
    const numRows = Math.pow(2, vars.length);
    let table = [];
    // For each row (combination)
    for (let i = 0; i < numRows; i++) {
      let values = {};
      let evalExpr = expr;

      // Generate each answer for each row (final result; T or F)
      // replaces each variable in the expression with true or false. (val is true or false)
      vars.forEach((variable, j) => {
        const val = !!(i & (1 << j));
        values[variable] = val;
        evalExpr = evalExpr.replace(new RegExp(variable, 'g'), val ? '#' : '$'); // letters in 'false' or 'true' used as variables 
                                                                                 // caused bugs due to double replacement
      });
      evalExpr = evalExpr.replace(/#/g, 'true').replace(/\$/g, 'false').replace('-', 'halt').replace('/', 'halt');         // fixes the above bug by converting after loop
      
      try {
        // eslint-disable-next-line
        const result = eval(evalExpr);     // Evaluate to true or false
        table.push({ ...values, result }); // add to the table. 2D Array which starts with truth values for each variable.
                                           // and the last item, is the result, true or false.
        
        
      } catch (error) {
        // If an error is discovered, print the reason and show the user friendly syntax guide.
        setError(true)
        console.log("error", error)
        setIsOpen(true) // open modal to display syntax error
      }
      
    }
    return table;
  };

  
  /**
   *  Finds active clause coverage: 
      Finds pairs of expressions where changing one variable's value, determines the result of the entire expression.
      Takes combinatorial coverage as input (all true results) and for each variable, finds a case where flipping it changes the
      result of the expression (this is a determinate variable). Adds the pair to the result. Repeat for each variable.
   * @param {*} table : An array of expressions; an object with variables and their truth type, and a final result boolean
   * @param {*} vars  : A list of the variables which take on truth values
   * @param {*} expr  : The provided expression entered to evaluate upon
   * @returns Array of rows in the result.
   */
  const findAcCoverage = (table, vars, expr) => {
    const resultTable = [];
    
    // Iterate through each variable
    for (let variable of vars) {
        let foundPair = false; // Flag to track if a satisfying pair is found for the current variable
        
        // Iterate through each row in the truth table
        for (let row of table) {
            if (!row['result'])
            {
              // found a falsey input. Print that we can speed this up by not providing the entire table
              console.log("Warning: You can speed up active clause coverage by only providing rows which result in true, which is combinatorial coverage. This cuts compute time in half.")
              continue; // Skip ths input after warning about its inefficiency.
            }
            
            let flippedRow = { ...row }; // Create a copy of the original row
            
            // Flip the boolean value of the current variable
            flippedRow[variable] = !flippedRow[variable];
            
            // Re-evaluate the expression with all but the last element of the row (which is the result)
            const evalExpr = expr.replace(new RegExp(Object.keys(flippedRow).slice(0, -1).join("|"), 'g'), matched => flippedRow[matched]);


            // eslint-disable-next-line
            const result = eval(evalExpr); // Evaluate with the flipped variable, if its false, this is a DETERMINATE VARIABLE
            
            // If the result changes to false, add both original and modified rows to the result table
            // This variable was determinant for this expression!
            if (!result) {
              // Push the original row with the negated new result (which is the original result) appended at the end
              row['result'] = !result;
              resultTable.push(row);

              // Push the modified row (variable flipped) with the result (false) appended at the end
              flippedRow['result'] = result;
              resultTable.push(flippedRow);
    
              
              foundPair = true; // Set flag to true indicating a satisfying pair is found, only need one for each var
              break; // Break the loop to move on to the next variable
          }
        }
        
        // If a satisfying pair is found, skip to the next variable
        if (foundPair) {
            continue;
        }
    }
    
    return resultTable;
};



  /**
   * / Returns a table of one true and one false case, the first of each from the truth table
   * @param {Array} table : List of rows of the truth table to extract result from.
   * @returns An array containing one true and one false case from the input table.
   */
  const findPredicateCoverage = (table) => {
    const trueCase = table.find(row => row.result === true);
    const falseCase = table.find(row => row.result === false);
    return [trueCase, falseCase].filter(Boolean);
  };

  /**
   * Returns a table comprising of all truth table rows that evaluate to true.
   * Leverages .filter, which includes only array elements which cause the expression to return true.
   * @param {Array} table : Array of row objects defining the truth table.
   * @returns The input table with all falsey results filtered out.
   */
  const findCombinatorialCoverage = (table) => table.filter(row => row.result);

  /**
   * The visuals (HTML) begin here. 
   */
  return (
    <div> 
      {/* Displays the help modal, conditionally */}
      {isOpen && <Modal close = {toggleModal} error = {error} helpPage = {helpPage}></Modal>}

      {/* Renders /wraps the user input component. */}
      <div style = {{display: "flex", marginTop: "2vh", marginBottom: "4vh", alignItems: "center", flexDirection: "column"}}>
        <div style = {{backgroundColor: "white",  border:"1px solid #e8e8e8", borderRadius: "8px", padding: "3px"}}>

          {/* Renders a header with the input prompt, and a help button */}
          <div style={{padding: "10px", display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <p>Enter an expression</p> 
            <button onClick={toggleModal} style={{ cursor: "pointer", background: "none", border: "none", padding: 0 }}>
              <img src="/info.png" alt="info" width="20px" height="20px" style={{ marginBottom: "15px" }} />
            </button>
          </div>

            <hr style = {{marginTop: "-20px", marginBottom: "5px"}}></hr>

            {/* User input box, with a prompting placeholder. Required to submit */}
            <form onSubmit={handleSubmit} style ={{display: "flex"}}>
              <input 
                  value={expression}
                  class="form-control"
                  type="text"
                  style={{ width: "300px", margin: "5px" }}
                  placeholder="e.g. (A && B) || !C" 
                  onChange={handleExpressionChange}
                  required={true}
              />

              {/* Submit button takes user input and generates coverage with it. */}
              <button 
                  type="submit" 
                  class="btn btn-outline-primary" 
                  style={{ width: "50px", margin: "5px" }}
                  
                  
                  >Go</button>
            </form>

        </div>
      </div>
      {/* Hide results when modal is open */}
      {/* Display all tables when closed. */}
    {!isOpen && (
      <div className="table-container">
        <Table title = "Truth Table" table = {truthTable} variables = {variables} toggleModal = {toggleModal}></Table>
        <Table title = "Predicate Coverage" table = {predicateCoverage} variables = {variables} toggleModal = {toggleModal}></Table>
        <Table title = "Combinatorial Coverage" table = {combinatorialCoverage} variables = {variables} toggleModal = {toggleModal}></Table>
        <Table title = "Active Clause Coverage" table = {acCoverage} variables = {variables} toggleModal = {toggleModal}></Table>
      </div>
    )}
    </div>
  );
};

export default TruthTableGenerator;
