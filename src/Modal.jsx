import './modal.css'; 

// Defines a popup menu with instructions 
// Renders differently if it was opened due to a syntax error
function Modal({close, error}) 
{
  return (
    <div className="modal-container">
        
        {/* Add a red border if the user has a syntax error */}
        <div style = {{...otherStyles, borderColor: error? "red": "#e8e8e8"}}>

            {/* Header with a menu title and the close button */}
            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                <h2 style={{ fontWeight: "100", color: error ? "red" : "black" }}>{error ? "Invalid Syntax" : "Instructions"}</h2>
                <span style = {{marginBottom: "15px"}} className="close" onClick={close}>&times;</span>
            </div>
            <hr style = {{padding: 0, marginTop: "-10px"}}></hr> 
            
            {/* Main content: Explain the syntax rules */}
            <p>{error? "One or more of the following were violated:":"Please follow the below syntax"}</p>
            <ul>
                <li>Variables should each be a single alphabetic character.</li>
                <li>Parenthesis can be used to isolate expressions. Be sure each has a match.</li>
                <li>Use || to represent 'or', && for 'and', ! for 'not'</li>
                <li>Variables must have an operator between them (&& / || / !)</li>
            </ul>


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
