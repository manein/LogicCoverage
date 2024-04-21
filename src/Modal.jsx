import './modal.css'; 

/**
 * Defines a popup menu with instructions 
   Renders differently if it was opened due to a syntax error, or for help.
 * @param {Object} props: Information from the main app, passed to reference here.
 * @returns The HTML modal
 */
function Modal({close, error, helpPage}) 
{
  let helpContent // The description for the help page
  if (helpPage)   // Load the necessary HTML help page, if we opened a help menu.
  {
    switch (helpPage)
    {
      case 'Combinatorial Coverage':
        helpContent = (
          <ul>
            <li>The set of all rows of the truth table which evaluate to true</li>
          </ul>
        )
        break;

      case 'Predicate Coverage':
        helpContent = (
          <ul>
            <li>One expression which evaluates to true, and</li>
            <li>One expression which evaluates to false.</li>
          </ul>
        )
        break;

      case 'Truth Table':
        helpContent = (
          <ul>
            <li>The set of all combinations of truth values each variable can take.</li>
            <li>There are 2^n results, since each variable can be true or false.</li>
            <li>Each row ends with the truthful result of the entire evaluation.</li>
          </ul>
        )
        break;

      case 'Active Clause Coverage':
        helpContent = (
          <ul>
            <li>Contains a pair of expressions for each variable, where that variable is determinant.</li>
            <li>To be determinant means changing only this value changes the result of the expression.</li>
          </ul>
        )
        break;

      default: 
    }
  }
  return (
    <div className="modal-container">
        
        {/* Add a red border if the user has a syntax error */}
        <div style = {{...otherStyles, borderColor: !helpPage && error? "red": "#e8e8e8"}}>

            {/* Header with a menu title and the close button */}
            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                <h2 style={{ fontWeight: "100", color: !helpPage && error ? "red" : "black" }}>
                  {helpPage ? `What is a ${helpPage}?` : error ? "Invalid Syntax" : "Instructions"}</h2>
                <span style = {{marginBottom: "15px"}} className="close" onClick={close}>&times;</span>
            </div>
            <hr style = {{padding: 0, marginTop: "-10px"}}></hr> 
            
            {/* Main content: Explain the syntax rules, or render help page. */}
            {/* Render help page if applicable */}
            {helpPage && helpContent} 

            {/* Render syntax rules otherwise */}
            {!helpPage && 
            (
              <>
              {/* Render either a informational or accusational message */}
              <p>{error? "One or more of the following were violated:":"Please follow the below syntax"}</p>
              <ul>
                  <li>To represent OR, use '||' or '+'</li>
                  <li>To represent AND, use '&&' or '*'</li>
                  <li>To represent NOT, use '!'</li>
                  <li>Variables should each be a single alphabetic character.</li>
                  <li>Parenthesis can be used to isolate expressions. Be sure each has a match.</li>
                  <li>Variables must have one of the above operators between them</li>
                  <li>Each operator must be surrounded by two variables</li>
              </ul>
            </>
            )}
            

        </div>
        
    </div>
  );
};

// Styles that apply whether the modal was opened due to an error or not
const otherStyles = {
    background: "#fefefe",
    margin: "15% auto",
    padding: "20px",
    border: "1px solid #e8e8e8",
    borderRadius: "10px",
    width: "50%"
  };

export default Modal;
