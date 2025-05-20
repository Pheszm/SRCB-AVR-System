import { useState } from 'react';
import * as MdIcons from 'react-icons/md';
import styles from "@/styles/Modals.module.css";
import Swal from 'sweetalert2';



export default function AddStudent({ onClose }) {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        first_name: '',
        last_name: '',
        student_id: '',
        department: '',
        phone_number: '',
        sex: ''
    });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch('/api/Admin_api/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add student');
            }

            Swal.fire({
                icon: 'success',
                title: 'Student Added',
                text: 'The student has been successfully added.',
            }).then(() => {
                onClose();
            });

        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.ModalMainBody}>
            <div className={styles.FormBody}>
                <span className={styles.HeaderTitleArea}>
                    <h2>Add Student</h2>
                    <MdIcons.MdSchool size={30}/>
                </span>

                <form onSubmit={handleSubmit} className={styles.InputBodyAreaDiv}>
                    <div className="flex flex-col md:flex-row gap-2">
                        <div className="flex flex-col w-full">
                            <label className={styles.InputTitle}>First Name*</label>
                            <input 
                                className={styles.TypableInput} 
                                type="text" 
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="flex flex-col w-full">
                            <label className={styles.InputTitle}>Last Name*</label>
                            <input 
                                className={styles.TypableInput} 
                                type="text" 
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>



                    <div className="flex flex-col md:flex-row gap-2">
                        <div className="flex flex-col w-full">
                            <label className={styles.InputTitle}>Student ID*</label>
                            <input 
                                className={styles.TypableInput} 
                                type="text" 
                                name="student_id"
                                value={formData.student_id}
                                onChange={handleChange}
                                onInput={(e) => {
                                    e.target.value = e.target.value.toUpperCase().slice(0, 7);
                                }}
                                maxLength={7}
                                required
                            />
                        </div>
                        <div className="flex flex-col w-full">
                            <label className={styles.InputTitle}>Sex</label>
                            <select
                                className={styles.TypableInput}
                                name="sex"
                                value={formData.sex}
                                onChange={handleChange}
                            >
                                <option value=""></option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                    </div>

                    <label className={styles.InputTitle}>Phone Number*</label>
                        <input 
                            className={styles.TypableInput} 
                            type="text"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            onInput={(e) => {
                            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 11);
                        }}
                        inputMode="numeric"
                    />


                    <label className={styles.InputTitle}>Email*</label>
                    <input 
                        className={styles.TypableInput} 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <label className={styles.InputTitle}>Username*</label>
                    <input 
                        className={styles.TypableInput} 
                        type="text" 
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />

                    <label className={styles.InputTitle}>Password*</label>
                    <input 
                        className={styles.TypableInput} 
                        type="text" 
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                    />

                    <label className={styles.InputTitle}>Department</label>
                    <select
                        className={styles.TypableInput}
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                    >
                        <option value=""></option>
                        <option value="Higher Education Department">Higher Education Department</option>
                        <option value="Senior High School Department">Senior High School Department</option>
                        <option value="Junior High School Department">Junior High School Department</option>
                    </select>



                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-1 rounded relative mt-3">
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    <span className={styles.SpanFlex}>
                        <button 
                            className={styles.AddButton} 
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                        <button 
                            className={styles.CancelBtn} 
                            onClick={onClose}
                            type="button"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                    </span>
                </form>
            </div>
        </div>
    );
};