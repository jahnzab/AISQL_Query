
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";

// const App: React.FC = () => {
//   const [question, setQuestion] = useState<string>("");
//   const [answer, setAnswer] = useState<any | null>(null); // Supports both array & object responses
//   const [tables, setTables] = useState<string[]>([]);
//   const [selectedTable, setSelectedTable] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);

//   useEffect(() => {
//     const fetchTables = async () => {
//       try {
//         const response = await axios.get("http://localhost:8000/tables/");
//         setTables(response.data.tables);
//         if (response.data.tables.length > 0) {
//           setSelectedTable(response.data.tables[0]);
//         }
//       } catch (error) {
//         console.error("Error fetching tables:", error);
//       }
//     };

//     fetchTables();
//   }, []);

//   const handleAsk = async () => {
//     if (!selectedTable) {
//       setAnswer(null);
//       return;
//     }

//     setLoading(true);
//     setAnswer(null);

//     try {
//       const response = await axios.post("http://localhost:8000/ask/", {
//         query: question,
//         table_name: selectedTable,
//       });

//       setAnswer(response.data.answer);
//     } catch (error) {
//       console.error("Error:", error);
//       setAnswer(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", width: "1000px" }}>
//       <div className="card shadow p-4" style={{ width: "80%", maxWidth: "1000px" }}>
//         <h2 className="text-center text-primary mb-4">Langchain Based AI SQL Query System</h2>

//         <div className="mb-3">
//           <label className="form-label fw-bold">Select Table:</label>
//           <select className="form-select" value={selectedTable} onChange={(e) => setSelectedTable(e.target.value)}>
//             {tables.map((table, index) => (
//               <option key={index} value={table}>{table}</option>
//             ))}
//           </select>
//         </div>

//         <div className="mb-3">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Ask a SQL-related question..."
//             value={question}
//             onChange={(e) => setQuestion(e.target.value)}
//           />
//         </div>

//         <button onClick={handleAsk} className="btn btn-primary w-100 mb-3" disabled={loading}>
//           {loading ? (
//             <>
//               <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//               Asking...
//             </>
//           ) : (
//             "Ask"
//           )}
//         </button>

//         {loading && (
//           <div className="d-flex justify-content-center">
//             <div className="spinner-border text-primary" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </div>
//           </div>
//         )}

//         {!loading && answer && (
//           <div className="alert alert-secondary mt-3">
//             <h5 className="fw-bold">Answer:</h5>

