import { useState, useEffect } from 'react';
import * as MdIcons from 'react-icons/md';
import styles from "@/styles/Modals.module.css";
import Swal from 'sweetalert2';

export default function UpdateEquipment({ onClose, equipment }) {


    if (!equipment) {
        return null;
    }

    const [formData, setFormData] = useState({
        equipment_id: '',
        qr_code: '',
        name: '',
        category: '',
        status: '',
        health: '',
        description: ''
    });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    useEffect(() => {
        if (equipment) {
            setFormData({
                equipment_id: equipment.equipment_id,
                qr_code: equipment.qr_code,
                name: equipment.name,
                category: equipment.category,
                status: equipment.status || 'Available',
                health: equipment.health || 'Good',
                description: equipment.description || ''
            });
        }

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
    }, [equipment]);

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
            const response = await fetch('/api/Incharge_api/equipments', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update equipment');
            }

            Swal.fire({
                icon: 'success',
                title: 'Equipment Updated',
                text: 'The equipment has been successfully updated.',
                showConfirmButton: false,
                timer: 1500
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
                    <h2>Update Equipment</h2>
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
                            className={styles.UpdateButton}
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Updating...' : 'Update'}
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
