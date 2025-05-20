import { useState, useEffect } from 'react';
import * as MdIcons from 'react-icons/md';
import styles from "@/styles/Modals.module.css";
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

export default function AddEquipment({ onClose }) {
    const user_id = Cookies.get('user_id');
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        status: '',
        health: '',
        description: '',
        created_by: user_id
    });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/Incharge_api/equipments');
                const data = await response.json();
                if (response.ok) {
                    const uniqueCategories = [...new Set(data.map(item => item.category))];
                    setCategories(uniqueCategories);
                } else {
                    throw new Error('Failed to fetch categories');
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                setError('Failed to load categories');
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user_id) {
            setError('User session is invalid. Please log in again.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch('/api/Incharge_api/equipments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to add equipment');
            }

            Swal.fire({
                icon: 'success',
                title: 'Equipment Added',
                text: 'The equipment has been successfully added.',
            }).then(() => {
                onClose();
                setFormData({
                    name: '',
                    category: '',
                    status: 'Available',
                    health: 'Good',
                    description: '',
                    created_by: user_id
                });
            });

        } catch (err) {
            setError(err.message);
            console.error('Submission error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.ModalMainBody}>
            <div className={styles.FormBody}>
                <span className={styles.HeaderTitleArea}>
                    <h2>Add Equipment</h2>
                    <MdIcons.MdDevices size={30} />
                </span>

                <form onSubmit={handleSubmit} className={styles.InputBodyAreaDiv}>
                    <div className="flex flex-col md:flex-row gap-2">
                        <div className="flex flex-col w-full">
                            <label className={styles.InputTitle}>Equipment Name*</label>
                            <input
                                className={styles.TypableInput}
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="flex flex-col w-full">
                            <label className={styles.InputTitle}>Category*</label>
                            <input
                                className={styles.TypableInput}
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                list="category-list"
                                required
                                disabled={isSubmitting || loadingCategories}
                            />
                            <datalist id="category-list">
                                {loadingCategories ? (
                                    <option value="">Loading categories...</option>
                                ) : (
                                    categories.map((category, index) => (
                                        <option key={index} value={category} />
                                    ))
                                )}
                            </datalist>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-2">
                        <div className="flex flex-col w-full">
                            <label className={styles.InputTitle}>Status*</label>
                            <select
                                className={styles.TypableInput}
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                                disabled={isSubmitting}
                            >
                                <option value=""></option>
                                <option value="Available">Available</option>
                                <option value="Maintenance">Maintenance</option>
                                <option value="Retired">Retired</option>
                            </select>
                        </div>
                        <div className="flex flex-col w-full">
                            <label className={styles.InputTitle}>Health*</label>
                            <select
                                className={styles.TypableInput}
                                name="health"
                                value={formData.health}
                                onChange={handleChange}
                                required
                                disabled={isSubmitting}
                            >
                                <option value=""></option>
                                <option value="New">New</option>
                                <option value="Excellent">Excellent</option>
                                <option value="Good">Good</option>
                                <option value="Fair">Fair</option>
                                <option value="Poor">Poor</option>
                                <option value="Broken">Broken</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col w-full">
                        <label className={styles.InputTitle}>Description</label>
                        <textarea
                            className={styles.TypableInput}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            disabled={isSubmitting}
                        />
                    </div>

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
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Submitting...
                                </>
                            ) : 'Submit'}
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
}