//             {/* ✅ If multiple tables are returned, render them separately */}
//             {selectedTable === "All Tables" && typeof answer === "object" ? (
//               Object.keys(answer).map((tableName, index) => (
//                 <div key={index} className="mb-4">
//                   <h5 className="text-success">{tableName}</h5>
//                   <table className="table table-striped">
//                     <thead>
//                       <tr>
//                         {answer[tableName].length > 0 &&
//                           Object.keys(answer[tableName][0]).map((key, idx) => <th key={idx}>{key}</th>)}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {answer[tableName].map((row: any, rowIndex: number) => (
//                         <tr key={rowIndex}>
//                           {Object.values(row).map((value, colIndex) => (
//                             <td key={colIndex}>{value}</td>
//                           ))}
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ))
//             ) : (
//               // ✅ If a single table is returned, render normally
//               <table className="table table-striped">
//                 <thead>
//                   <tr>
//                     {answer.length > 0 && Object.keys(answer[0]).map((key, index) => <th key={index}>{key}</th>)}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {answer.map((row, rowIndex) => (
//                     <tr key={rowIndex}>
//                       {Object.values(row).map((value, colIndex) => (
//                         <td key={colIndex}>{value}</td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default App;

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const App: React.FC = () => {
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<any | null>(null);
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [navbarCollapsed, setNavbarCollapsed] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<string>("home");
  
  const homeRef = useRef<HTMLDivElement>(null);
  const queryRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

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
        setError("Failed to load database tables. Please check your connection.");
      }
    };

    fetchTables();

    // Add scroll event listener to update active section
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Offset to trigger earlier
      
      // Get positions of all sections
      const homePosition = homeRef.current?.offsetTop || 0;
      const queryPosition = queryRef.current?.offsetTop || 0;
      const infoPosition = infoRef.current?.offsetTop || 0;
      const aboutPosition = aboutRef.current?.offsetTop || 0;
      
      // Determine which section is currently in view
      if (scrollPosition >= aboutPosition) {
        setActiveSection("about");
      } else if (scrollPosition >= infoPosition) {
        setActiveSection("info");
      } else if (scrollPosition >= queryPosition) {
        setActiveSection("query");
      } else {
        setActiveSection("home");
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Add resize handler for responsiveness
    const handleResize = () => {
      // Reset navbar collapsed state on desktop
      if (window.innerWidth >= 992) {
        setNavbarCollapsed(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Call once on initial load
    handleScroll();
    handleResize();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleAsk = async () => {
    if (!selectedTable) {
      setError("Please select a table first");
      return;
    }

    if (!question.trim()) {
      setError("Please enter a question");
      return;
    }

    setLoading(true);
    setAnswer(null);
    setError(null);

    try {
      const response = await axios.post("http://localhost:8000/ask/", {
        query: question,
        table_name: selectedTable,
      });

      if (response.data.answer && (Array.isArray(response.data.answer) || typeof response.data.answer === 'object')) {
        setAnswer(response.data.answer);
        // Scroll to results
        setTimeout(() => {
          if (queryRef.current) {
            const resultsPosition = queryRef.current.offsetTop + 300;
            window.scrollTo({
              top: resultsPosition,
              behavior: 'smooth'
            });
          }
        }, 300);
      } else {
        setError("Received an invalid response format");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to get a response. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAsk();
    }
  };

  const scrollToSection = (sectionRef: React.RefObject<HTMLDivElement>, sectionName: string) => {
    if (sectionRef.current) {
      const headerOffset = 70; // Account for fixed header
      const elementPosition = sectionRef.current.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      setActiveSection(sectionName);
      setNavbarCollapsed(true);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow-sm">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="#" onClick={() => scrollToSection(homeRef, "home")}>
            <img src="http://localhost:8000/images/langs.png"  alt="LangChain SQL" className="me-2" style={{ borderRadius: '8px' }} />
            <h1><span className="d-none d-sm-inline"></span></h1>
            <span className="d-inline d-sm-none">LC SQL</span>
          </a>
          <button 
            className="navbar-toggler" 
            type="button"
            onClick={() => setNavbarCollapsed(!navbarCollapsed)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse ${navbarCollapsed ? '' : 'show'}`}>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a 
                  className={`nav-link ${activeSection === "home" ? "active fw-bold" : ""}`} 
                  href="#" 
                  onClick={() => scrollToSection(homeRef, "home")}
                >
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a 
                  className={`nav-link ${activeSection === "query" ? "active fw-bold" : ""}`} 
                  href="#" 
                  onClick={() => scrollToSection(queryRef, "query")}
                >
                  Query Builder
                </a>
              </li>
              <li className="nav-item">
                <a 
                  className={`nav-link ${activeSection === "info" ? "active fw-bold" : ""}`} 
                  href="#" 
                  onClick={() => scrollToSection(infoRef, "info")}
                >
                  About LangChain
                </a>
              </li>
              <li className="nav-item">
                <a 
                  className={`nav-link ${activeSection === "about" ? "active fw-bold" : ""}`} 
                  href="#" 
                  onClick={() => scrollToSection(aboutRef, "about")}
                >
                  How It Works
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <header className="bg-dark text-white py-5" ref={homeRef}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7 col-md-6 mb-4 mb-md-0">
              <h1 className="display-4 fw-bold mb-4">AI-Powered SQL Assistant</h1>
              <p className="lead mb-4">
                Transform natural language into powerful SQL queries with our LangChain-powered intelligence.
                No more complex SQL syntax - just ask questions in plain English.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={() => scrollToSection(queryRef, "query")}
                >
                  <i className="bi bi-search me-2"></i>
                  Start Querying
                </button>
                <button 
                  className="btn btn-outline-light btn-lg"
                  onClick={() => scrollToSection(infoRef, "info")}
                >
                  <i className="bi bi-info-circle me-2"></i>
                  Learn More
                </button>
              </div>
            </div>
            <div className="col-lg-5 col-md-6 text-center">
            <img 
  src="http://localhost:8000/images/visua.png" 
  alt="AI Query Visualization" 
  className="img-fluid rounded shadow-lg"
  style={{ maxWidth: '100%', height: 'auto' }}
/>


            </div>
          </div>
        </div>
      </header>

      <div className="container py-5" ref={queryRef} id="query-section">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="card shadow-lg border-0 rounded-lg overflow-hidden">
              <div className="card-header bg-primary text-white">
                <h2 className="text-center m-0 py-3 h3">
                  <i className="bi bi-database me-2"></i>
                  Interactive SQL Query Builder
                </h2>
              </div>
              <div className="card-body p-3 p-md-4 p-lg-5">
                <div className="row g-3 mb-4">
                  <div className="col-lg-6 col-md-12">
                    <label className="form-label fw-bold">Select Database Table</label>
                    <div className="input-group">
                      <span className="input-group-text bg-primary text-white">
                        <i className="bi bi-table"></i>
                      </span>
                      <select 
                        className="form-select" 
                        value={selectedTable} 
                        onChange={(e) => setSelectedTable(e.target.value)}
                      >
                        {tables.length === 0 && <option value="">Loading tables...</option>}
                        {tables.map((table, index) => (
                          <option key={index} value={table}>{table}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12">
                    <label className="form-label fw-bold">Ask Your Question</label>
                    <div className="input-group">
                      <span className="input-group-text bg-primary text-white">
                        <i className="bi bi-question-circle"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., Show all users over 30 years old..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyPress={handleKeyPress}
                      />
                    </div>
                  </div>
                </div>

                <div className="d-grid mb-4">
                  <button 
                    onClick={handleAsk} 
                    className="btn btn-primary btn-lg" 
                    disabled={loading || !selectedTable}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Processing Query...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-search me-2"></i>
                        Execute Query
                      </>
                    )}
                  </button>
                </div>

                {error && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <div>{error}</div>
                  </div>
                )}

                {!loading && answer && (
                  <div className="mt-4">
                    <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
                      <h4 className="text-primary m-0 mb-2 mb-sm-0">
                        <i className="bi bi-table me-2"></i>
                        Results
                      </h4>
                      <span className="badge bg-success">
                        {Array.isArray(answer) ? answer.length : 
                         Object.keys(answer).reduce((total, key) => total + answer[key].length, 0)} 
                        records found
                      </span>
                    </div>

                    <div className="table-responsive">
                      {selectedTable === "All Tables" && typeof answer === "object" && !Array.isArray(answer) ? (
                        Object.keys(answer).map((tableName, index) => (
                          <div key={index} className="mb-4">
                            <h5 className="bg-light p-2 rounded text-primary">
                              <i className="bi bi-table me-2"></i>
                              {tableName}
                            </h5>
                            <div className="table-responsive">
                              <table className="table table-hover table-striped">
                                <thead className="table-primary">
                                  <tr>
                                    {answer[tableName].length > 0 &&
                                      Object.keys(answer[tableName][0]).map((key, idx) => (
                                        <th key={idx} className="text-nowrap">{key}</th>
                                      ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {answer[tableName].map((row: any, rowIndex: number) => (
                                    <tr key={rowIndex}>
                                      {Object.values(row).map((value: any, colIndex: number) => (
                                        <td key={colIndex}>
                                          {value !== null ? String(value) : <i className="text-muted">NULL</i>}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ))
                      ) : (
                        <table className="table table-hover table-striped">
                          <thead className="table-primary">
                            <tr>
                              {Array.isArray(answer) && answer.length > 0 && 
                                Object.keys(answer[0]).map((key, index) => (
                                  <th key={index} className="text-nowrap">{key}</th>
                                ))}
                            </tr>
                          </thead>
                          <tbody>
                            {Array.isArray(answer) && answer.map((row, rowIndex) => (
                              <tr key={rowIndex}>
                                {Object.values(row).map((value: any, colIndex) => (
                                  <td key={colIndex}>
                                    {value !== null ? String(value) : <i className="text-muted">NULL</i>}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                )}

                {loading && (
                  <div className="text-center my-5">
                    <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Executing your query...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LangChain Information Section */}
      <div className="bg-light py-5" ref={infoRef} id="info-section">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-md-10 text-center">
              <h2 className="display-5 fw-bold mb-4">Powered by LangChain</h2>
              <p className="lead mb-4">
                Our application leverages LangChain's powerful framework to transform natural language into database queries
              </p>
            </div>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4 col-sm-12 mb-4 mb-md-0">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="rounded-circle bg-primary text-white d-inline-flex justify-content-center align-items-center mb-4" style={{ width: "80px", height: "80px" }}>
                    <i className="bi bi-translate" style={{ fontSize: "2rem" }}></i>
                  </div>
                  <h4>Natural Language Processing</h4>
                  <p className="text-muted">
                    LangChain interprets human language and translates it into structured database queries, allowing you to ask questions in plain English.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4 col-sm-6 mb-4 mb-md-0">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="rounded-circle bg-primary text-white d-inline-flex justify-content-center align-items-center mb-4" style={{ width: "80px", height: "80px" }}>
                    <i className="bi bi-link-45deg" style={{ fontSize: "2rem" }}></i>
                  </div>
                  <h4>Chain of Thought</h4>
                  <p className="text-muted">
                    LangChain uses a sophisticated chain of prompts and models to generate accurate SQL from natural language inputs with high precision.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4 col-sm-6 mb-4 mb-md-0">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="rounded-circle bg-primary text-white d-inline-flex justify-content-center align-items-center mb-4" style={{ width: "80px", height: "80px" }}>
                    <i className="bi bi-database-check" style={{ fontSize: "2rem" }}></i>
                  </div>
                  <h4>SQL Optimization</h4>
                  <p className="text-muted">
                    The system automatically optimizes queries for performance, ensuring efficient database access and resource utilization.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="row mt-5">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="row align-items-center">
                    <div className="col-md-6 mb-4 mb-md-0">
                      <h3 className="mb-3">What is LangChain?</h3>
                      <p>
                        LangChain is a framework designed to simplify the creation of applications using large language models (LLMs). It provides a standard interface for chains, lots of integrations with other tools, and end-to-end chains for common applications.
                      </p>
                      <p>
                        <strong>Key Components:</strong>
                      </p>
                      <ul>
                        <li><strong>Chains:</strong> Sequences of calls to LLMs or other utilities</li>
                        <li><strong>Agents:</strong> LLMs make decisions about which actions to take</li>
                        <li><strong>Memory:</strong> Persisting state between chain/agent calls</li>
                        <li><strong>Indexes:</strong> Structuring documents for LLM interaction</li>
                      </ul>
                    </div>
                    <div className="col-md-6 text-center">
                      <img 
                        src="http://localhost:8000/images/ff.png" 
                        alt="LangChain Framework" 
                        className="img-fluid rounded shadow"
                        style={{ maxWidth: '100%', height: 'auto' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-5" ref={aboutRef} id="about-section">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-md-10 text-center">
              <h2 className="display-5 fw-bold mb-4">How It Works</h2>
              <p className="lead mb-4">
                Our application bridges the gap between natural language and database queries
              </p>
            </div>
          </div>
          
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0 order-2 order-lg-1">
              <img 
                src="http://localhost:8000/images/framework.png" 
                alt="How LangChain Works" 
                className="img-fluid rounded shadow d-none d-lg-block"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
             
            </div>
            <div className="col-lg-6 order-1 order-lg-2">
              <div className="timeline">
                <div className="d-flex mb-4">
                  <div className="me-3">
                    <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center" style={{ width: "48px", height: "48px" }}>
                      <i className="bi bi-1-circle-fill"></i>
                    </div>
                  </div>
                  <div>
                    <h4>Natural Language Input</h4>
                    <p className="text-muted">
                      You ask questions in plain English, without needing to know SQL syntax or database structure.
                    </p>
                  </div>
                </div>
                
                <div className="d-flex mb-4">
                  <div className="me-3">
                    <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center" style={{ width: "48px", height: "48px" }}>
                      <i className="bi bi-2-circle-fill"></i>
                    </div>
                  </div>
                  <div>
                    <h4>LangChain Processing</h4>
                    <p className="text-muted">
                      LangChain analyzes your question, understands the context, and determines the required database operations.
                    </p>
                  </div>
                </div>
                
                <div className="d-flex mb-4">
                  <div className="me-3">
                    <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center" style={{ width: "48px", height: "48px" }}>
                      <i className="bi bi-3-circle-fill"></i>
                    </div>
                  </div>
                  <div>
                    <h4>SQL Generation</h4>
                    <p className="text-muted">
                      The system automatically generates optimized SQL queries that accurately reflect your question.
                    </p>
                  </div>
                </div>
                
                <div className="d-flex">
                  <div className="me-3">
                    <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center" style={{ width: "48px", height: "48px" }}>
                      <i className="bi bi-4-circle-fill"></i>
                    </div>
                  </div>
                  <div>
                    <h4>Results Presentation</h4>
                    <p className="text-muted">
                      The data is retrieved from the database and presented in a clear, organized format for your review.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Features Section */}
          <div className="row mt-5 pt-4">
            <div className="col-12 text-center mb-4">
              <h3 className="fw-bold">Key Features</h3>
            </div>
            
            <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <div className="text-primary mb-3">
                    <i className="bi bi-lightning-charge" style={{ fontSize: "2.5rem" }}></i>
                  </div>
                  <h5>Fast Queries</h5>
                  <p className="small text-muted">
                    Get instant results without writing complex SQL code.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <div className="text-primary mb-3">
                    <i className="bi bi-translate" style={{ fontSize: "2.5rem" }}></i>
                  </div>
                  <h5>Natural Language</h5>
                  <p className="small text-muted">
                    Ask questions in plain English instead of SQL syntax.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <div className="text-primary mb-3">
                    <i className="bi bi-shield-check" style={{ fontSize: "2.5rem" }}></i>
                  </div>
                  <h5>Safe & Secure</h5>
                  <p className="small text-muted">
                    Protected against SQL injection and other vulnerabilities.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <div className="text-primary mb-3">
                    <i className="bi bi-graph-up" style={{ fontSize: "2.5rem" }}></i>
                  </div>
                  <h5>Powerful Analytics</h5>
                  <p className="small text-muted">
                    Extract valuable insights from your database with ease.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-primary text-white py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h2 className="mb-4">Ready to transform your database experience?</h2>
              <p className="lead mb-4">
                Start using natural language to interact with your data today.
              </p>
              <button 
                className="btn btn-light btn-lg"
                onClick={() => scrollToSection(queryRef, "query")}
              >
                <i className="bi bi-search me-2"></i>
                Try It Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 mt-auto">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
              <h5 className="mb-3">LangChain SQL Assistant</h5>
              <p className="small mb-2">
                A powerful natural language interface to your database, powered by LangChain's framework and large language models.
              </p>
              <div className="d-flex gap-3 mt-3">
                <a href="#" className="text-white-50"><i className="bi bi-github fs-4"></i></a>
                <a href="#" className="text-white-50"><i className="bi bi-twitter fs-4"></i></a>
                <a href="#" className="text-white-50"><i className="bi bi-linkedin fs-4"></i></a>
              </div>
            </div>
            <div className="col-lg-2 col-md-6 col-6 mb-4 mb-md-0">
              <h5 className="mb-3">Links</h5>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="#" className="text-white-50">Home</a></li>
                <li className="mb-2"><a href="#" className="text-white-50">Documentation</a></li>
                <li className="mb-2"><a href="#" className="text-white-50">API Reference</a></li>
                <li className="mb-2"><a href="#" className="text-white-50">Support</a></li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-6 col-6 mb-4 mb-md-0">
              <h5 className="mb-3">Resources</h5>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="#" className="text-white-50">Blog</a></li>
                <li className="mb-2"><a href="#" className="text-white-50">Tutorials</a></li>
                <li className="mb-2"><a href="#" className="text-white-50">Examples</a></li>
                <li className="mb-2"><a href="#" className="text-white-50">Community</a></li>
              </ul>
            </div>
            <div className="col-lg-4 col-md-6">
              <h5 className="mb-3">Stay Updated</h5>
              <p className="small mb-3">Subscribe to our newsletter for the latest updates</p>
              </div>
            
          </div>
          <hr className="mt-4 mb-3" />
          <div className="row">
            <div className="col-12 text-center">
              <p className="small text-white-50 mb-0">
                © 2025 AI SQL Query System | Powered by LangChain
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;