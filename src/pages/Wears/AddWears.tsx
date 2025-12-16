import React, { useState } from 'react';
import { createWear } from '../../api';
import '../Wears/styles/AddWears.css';
import { Upload } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const categories = ['asoebi', 'corporate', 'male', 'kiddies'];

const AddWears: React.FC = () => {
  const [wearName, setWearName] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wearName || !price || !description || !category || !image) {
      showToast('Please fill all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('wearName', wearName);
      fd.append('price', String(price));
      fd.append('description', description);
      fd.append('category', category);
      fd.append('image', image);

      await createWear(fd);
      showToast('Wear successfully submitted!');

      // Reset form
      setWearName('');
      setPrice('');
      setDescription('');
      setCategory(categories[0]);
      setImage(null);
      setPreview(null);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to submit wear.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="add-wears container">
      <div className="add-wear-header">
        <h2>Add Wear</h2>
        <p className="muted">
          Fill in the details below to add a new wear to the shop.
        </p>
      </div>

      <form className="add-form" onSubmit={onSubmit}>
        <label>
          Name <span className="required">*</span>
          <input
            className="add-wear-input"
            value={wearName}
            onChange={(e) => setWearName(e.target.value)}
            required
            placeholder="Enter wear name"
          />
        </label>

        <label>
          Price (₦) <span className="required">*</span>
          <input
            type="number"
            className="add-wear-input"
            value={price as any}
            onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
            required
            placeholder="Enter price"
          />
        </label>

        <label className="full">
          Description <span className="required">*</span>
          <textarea
            className="input textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Describe the wear. You can include the size of the wear in this format: Size 6 (Small), Size 8 (Medium), Size 10 (Large), Size 12 (Extra Large) etc., OR specify the size further e.g., Waist 30, Chest 32 etc., depending on the actual size of the wear."
          />
        </label>

        <label>
          Category
          <select
            className="add-wear-input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c.toUpperCase()}
              </option>
            ))}
          </select>
        </label>

        <label>
          Image
          <div className="upload-wrapper">
            <input
              id="wear-image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              hidden
            />
            <label htmlFor="wear-image" className="upload-btn">
              <Upload size={18} />
              <span>{image ? 'Change Image' : 'Upload Image'}</span>
            </label>
          </div>
          {preview && <img src={preview} alt="Preview" className="preview-img" />}
        </label>

        <div className="form-actions">
          <button
            className="btn-gold"
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddWears;
