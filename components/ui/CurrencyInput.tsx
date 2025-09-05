
import React, { useState, useEffect } from 'react';

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({ value, onChange }) => {
  const [raw, setRaw] = useState(value?.toString() || "");

  useEffect(() => {
    setRaw(value?.toString() || "");
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/[^0-9.,]/g, "").replace(",", ".");
    setRaw(e.target.value);
    const num = parseFloat(v);
    onChange(Number.isFinite(num) ? num : 0);
  };

  return (
    <input
      className="w-full bg-transparent text-3xl font-semibold outline-none"
      inputMode="decimal"
      placeholder="R$ 0,00"
      value={raw}
      onChange={handleChange}
    />
  );
};

export default CurrencyInput;
