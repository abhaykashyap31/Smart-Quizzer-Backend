import React, { useState } from 'react';
import { FaPaperclip, FaTrash } from 'react-icons/fa'; 
import "./feedback.css";

const Feedback = () => {
    const [facultyEmail, setFacultyEmail] = useState('');
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        rollNumber: '',
        studentName: '',
        faculty: '',
        feedbackMessage: ''
    });

    // Dynamic faculty email selection
    const handleFacultyChange = (event) => {
        const facultyEmails = {
            'dr_smith': 'emily.smith@university.edu',
            'prof_johnson': 'michael.johnson@university.edu',
            'dr_williams': 'sarah.williams@university.edu',
            'prof_brown': 'david.brown@university.edu'
        };
        setFacultyEmail(facultyEmails[event.target.value] || '');
        setFormData({
            ...formData,
            faculty: event.target.value
        });
    };

    // Handle file input
    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        setFiles(selectedFiles);
    };

    const removeFile = (index) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);
    };

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(formData);
        console.log(files);
        // Further submission logic here
    };

    return (
        <div className="feedback-container">
            <h2 className="feedback-title">Feedback Form</h2>
            <form className="feedback-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Roll Number</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Enter your Roll Number"
                        required
                        value={formData.rollNumber}
                        onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label>Student Name</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Enter your Full Name"
                        required
                        value={formData.studentName}
                        onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label>Select Faculty</label>
                    <select
                        className="faculty-select"
                        required
                        value={formData.faculty}
                        onChange={handleFacultyChange}
                    >
                        <option value="">Choose Faculty</option>
                        <option value="dr_smith">Dr. Emily Smith</option>
                        <option value="prof_johnson">Prof. Michael Johnson</option>
                        <option value="dr_williams">Dr. Sarah Williams</option>
                        <option value="prof_brown">Prof. David Brown</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Faculty Email</label>
                    <input
                        type="email"
                        className="form-input"
                        placeholder="Faculty Email"
                        value={facultyEmail}
                        readOnly
                    />
                </div>

                <div className="form-group">
                    <label>Feedback Message</label>
                    <textarea
                        className="form-input"
                        rows="4"
                        placeholder="Write your feedback here..."
                        required
                        value={formData.feedbackMessage}
                        onChange={(e) => setFormData({ ...formData, feedbackMessage: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label>Attach Files (Optional)</label>
                    <div className="file-input-container">
                        <input
                            type="file"
                            multiple
                            className="file-input"
                            id="fileInput"
                            onChange={handleFileChange}
                        />
                        <label htmlFor="fileInput" className="file-input-label">
                            <FaPaperclip /> Attach Files
                        </label>
                    </div>
                    <div className="file-list">
                        {files.map((file, index) => (
                            <div className="file-item" key={index}>
                                <span>{file.name} ({(file.size / 1024).toFixed(2)} KB)</span>
                                <span
                                    className="file-remove"
                                    onClick={() => removeFile(index)}
                                >
                                    <FaTrash />
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <button type="submit" className="feedback-submit">
                    Send Feedback
                </button>
            </form>
        </div>
    );
};

export default Feedback;
