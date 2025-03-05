
import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const App: React.FC = () => {
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<any[]>([]); // Now handles multiple columns
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get("http://localhost:8000/tables/");
        setTables(response.data.tables);
        if (response.data.tables.length > 0) {
          setSelectedTable(response.data.tables[0]);
        }
      } catch (error) {
        console.error("Error fetching tables:", error);
      }
    };

    fetchTables();
  }, []);

  const handleAsk = async () => {
    if (!selectedTable) {
      setAnswer([]);
      return;
    }

    setLoading(true);
    setAnswer([]);

    try {
      const response = await axios.post("http://localhost:8000/ask/", {
        query: question,
        table_name: selectedTable,
      });

      setAnswer(response.data.answer);
    } catch (error) {
      console.error("Error:", error);
      setAnswer([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", width: "1000px" }}>
      <div className="card shadow p-4" style={{ width: "80%", maxWidth: "900px" }}>
        <h2 className="text-center text-primary mb-4">Langchain Based AI SQL Query System</h2>

        <div className="mb-3">
          <label className="form-label fw-bold">Select Table:</label>
          <select className="form-select" value={selectedTable} onChange={(e) => setSelectedTable(e.target.value)}>
            {tables.map((table, index) => (
              <option key={index} value={table}>{table}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Ask a SQL-related question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>

        <button onClick={handleAsk} className="btn btn-primary w-100 mb-3" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Asking...
            </>
          ) : (
            "Ask"
          )}
        </button>

        {loading && (
          <div className="d-flex justify-content-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {!loading && answer.length > 0 && (
          <div className="alert alert-secondary mt-3">
            <h5 className="fw-bold">Answer:</h5>
            <table className="table table-striped">
              <thead>
                <tr>
                  {Object.keys(answer[0]).map((key, index) => (
                    <th key={index}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {answer.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.values(row).map((value, colIndex) => (
                      <td key={colIndex}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
   
  );
};

export default App;
