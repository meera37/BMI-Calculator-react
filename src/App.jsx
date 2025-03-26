import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from "react";
import bmiImage from '/bmi-image.jpg'


function App() {
  const [height, setHeight] = useState("");
  const [heightUnit, setHeightUnit] = useState("cm");
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [bmi, setBmi] = useState(null);
  const [description, setDescription] = useState("");
  const [tips, setTips] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [bmiHistory, setBmiHistory] = useState([]);

  // Load BMI history from LocalStorage on page load
  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("bmiHistory")) || [];
    setBmiHistory(storedHistory);
  }, []);
  

  const toggleHeightUnit = () => {
    const units = ["cm", "m", "ft.in."];
    setHeightUnit(units[(units.indexOf(heightUnit) + 1) % units.length]);
  };

  const toggleWeightUnit = () => {
    setWeightUnit(weightUnit === "kg" ? "lbs" : "kg");
  };

  const convertHeightToMeters = () => {
    if (heightUnit === "cm") return height / 100;
    if (heightUnit === "m") return height;
    if (heightUnit === "ft. & in.") return height * 0.3048;
  };

  const convertWeightToKg = () => {
    return weightUnit === "kg" ? weight : weight * 0.453592;
  };

    const calculateBMI = () => {
      if (!height || height <= 0 || !weight || weight <= 0 || !age || age <= 0 || !gender) {
        alert("Invalid input! Ensure height, weight and age are positive values and gender is selected.");
        return;
      }

    const heightInMeters = convertHeightToMeters();
    const weightInKg = convertWeightToKg();
    const bmiValue = (weightInKg / (heightInMeters * heightInMeters)).toFixed(2);
    setBmi(bmiValue);

    if (gender === "male") {
      if (bmiValue < 18.5) {
        setDescription("Underweight (Male)");
        setTips("Increase calorie intake with a balanced diet.");
      } else if (bmiValue < 25) {
        setDescription("Healthy (Male)");
        setTips("Maintain a balanced diet and regular exercise.");
      } else if (bmiValue < 30) {
        setDescription("Overweight (Male)");
        setTips("Increase physical activity and monitor diet.");
      } else {
        setDescription("Obese (Male)");
        setTips("Consult a doctor for a personalized health plan.");
      }
    } else {
      if (bmiValue < 18) {
        setDescription("Underweight (Female)");
        setTips("Ensure proper nutrition and calorie intake.");
      } else if (bmiValue < 24) {
        setDescription("Healthy (Female)");
        setTips("Maintain your diet and stay active.");
      } else if (bmiValue < 29) {
        setDescription("Overweight (Female)");
        setTips("Increase physical activity and monitor calorie intake.");
      } else {
        setDescription("Obese (Female)");
        setTips("Seek medical advice for a structured health plan.");
      }
    }
  

   // Save to history
   const newEntry = {
    id: Date.now(),
    date: new Date().toLocaleDateString(),
    bmi: bmiValue,
    height,
    weight,
    age,
    gender,
  };

  const updatedHistory = [...bmiHistory, newEntry];
  setBmiHistory(updatedHistory);
  localStorage.setItem("bmiHistory", JSON.stringify(updatedHistory));
};

  const resetForm = () => {
    setHeight("");
    setWeight("");
    setHeightUnit("cm");
    setWeightUnit("kg");
    setAge("");
    setGender("");
    setBmi(null);
    setDescription("");
    setTips("");
    setShowDetails(false); // Hides extra details
  };

  const clearHistory = () => {
    localStorage.removeItem("bmiHistory");
    setBmiHistory([]);
  };


  return (
    <>
<div className="container-fluid text-dark d-flex justify-content-center align-items-center p-5" style={{ minHeight: "100vh" }}>
  <div className="row w-100 justify-content-center align-items-start">
    
    {/* BMI Calculator Section */}
    <div className={showDetails ? "col-md-6" : "col-md-8"}>
      <div className="p-4 form-container bmi-section rounded" style={{ maxWidth: "400px", margin: "0 auto" }}>
        <h1 className="text-center mb-4">BMI Calculator</h1>
        <form className="d-flex flex-column">
          <div className="mb-2">
            <label>Height ({heightUnit}):</label>
            <div className="d-flex">
              <input type="number" placeholder="Enter height" className="form-control me-2" value={height} onChange={(e) => setHeight(e.target.value)} />
              <button type="button" className="btn btn-outline-light text-dark" onClick={toggleHeightUnit}>{heightUnit}</button>
            </div>
          </div>

          <div className="mb-2">
            <label>Weight ({weightUnit}):</label>
            <div className="d-flex">
              <input type="number" placeholder="Enter weight" className="form-control me-2" value={weight} onChange={(e) => setWeight(e.target.value)} />
              <button type="button" className="btn btn-outline-light text-dark" onClick={toggleWeightUnit}>{weightUnit}</button>
            </div>
          </div>

          <div className="mb-2">
            <label>Age:</label>
            <input type="number" placeholder="Enter age" className="form-control" value={age} onChange={(e) => setAge(e.target.value)} />
          </div>

          <div className="mb-3">
            <label>Gender:</label>
            <select className="form-control" value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="d-flex justify-content-between">
            <button type="button" className="btn btn-primary w-50 me-2" onClick={calculateBMI}>Calculate</button>
            <button type="button" className="btn btn-warning w-50" onClick={resetForm}>Reset</button>
          </div>
        </form>

        {bmi && (
          <div className="mt-4 p-3 bg-light text-dark rounded text-center">
            <h4>Your BMI: {bmi}</h4>
            <p className="fw-bold">{description}</p>
            <p className="text-muted">{tips}</p>
            <button className="btn btn-info mt-3" onClick={() => setShowDetails(!showDetails)}>
              {showDetails ? "Hide Details" : "More Details"}
            </button>
          </div>
        )}
      </div>
    </div>

  
    {showDetails && (
        <div className="col-md-6 mt-3 p-3 bg-light text-dark rounded details-section">
          <h3>About BMI</h3>
          <p><b>Body Mass Index (BMI)</b> is a measure of body fat based on height and weight.</p>
          <p><b>Formula:</b> BMI = weight (kg) / [height (m)]²</p>
          <p><b>Children & BMI:</b> BMI for children is interpreted differently based on age and gender.</p>
          <p><b>Limitations:</b> BMI does not distinguish between fat and muscle, and may not be accurate for athletes.</p>

          <h4 className="mt-4">BMI Chart</h4>
          <img src={bmiImage} 
               alt="BMI Chart" className="img-fluid rounded" />

          <h4 className="mt-4">Learn More</h4>
          <iframe 
            width="100%" 
            height="250" 
            src="https://www.youtube.com/embed/NJiw11hIKKM?autoplay=1&mute=1" 
            title="BMI Explained"
            frameBorder="0" 
            allowFullScreen>
          </iframe>
          <h4 className="mt-4">Your BMI History</h4>
          {bmiHistory.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>BMI</th>
                    <th>Height (cm)</th>
                    <th>Weight (kg)</th>
                    <th>Age</th>
                    <th>Gender</th>
                  </tr>
                </thead>
                <tbody>
                  {bmiHistory.map((record) => (
                    <tr key={record.id}>
                      <td>{record.date}</td>
                      <td>{record.bmi}</td>
                      <td>{record.height}</td>
                      <td>{record.weight}</td>
                      <td>{record.age}</td>
                      <td>{record.gender}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No history available.</p>
          )}
          {bmiHistory.length > 0 && <button className="btn btn-danger mt-3" onClick={clearHistory}>Clear History</button>}
        </div>
      )}
      </div> 
    </div>
  



    
   
      
        </>
  );
}

export default App
